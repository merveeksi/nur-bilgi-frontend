// src/services/paddlePaymentService.ts
import { PaddlePaymentRepository } from '../core/data/PaddlePaymentRepository';
import { InitializeCheckoutUseCase } from '../core/usecases/payment/InitializeCheckoutUseCase';
import { GetSubscriptionPlansUseCase } from '../core/usecases/payment/GetSubscriptionPlansUseCase';
import { VerifyTransactionUseCase } from '../core/usecases/payment/VerifyTransactionUseCase';
import { SubscriptionPlanModel } from '../core/domain/models/SubscriptionPlanModel';
import { PaddleTransactionModel } from '../core/domain/models/PaddleTransactionModel';

// Default vendor ID, should be replaced with your actual Paddle vendor ID from environment variables
const PADDLE_VENDOR_ID = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || '12345';
const PADDLE_ENVIRONMENT = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

// Initialize repository and use cases - lazily to ensure they're only created once when needed
let paddlePaymentRepository: PaddlePaymentRepository | null = null;
let initializeCheckoutUseCase: InitializeCheckoutUseCase | null = null;
let getSubscriptionPlansUseCase: GetSubscriptionPlansUseCase | null = null;
let verifyTransactionUseCase: VerifyTransactionUseCase | null = null;

// Get or initialize repositories and use cases
const getRepository = () => {
  if (!paddlePaymentRepository) {
    paddlePaymentRepository = new PaddlePaymentRepository(PADDLE_VENDOR_ID, PADDLE_ENVIRONMENT);
    initializeCheckoutUseCase = new InitializeCheckoutUseCase(paddlePaymentRepository);
    getSubscriptionPlansUseCase = new GetSubscriptionPlansUseCase(paddlePaymentRepository);
    verifyTransactionUseCase = new VerifyTransactionUseCase(paddlePaymentRepository);
  }
  
  return {
    paddlePaymentRepository,
    initializeCheckoutUseCase,
    getSubscriptionPlansUseCase,
    verifyTransactionUseCase
  };
};

// Map internal plan IDs to your Paddle plan IDs (will be used later when you have real Paddle IDs)
const PADDLE_PLAN_MAP: Record<string, string> = {
  'basic': 'basic',
  'premium': 'premium',
  'yearly': 'yearly'
};

/**
 * Initialize a Paddle checkout for a subscription plan
 */
export async function initiateSubscriptionCheckout(
  planId: string,
  userData: {
    email: string;
    userId: string;
    name?: string;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
  }
): Promise<void> {
  // Get the Paddle plan ID from the map
  const paddlePlanId = PADDLE_PLAN_MAP[planId];
  if (!paddlePlanId) {
    throw new Error(`Invalid plan ID: ${planId}`);
  }
  
  const { initializeCheckoutUseCase } = getRepository();
  if (!initializeCheckoutUseCase) {
    throw new Error('Paddle service not initialized');
  }
  
  // Pass planId in the passthrough data
  const userDataWithPlanId = {
    ...userData,
    planId
  };
  
  return initializeCheckoutUseCase.execute(paddlePlanId, userDataWithPlanId);
}

/**
 * Get all available subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlanModel[]> {
  const { getSubscriptionPlansUseCase } = getRepository();
  if (!getSubscriptionPlansUseCase) {
    throw new Error('Subscription plans service not initialized');
  }
  return getSubscriptionPlansUseCase.execute();
}

/**
 * Verify a transaction by ID
 */
export async function verifyTransaction(transactionId: string): Promise<PaddleTransactionModel | null> {
  const { verifyTransactionUseCase } = getRepository();
  if (!verifyTransactionUseCase) {
    throw new Error('Transaction verification service not initialized');
  }
  return verifyTransactionUseCase.execute(transactionId);
} 