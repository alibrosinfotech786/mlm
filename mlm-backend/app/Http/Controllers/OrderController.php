<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\BvHistory;
use App\Mail\OrderConfirmationEmail;
use App\Mail\OrderStatusUpdateEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Order::with(['orderItems.product', 'user']);
            
            if ($request->has('user_id') && $request->user_id !== '') {
                $query->whereHas('user', function($q) use ($request) {
                    $q->where('user_id', $request->user_id);
                });
            }
            
            $orders = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ORDERS_FETCH_ERROR',
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $rules = [
                'payment_mode' => 'required|in:cod,online,wallet',
                'billing_full_name' => 'required|string|max:255',
                'billing_email' => 'required|email',
                'billing_contact' => 'required|string|max:20',
                'billing_country' => 'required|string|max:100',
                'billing_state' => 'required|string|max:100',
                'billing_city' => 'required|string|max:100',
                'billing_pincode' => 'required|string|max:10',
                'shipping_full_name' => 'required|string|max:255',
                'shipping_email' => 'required|email',
                'shipping_contact' => 'required|string|max:20',
                'shipping_country' => 'required|string|max:100',
                'shipping_state' => 'required|string|max:100',
                'shipping_city' => 'required|string|max:100',
                'shipping_pincode' => 'required|string|max:10',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
            ];

            // When paying via wallet, transaction password is required
            if ($request->payment_mode === 'wallet') {
                $rules['transaction_password'] = 'required|string';
            }

            $request->validate($rules);

            $orderNumber = 'ORD' . time() . rand(1000, 9999);
            $totalBv = 0;
            $totalMrp = 0;

            // Calculate totals
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $itemTotal = $product->mrp * $item['quantity'];
                $totalBv += $product->bv * $item['quantity'];
                $totalMrp += $itemTotal;
            }

            $user = $request->user();

            $order = DB::transaction(function () use ($request, $user, $orderNumber, $totalBv, $totalMrp) {
                // Wallet payment checks and deduction
                if ($request->payment_mode === 'wallet') {
                    // Verify transaction password
                    if (!$user->transaction_password || !Hash::check($request->transaction_password, $user->transaction_password)) {
                        throw ValidationException::withMessages([
                            'transaction_password' => ['Invalid transaction password.'],
                        ]);
                    }

                    // Ensure sufficient wallet balance
                    if ($user->wallet_balance < $totalMrp) {
                        throw ValidationException::withMessages([
                            'wallet_balance' => ['Insufficient wallet balance.'],
                        ]);
                    }

                    // Store previous balance for history
                    $previousBalance = $user->wallet_balance;
                    
                    // Deduct wallet balance
                    $user->decrement('wallet_balance', $totalMrp);
                    $user->refresh();
                    
                    // Record wallet transaction
                    \App\Models\WalletTransaction::create([
                        'user_id' => $user->user_id,
                        'deposit_by' => $user->user_id,
                        'deposit_to' => 'ORDER_PAYMENT',
                        'deposit_amount' => $totalMrp,
                        'ref_transaction_id' => $orderNumber,
                        'remark' => 'Order payment - ' . $orderNumber,
                        'status' => 'approved',
                        'status_updated_by' => $user->user_id,
                        'status_updated_at' => now()
                    ]);
                    
                    // Record wallet history
                    \App\Models\WalletHistory::create([
                        'user_id' => $user->user_id,
                        'transaction_id' => 'TXN' . time() . rand(100, 999),
                        'previous_balance' => $previousBalance,
                        'amount_change' => -$totalMrp,
                        'new_balance' => $user->wallet_balance,
                        'type' => 'debit',
                        'reason' => 'Order payment - ' . $orderNumber,
                        'reference_transaction_id' => $orderNumber
                    ]);
                }

                $order = Order::create([
                    'user_id' => $user->id,
                    'order_number' => $orderNumber,
                    'payment_mode' => $request->payment_mode,
                    'billing_full_name' => $request->billing_full_name,
                    'billing_email' => $request->billing_email,
                    'billing_contact' => $request->billing_contact,
                    'billing_country' => $request->billing_country,
                    'billing_state' => $request->billing_state,
                    'billing_city' => $request->billing_city,
                    'billing_pincode' => $request->billing_pincode,
                    'shipping_full_name' => $request->shipping_full_name,
                    'shipping_email' => $request->shipping_email,
                    'shipping_contact' => $request->shipping_contact,
                    'shipping_country' => $request->shipping_country,
                    'shipping_state' => $request->shipping_state,
                    'shipping_city' => $request->shipping_city,
                    'shipping_pincode' => $request->shipping_pincode,
                    'total_bv' => $totalBv,
                    'total_mrp' => $totalMrp,
                ]);

                // Create order items
                foreach ($request->items as $item) {
                    $product = Product::findOrFail($item['product_id']);
                    $itemTotal = $product->mrp * $item['quantity'];

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity' => $item['quantity'],
                        'bv' => $product->bv,
                        'mrp' => $product->mrp,
                        'total' => $itemTotal,
                    ]);
                }

                return $order;
            });

            // Send order confirmation email to logged-in user's email
            try {
                $orderWithItems = $order->load('orderItems');
                \Mail::to($user->email)->send(new OrderConfirmationEmail($orderWithItems));
            } catch (Exception $mailException) {
                // Log but don't fail the order if email sending fails
                \Log::error('Failed to send order confirmation email: ' . $mailException->getMessage());
            }

            return response()->json([
                'success' => true,
                'order' => $order->load('orderItems'),
                'message' => 'Order created successfully'
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
                'error_type' => 'ORDER_CREATE_ERROR',
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function refund(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id'
            ]);

            $order = Order::with('user')->findOrFail($request->order_id);
            
            if ($order->status !== 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only cancelled orders can be refunded'
                ], 400);
            }
            
            if (!in_array($order->payment_mode, ['wallet', 'online'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Refund only available for wallet and online payments'
                ], 400);
            }

            $user = $order->user;
            $refundAmount = $order->total_mrp;

            DB::transaction(function () use ($order, $user, $refundAmount) {
                $previousBalance = $user->wallet_balance;
                
                $user->increment('wallet_balance', $refundAmount);
                $user->refresh();
                
                \App\Models\WalletTransaction::create([
                    'user_id' => $user->user_id,
                    'deposit_by' => 'SYSTEM',
                    'deposit_to' => $user->user_id,
                    'deposit_amount' => $refundAmount,
                    'ref_transaction_id' => $order->order_number,
                    'remark' => 'Refund for cancelled order - ' . $order->order_number,
                    'status' => 'approved',
                    'status_updated_by' => 'SYSTEM',
                    'status_updated_at' => now()
                ]);
                
                \App\Models\WalletHistory::create([
                    'user_id' => $user->user_id,
                    'transaction_id' => 'REF' . time() . rand(100, 999),
                    'previous_balance' => $previousBalance,
                    'amount_change' => $refundAmount,
                    'new_balance' => $user->wallet_balance,
                    'type' => 'credit',
                    'reason' => 'Refund for cancelled order - ' . $order->order_number,
                    'reference_transaction_id' => $order->order_number
                ]);
                
                // Update order status to refunded
                $order->update(['status' => 'refunded']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Order refunded successfully',
                'refund_amount' => $refundAmount,
                'new_wallet_balance' => $user->fresh()->wallet_balance
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'REFUND_ERROR',
                'message' => 'Failed to process refund',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $request->validate(['id' => 'required|exists:orders,id']);
            
            $order = Order::with('orderItems.product')
                ->where('id', $request->id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'order' => $order
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ORDER_NOT_FOUND',
                'message' => 'Order not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error_type' => 'ORDER_FETCH_ERROR',
                'message' => 'Failed to fetch order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:orders,id',
                'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
            ]);

            $order = Order::with(['user', 'orderItems'])->findOrFail($request->id);
            $oldStatus = $order->status;
            $order->update(['status' => $request->status]);
            $order->refresh();
            
            // Send email notification to billing_email
            try {
                Mail::to($order->billing_email)->send(new OrderStatusUpdateEmail($order, $oldStatus, $request->status));
            } catch (Exception $e) {
                // Log email error but don't fail the request
                \Log::error('Order status update email failed to send: ' . $e->getMessage());
            }
            
            // Add BV to user when order status changes to delivered
            if ($request->status === 'delivered' && $oldStatus !== 'delivered') {
                $user = $order->user;
                $oldBv = $user->bv;
                $wasActive = $user->isActive;
                
                $user->increment('bv', $order->total_bv);
                $user->refresh();
                
                // Log BV history
                BvHistory::create([
                    'user_id' => $user->user_id,
                    'previous_bv' => $oldBv,
                    'bv_change' => $order->total_bv,
                    'new_bv' => $user->bv,
                    'type' => 'credit',
                    'reason' => 'order_delivered',
                    'reference_id' => $order->order_number,
                ]);
                
                $user->updateStatusBasedOnBv();
                
                // Credit sponsor wallet with 10% of total BV when user becomes active (reaches 1000 BV)
                if ($user->sponsor_id && !$wasActive && $user->isActive && $user->bv >= 1000) {
                    $sponsor = User::where('user_id', $user->sponsor_id)->first();
                    if ($sponsor) {
                        $referralBonus = $user->bv * 0.10;
                        $previousBalance = $sponsor->wallet_balance;
                        
                        $sponsor->increment('wallet_balance', $referralBonus);
                        $sponsor->refresh();
                        
                        // Create wallet transaction record
                        \App\Models\WalletTransaction::create([
                            'user_id' => $sponsor->user_id,
                            'deposit_by' => 'SYSTEM',
                            'deposit_to' => $sponsor->user_id,
                            'deposit_amount' => $referralBonus,
                            'ref_transaction_id' => $user->user_id,
                            'remark' => 'Referral bonus from ' . $user->name . ' (' . $user->user_id . ')',
                            'status' => 'approved',
                            'status_updated_by' => 'SYSTEM',
                            'status_updated_at' => now()
                        ]);
                        
                        // Create wallet history record
                        \App\Models\WalletHistory::create([
                            'user_id' => $sponsor->user_id,
                            'transaction_id' => 'REF' . time() . rand(100, 999),
                            'previous_balance' => $previousBalance,
                            'amount_change' => $referralBonus,
                            'new_balance' => $sponsor->wallet_balance,
                            'type' => 'credit',
                            'reason' => 'Referral bonus from ' . $user->name . ' (' . $user->user_id . ')',
                            'reference_transaction_id' => $user->user_id
                        ]);
                    }
                }
            }
            
            // Subtract BV from user when order status changes from delivered to other status
            if ($oldStatus === 'delivered' && $request->status !== 'delivered') {
                $user = $order->user;
                $oldBv = $user->bv;
                $wasActive = $user->isActive;
                
                $user->decrement('bv', $order->total_bv);
                $user->refresh();
                
                // Log BV history
                BvHistory::create([
                    'user_id' => $user->user_id,
                    'previous_bv' => $oldBv,
                    'bv_change' => -$order->total_bv,
                    'new_bv' => $user->bv,
                    'type' => 'debit',
                    'reason' => 'order_cancelled',
                    'reference_id' => $order->order_number,
                ]);
                
                $user->updateStatusBasedOnBv();
                
                // Subtract referral bonus from sponsor wallet if user becomes inactive again
                if ($user->sponsor_id && $wasActive && !$user->isActive && $user->bv < 1000) {
                    $sponsor = User::where('user_id', $user->sponsor_id)->first();
                    if ($sponsor) {
                        $referralBonus = ($user->bv + $order->total_bv) * 0.10;
                        $previousBalance = $sponsor->wallet_balance;
                        
                        $sponsor->decrement('wallet_balance', $referralBonus);
                        $sponsor->refresh();
                        
                        // Create wallet transaction record
                        \App\Models\WalletTransaction::create([
                            'user_id' => $sponsor->user_id,
                            'deposit_by' => 'SYSTEM',
                            'deposit_to' => 'REVERSAL',
                            'deposit_amount' => $referralBonus,
                            'ref_transaction_id' => $user->user_id,
                            'remark' => 'Referral bonus reversal for ' . $user->name . ' (' . $user->user_id . ')',
                            'status' => 'approved',
                            'status_updated_by' => 'SYSTEM',
                            'status_updated_at' => now()
                        ]);
                        
                        // Create wallet history record
                        \App\Models\WalletHistory::create([
                            'user_id' => $sponsor->user_id,
                            'transaction_id' => 'REV' . time() . rand(100, 999),
                            'previous_balance' => $previousBalance,
                            'amount_change' => -$referralBonus,
                            'new_balance' => $sponsor->wallet_balance,
                            'type' => 'debit',
                            'reason' => 'Referral bonus reversal for ' . $user->name . ' (' . $user->user_id . ')',
                            'reference_transaction_id' => $user->user_id
                        ]);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'order' => $order,
                'message' => 'Order status updated successfully'
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
                'error_type' => 'ORDER_UPDATE_ERROR',
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}