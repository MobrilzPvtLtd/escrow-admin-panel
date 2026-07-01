// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Seller {
  id: number;
  userId?: number;
  name: string;
  email: string;
  businessName: string;
  website: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  idProofUrl: string;
  status: 'pending' | 'active' | 'rejected';
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payout' | 'sale' | 'refund';
  status: 'completed' | 'pending' | 'rejected';
  balanceAfter: number;
}

export interface VerifiedSeller {
  id: number;
  userId?: number;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  walletBalance: number; 
  pendingPayout?: number; 
  bankName: string;
  accountNumber: string;
  transactions: Transaction[];
}

export interface Transaction2 {
  id: string;
  backendId?: number;
  productName: string;
  price: number;
  date: string;
  shippingStatus: 'Pending' | 'Shipped' | 'Received' | 'Completed';
  paymentStatus: 'Held by Admin' | 'Released to Seller' | 'Refunded';
  
  // Expanded Details
  seller: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
  };
  buyer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface Buyer {
  id: number;
  userId?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended';
}