// src/core/data/PaddlePaymentRepository.ts
import { IPaddlePaymentRepository } from '../domain/repositories/IPaddlePaymentRepository';
import { PaddleTransactionModel } from '../domain/models/PaddleTransactionModel';
import { SubscriptionPlanModel } from '../domain/models/SubscriptionPlanModel';

// Define Paddle as a global type
declare global {
  interface Window {
    Paddle?: any;
  }
}

export class PaddlePaymentRepository implements IPaddlePaymentRepository {
  constructor(private paddleVendorId: string, private paddleEnvironment: 'sandbox' | 'production') {
    // Initialize Paddle with vendor ID when in browser - not needed for mock implementation
    console.log('PaddlePaymentRepository initialized');
  }

  async initializeCheckout(planId: string, customData: Record<string, any>): Promise<void> {
    // Instead of using Paddle's checkout, we'll use a mock implementation
    return new Promise((resolve) => {
      console.log('Initializing mock checkout for plan:', planId);
      console.log('Customer data:', customData);
      
      // Show a mock checkout dialog
      if (typeof window !== 'undefined') {
        // Create a modal dialog for the mock checkout
        const mockCheckoutDiv = document.createElement('div');
        mockCheckoutDiv.style.position = 'fixed';
        mockCheckoutDiv.style.top = '0';
        mockCheckoutDiv.style.left = '0';
        mockCheckoutDiv.style.width = '100%';
        mockCheckoutDiv.style.height = '100%';
        mockCheckoutDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        mockCheckoutDiv.style.display = 'flex';
        mockCheckoutDiv.style.alignItems = 'center';
        mockCheckoutDiv.style.justifyContent = 'center';
        mockCheckoutDiv.style.zIndex = '1000';
        
        const mockCheckoutContent = document.createElement('div');
        mockCheckoutContent.style.backgroundColor = 'white';
        mockCheckoutContent.style.padding = '20px';
        mockCheckoutContent.style.borderRadius = '8px';
        mockCheckoutContent.style.maxWidth = '500px';
        mockCheckoutContent.style.width = '100%';
        
        // Add plan details
        const planDetails = this.getMockPlanDetails(planId);
        
        mockCheckoutContent.innerHTML = `
          <h2 style="font-size: 24px; margin-bottom: 20px; color: #333;">Paddle Ödeme Simülasyonu</h2>
          <p style="margin-bottom: 15px;">Bu bir test Paddle ödeme işlemidir.</p>
          
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 10px; color: #555;">Plan Detayları</h3>
            <p><strong>Plan Adı:</strong> ${planDetails.name}</p>
            <p><strong>Fiyat:</strong> ${planDetails.price} ${planDetails.currency}</p>
            <p><strong>Periyot:</strong> ${planDetails.interval}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; margin-bottom: 10px; color: #555;">Müşteri Bilgileri</h3>
            <p><strong>Email:</strong> ${customData.email}</p>
            <p><strong>Ad:</strong> ${customData.name || 'Belirtilmemiş'}</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <button id="mock-checkout-cancel" style="padding: 10px 20px; background-color: #f1f1f1; border: none; border-radius: 4px; cursor: pointer;">İptal</button>
            <button id="mock-checkout-success" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Ödemeyi Tamamla</button>
          </div>
        `;
        
        mockCheckoutDiv.appendChild(mockCheckoutContent);
        document.body.appendChild(mockCheckoutDiv);
        
        // Handle buttons
        document.getElementById('mock-checkout-success')?.addEventListener('click', () => {
          if (customData.onSuccess) {
            customData.onSuccess({
              checkout: {
                id: 'mock-checkout-' + Math.floor(Math.random() * 1000000),
                completed: true
              }
            });
          }
          document.body.removeChild(mockCheckoutDiv);
          resolve();
        });
        
        document.getElementById('mock-checkout-cancel')?.addEventListener('click', () => {
          if (customData.onClose) {
            customData.onClose();
          }
          document.body.removeChild(mockCheckoutDiv);
          resolve();
        });
      } else {
        // If not in browser, just resolve
        setTimeout(() => {
          if (customData.onSuccess) {
            customData.onSuccess({
              checkout: {
                id: 'mock-checkout-' + Math.floor(Math.random() * 1000000),
                completed: true
              }
            });
          }
          resolve();
        }, 1000);
      }
    });
  }

  private getMockPlanDetails(planId: string): {name: string, price: string, currency: string, interval: string} {
    const plans: Record<string, {name: string, price: string, currency: string, interval: string}> = {
      'basic': {
        name: 'Temel Plan',
        price: '29.99',
        currency: 'TRY',
        interval: 'Aylık'
      },
      'premium': {
        name: 'Premium Plan',
        price: '79.99',
        currency: 'TRY',
        interval: 'Aylık'
      },
      'yearly': {
        name: 'Yıllık Plan',
        price: '599.99',
        currency: 'TRY',
        interval: 'Yıllık'
      }
    };
    
    return plans[planId] || {
      name: 'Bilinmeyen Plan',
      price: '0.00',
      currency: 'TRY',
      interval: 'Bilinmiyor'
    };
  }

  async verifyTransaction(transactionId: string): Promise<PaddleTransactionModel | null> {
    try {
      // Mock response for transaction verification
      const mockResponse = {
        success: true,
        response: {
          transaction_id: transactionId,
          status: 'completed',
          amount: '99.99',
          currency: 'TRY',
          created_at: new Date().toISOString(),
          customer: {
            id: 'cus_mock_' + Math.floor(Math.random() * 1000000),
            email: 'test@example.com'
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

  async getSubscriptionPlans(): Promise<SubscriptionPlanModel[]> {
    // Return hardcoded plans
    return [
      {
        id: 'basic',
        name: 'Temel Plan',
        price: 29.99,
        currency: 'TRY',
        interval: 'month',
        description: 'Aylık 50 AI soru hakkı'
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 79.99,
        currency: 'TRY',
        interval: 'month',
        description: 'Aylık 200 AI soru hakkı'
      },
      {
        id: 'yearly',
        name: 'Yıllık Plan',
        price: 599.99,
        currency: 'TRY',
        interval: 'year',
        description: 'Sınırsız AI soru hakkı'
      }
    ];
  }
} 