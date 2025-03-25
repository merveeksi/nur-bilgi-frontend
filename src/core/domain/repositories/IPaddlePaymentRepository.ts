import { PaddleTransactionModel } from '../models/PaddleTransactionModel';
import { SubscriptionPlanModel } from '../models/SubscriptionPlanModel';

export interface IPaddlePaymentRepository {
  initializeCheckout(planId: string, customData: Record<string, any>): Promise<void>;
  verifyTransaction(transactionId: string): Promise<PaddleTransactionModel | null>;
  getSubscriptionPlans(): Promise<SubscriptionPlanModel[]>;
} 