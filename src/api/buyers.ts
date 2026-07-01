import { apiRequest } from './client';
import type { Buyer } from '../types';

export interface BuyerApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    buyerDeals: number;
    sellerDeals: number;
  };
}

export interface BuyerListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  users: BuyerApiUser[];
}

export async function fetchBuyers(): Promise<BuyerApiUser[]> {
  const response = await apiRequest<BuyerListResponse>('/admin/buyers-list', {
    method: 'GET',
  });

  return response.users ?? [];
}

export function mapBuyerToUiBuyer(user: BuyerApiUser): Buyer {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: '',
    address: '',
    joinedDate: new Date(user.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    totalOrders: user._count.buyerDeals,
    totalSpent: 0,
    status: 'active',
  };
}
