import { apiRequest } from './client';
import type { Transaction2 } from '../types';

export interface TransactionApiBuyer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface TransactionApiSeller {
  id: number;
  name: string;
  email: string;
  businessName: string;
  phone: string;
}

export interface TransactionApiItem {
  id: number;
  transactionId: string;
  title: string;
  description: string;
  amount: number;
  status: string;
  escrowStatus: string;
  buyer: TransactionApiBuyer;
  seller: TransactionApiSeller;
  deliveryAddress: string;
  purchasedOn: string;
  proofs: unknown[];
}

export interface TransactionListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  transactions: TransactionApiItem[];
}

export interface TransactionDetailResponse {
  success: boolean;
  transaction: TransactionApiItem & {
    timeline?: Array<{
      step: number;
      title: string;
      description: string;
      isCompleted: boolean;
      date: string;
    }>;
  };
}

export async function fetchTransactions(): Promise<TransactionApiItem[]> {
  const response = await apiRequest<TransactionListResponse>('/admin/transactions', {
    method: 'GET',
  });

  return response.transactions ?? [];
}

export async function fetchTransactionDetails(transactionId: number): Promise<TransactionDetailResponse> {
  return apiRequest<TransactionDetailResponse>(`/admin/transaction-details/${transactionId}`, {
    method: 'GET',
  });
}

export function mapTransactionToUiTransaction(transaction: TransactionApiItem): Transaction2 {
  return {
    id: transaction.transactionId,
    backendId: transaction.id,
    productName: transaction.title,
    price: transaction.amount,
    date: transaction.purchasedOn,
    shippingStatus: mapShippingStatus(transaction.status),
    paymentStatus: mapPaymentStatus(transaction.escrowStatus),
    seller: {
      name: transaction.seller.name,
      businessName: transaction.seller.businessName,
      email: transaction.seller.email,
      phone: transaction.seller.phone,
    },
    buyer: {
      name: transaction.buyer.name,
      email: transaction.buyer.email,
      phone: transaction.buyer.phone,
      address: transaction.deliveryAddress,
    },
  };
}

function mapShippingStatus(status: string): Transaction2['shippingStatus'] {
  switch (status.toUpperCase()) {
    case 'RELEASED':
      return 'Completed';
    case 'SHIPPED':
      return 'Shipped';
    case 'BLOCKED':
    default:
      return 'Pending';
  }
}

function mapPaymentStatus(status: string): Transaction2['paymentStatus'] {
  switch (status.toUpperCase()) {
    case 'RELEASED':
      return 'Released to Seller';
    case 'HELD BY ADMIN':
    default:
      return 'Held by Admin';
  }
}
