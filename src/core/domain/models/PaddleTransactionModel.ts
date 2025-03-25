export interface PaddleTransactionModel {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: Date;
  customerEmail: string;
  customerId: string;
} 