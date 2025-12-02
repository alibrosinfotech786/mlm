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