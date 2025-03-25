// src/core/usecases/payment/VerifyTransactionUseCase.ts
import { IPaddlePaymentRepository } from '../../domain/repositories/IPaddlePaymentRepository';
import { PaddleTransactionModel } from '../../domain/models/PaddleTransactionModel';

export class VerifyTransactionUseCase {
  constructor(private paddlePaymentRepository: IPaddlePaymentRepository) {}

  async execute(transactionId: string): Promise<PaddleTransactionModel | null> {
    return this.paddlePaymentRepository.verifyTransaction(transactionId);
  }
} 