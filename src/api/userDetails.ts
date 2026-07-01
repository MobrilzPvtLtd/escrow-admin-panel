import { apiRequest } from './client';
import type { Buyer, Seller, VerifiedSeller } from '../types';

export interface UserDetailsResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    sellerProfile?: {
      id: number;
      userId: number;
      businessName: string;
      description: string;
      website: string;
      rating: number;
      logoUrl: string | null;
      isVerified: boolean;
    };
    _count: {
      buyerDeals: number;
      sellerDeals: number;
    };
  };
}

export async function fetchUserDetails(userId: number): Promise<UserDetailsResponse> {
  return apiRequest<UserDetailsResponse>(`/admin/user-details/${userId}`, {
    method: 'GET',
  });
}

export function mapUserToPendingSeller(user: UserDetailsResponse['user']): Seller {
  return {
    id: user.sellerProfile?.id ?? user.id,
    userId: user.id,
    name: user.name,
    email: user.email,
    businessName: user.sellerProfile?.businessName ?? '',
    website: user.sellerProfile?.website ?? '',
    phone: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    idProofUrl: user.sellerProfile?.logoUrl ?? '',
    status: user.sellerProfile?.isVerified ? 'active' : 'pending',
  };
}

export function mapUserToVerifiedSeller(user: UserDetailsResponse['user']): VerifiedSeller {
  return {
    id: user.sellerProfile?.id ?? user.id,
    userId: user.id,
    name: user.name,
    businessName: user.sellerProfile?.businessName ?? '',
    email: user.email,
    phone: '',
    walletBalance: 0,
    bankName: '',
    accountNumber: '',
    transactions: [],
  };
}

export function mapUserToBuyer(user: UserDetailsResponse['user']): Buyer {
  return {
    id: user.id,
    userId: user.id,
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
