// src/core/usecases/payment/GetSubscriptionPlansUseCase.ts
import { IPaddlePaymentRepository } from '../../domain/repositories/IPaddlePaymentRepository';
import { SubscriptionPlanModel } from '../../domain/models/SubscriptionPlanModel';

export class GetSubscriptionPlansUseCase {
  constructor(private paddlePaymentRepository: IPaddlePaymentRepository) {}

  async execute(): Promise<SubscriptionPlanModel[]> {
    return this.paddlePaymentRepository.getSubscriptionPlans();
  }
} 