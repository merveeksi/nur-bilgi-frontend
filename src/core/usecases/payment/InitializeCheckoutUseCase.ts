// src/core/usecases/payment/InitializeCheckoutUseCase.ts
import { IPaddlePaymentRepository } from '../../domain/repositories/IPaddlePaymentRepository';

export class InitializeCheckoutUseCase {
  constructor(private paddlePaymentRepository: IPaddlePaymentRepository) {}

  async execute(planId: string, userData: {
    email: string;
    userId: string;
    name?: string;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
  }): Promise<void> {
    return this.paddlePaymentRepository.initializeCheckout(planId, userData);
  }
} 