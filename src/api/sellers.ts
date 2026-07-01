import { apiRequest } from './client';
import type { Seller, VerifiedSeller } from '../types';

export interface SellerApiUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  _count: {
    sellerDeals: number;
  };
}

export interface SellerApiItem {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  website: string;
  rating: number;
  logoUrl: string | null;
  isVerified: boolean;
  user: SellerApiUser;
}

export interface SellerListResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  sellers: SellerApiItem[];
}

export async function fetchSellers(isVerified: boolean): Promise<SellerApiItem[]> {
  const response = await apiRequest<SellerListResponse>(`/admin/sellers?isVerified=${isVerified}`, {
    method: 'GET',
  });

  return response.sellers ?? [];
}

export function mapSellerToPendingSeller(seller: SellerApiItem): Seller {
  return {
    id: seller.id,
    name: seller.user.name,
    email: seller.user.email,
    businessName: seller.businessName,
    website: seller.website,
    phone: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    idProofUrl: seller.logoUrl ?? '',
    status: seller.isVerified ? 'active' : 'pending',
  };
}

export function mapSellerToVerifiedSeller(seller: SellerApiItem): VerifiedSeller {
  return {
    id: seller.id,
    name: seller.user.name,
    businessName: seller.businessName,
    email: seller.user.email,
    phone: '',
    walletBalance: 0,
    bankName: '',
    accountNumber: '',
    transactions: [],
  };
}
