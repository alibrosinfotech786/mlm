<?php

namespace App\Http\Controllers;

use App\Models\WalletTransaction;
use App\Models\WalletHistory;
use App\Models\User;
use App\Mail\WalletRequestEmail;
use App\Mail\WalletStatusUpdateEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Exception;

class WalletTransactionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = WalletTransaction::with('user');
            
            if ($request->has('status') && $request->status !== '') {
                $query->where('status', $request->status);
            }
            
            if ($request->has('user_id') && $request->user_id !== '') {
                $query->where('user_id', $request->user_id);
            }
            
            $transactions = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'transactions' => $transactions
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRANSACTIONS_FETCH_ERROR',
                'message' => 'Failed to fetch transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'deposit_by' => 'required|string|max:255',
                'deposit_to' => 'required|string|max:255',
                'deposit_amount' => 'required|numeric|min:0.01',
                'ref_transaction_id' => 'required|string|max:255',
                'remark' => 'nullable|string',
                'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            $data = [
                'user_id' => $request->user()->user_id,
                'auto_transaction_id' => $this->generateTransactionId(),
                'deposit_by' => $request->deposit_by,
                'deposit_to' => $request->deposit_to,
                'deposit_amount' => $request->deposit_amount,
                'ref_transaction_id' => $request->ref_transaction_id,
                'remark' => $request->remark,
            ];

            if ($request->hasFile('attachment')) {
                $data['attachment'] = $this->uploadAttachment($request->file('attachment'));
            }

            $transaction = WalletTransaction::create($data);
            
            // Load user relationship
            $user = $request->user();
            
            // Send email notification
            try {
                Mail::to($user->email)->send(new WalletRequestEmail($transaction, $user));
            } catch (Exception $e) {
                // Log email error but don't fail the request
                \Log::error('Wallet request email failed to send: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'transaction' => $transaction,
                'message' => 'Wallet transaction request created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRANSACTION_CREATE_ERROR',
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approve(Request $request)
    {
        try {
            // Debug: Log the request data
            \Log::info('Approve request data:', $request->all());
            
            $request->validate([
                'id' => 'required|exists:wallet_transactions,id',
                'status' => 'required|in:approved,pending,rejected'
            ]);

            $transaction = WalletTransaction::with('user')->findOrFail($request->id);
            $oldStatus = $transaction->status;
            $user = $transaction->user;

            // Handle wallet balance changes
            if ($oldStatus === 'approved' && in_array($request->status, ['pending', 'rejected'])) {
                // Debit wallet when changing from approved to pending/rejected
                $previousBalance = $user->wallet_balance;
                $user->decrement('wallet_balance', $transaction->deposit_amount);
                $user->refresh();
                
                WalletHistory::create([
                    'user_id' => $user->user_id,
                    'transaction_id' => $this->generateTransactionId(),
                    'previous_balance' => $previousBalance,
                    'amount_change' => -$transaction->deposit_amount,
                    'new_balance' => $user->wallet_balance,
                    'type' => 'debit',
                    'reason' => 'wallet_deposit_reverted',
                    'reference_transaction_id' => $transaction->ref_transaction_id,
                ]);
            } elseif ($oldStatus !== 'approved' && $request->status === 'approved') {
                // Credit wallet when changing to approved
                $previousBalance = $user->wallet_balance;
                $user->increment('wallet_balance', $transaction->deposit_amount);
                $user->refresh();
                
                WalletHistory::create([
                    'user_id' => $user->user_id,
                    'transaction_id' => $this->generateTransactionId(),
                    'previous_balance' => $previousBalance,
                    'amount_change' => $transaction->deposit_amount,
                    'new_balance' => $user->wallet_balance,
                    'type' => 'credit',
                    'reason' => 'wallet_deposit_approved',
                    'reference_transaction_id' => $transaction->ref_transaction_id,
                ]);
            }

            $transaction->update([
                'status' => $request->status,
                'status_updated_by' => $request->user()->user_id,
                'status_updated_at' => now()
            ]);
            $transaction->refresh();

            // Send email notification to user's email
            if ($user && $user->email) {
                try {
                    Mail::to($user->email)->send(new WalletStatusUpdateEmail($transaction, $user, $oldStatus, $request->status));
                } catch (Exception $e) {
                    // Log email error but don't fail the request
                    \Log::error('Wallet status update email failed to send: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'transaction' => $transaction,
                'message' => 'Transaction ' . $request->status . ' successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'TRANSACTION_APPROVE_ERROR',
                'message' => 'Failed to process transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function walletHistory(Request $request)
    {
        try {
            $query = WalletHistory::with('user');
            
            if ($request->has('user_id') && $request->user_id !== '') {
                $query->where('user_id', $request->user_id);
            } else {
                $query->where('user_id', $request->user()->user_id);
            }
            
            $histories = $query->orderBy('created_at', 'desc')->paginate(20);

            return response()->json([
                'success' => true,
                'wallet_histories' => $histories
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'WALLET_HISTORY_FETCH_ERROR',
                'message' => 'Failed to fetch wallet history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function debitWallet(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,user_id',
                'amount' => 'required|numeric|min:0.01',
                'reason' => 'required|string|max:255',
                'reference_transaction_id' => 'nullable|string|max:255'
            ]);
            
            $user = User::where('user_id', $request->user_id)->first();
            
            if ($user->wallet_balance < $request->amount) {
                return response()->json([
                    'success' => false,
                    'error_type' => 'INSUFFICIENT_BALANCE',
                    'message' => 'Insufficient wallet balance'
                ], 422);
            }
            
            $previousBalance = $user->wallet_balance;
            $user->decrement('wallet_balance', $request->amount);
            $user->refresh();
            
            // Log wallet history
            WalletHistory::create([
                'user_id' => $user->user_id,
                'transaction_id' => $this->generateTransactionId(),
                'previous_balance' => $previousBalance,
                'amount_change' => -$request->amount,
                'new_balance' => $user->wallet_balance,
                'type' => 'debit',
                'reason' => $request->reason,
                'reference_transaction_id' => $request->reference_transaction_id,
            ]);
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Amount debited successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'WALLET_DEBIT_ERROR',
                'message' => 'Failed to debit wallet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function generateTransactionId()
    {
        $prefix = 'WTX';
        $timestamp = date('YmdHis');
        $random = strtoupper(substr(uniqid(), -4));
        return $prefix . $timestamp . $random;
    }

    private function uploadAttachment($file)
    {
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = "uploads/wallet_attachments/" . $fileName;
        $file->move(public_path("uploads/wallet_attachments"), $fileName);
        return $path;
    }
}