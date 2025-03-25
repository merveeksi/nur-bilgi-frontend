import { NextRequest, NextResponse } from 'next/server';
import { PaddleTransactionModel } from '@/core/domain/models/PaddleTransactionModel';

// Mock server-side transaction verification
// In a real app, this would be an API call to Paddle's server APIs
async function verifyPaddleTransaction(transactionId: string): Promise<PaddleTransactionModel | null> {
  try {
    // Simulate API call with mock data
    const mockResponse = {
      success: true,
      response: {
        transaction_id: transactionId,
        status: 'completed',
        amount: '99.99',
        currency: 'USD',
        created_at: new Date().toISOString(),
        customer: {
          id: 'cus_12345',
          email: 'user@example.com'
        }
      }
    };

    if (mockResponse.success) {
      return {
        transactionId: mockResponse.response.transaction_id,
        status: mockResponse.response.status,
        amount: parseFloat(mockResponse.response.amount),
        currency: mockResponse.response.currency,
        createdAt: new Date(mockResponse.response.created_at),
        customerEmail: mockResponse.response.customer.email,
        customerId: mockResponse.response.customer.id
      };
    }
    return null;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return null;
  }
}

// This route handles incoming webhooks from Paddle
export async function POST(req: NextRequest) {
  try {
    // Get webhook data
    const data = await req.json();
    
    // Verify the webhook signature (in a production app, you should verify the signature)
    // For now, we'll skip this step but in production you should implement proper verification
    
    // Handle different alert types
    switch (data.alert_name) {
      case 'payment_succeeded':
        // Handle successful payment
        const { checkout_id, email, passthrough } = data;
        console.log(`Payment succeeded for checkout ${checkout_id} from ${email}`);
        
        // Parse passthrough data
        let customData = {};
        try {
          customData = JSON.parse(passthrough);
        } catch (e) {
          console.error("Failed to parse passthrough data:", e);
        }
        
        // Verify the transaction using the server-side function
        const transaction = await verifyPaddleTransaction(checkout_id);
        if (transaction) {
          // In a real app, you'd update the user's subscription status in your database
          console.log(`Transaction verified: ${transaction.transactionId}`);
          
          // TODO: Update user subscription in database
          // Example: await updateUserSubscription(customData.userId, customData.planId, transaction);
        }
        break;
        
      case 'subscription_created':
        // Handle subscription creation
        console.log(`Subscription created: ${data.subscription_id}`);
        // TODO: Save subscription details
        break;
        
      case 'subscription_cancelled':
        // Handle subscription cancellation
        console.log(`Subscription cancelled: ${data.subscription_id}`);
        // TODO: Update subscription status in database
        break;
        
      default:
        console.log(`Unhandled webhook type: ${data.alert_name}`);
    }
    
    // Return a success response to Paddle
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Paddle webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 