import React from 'react';
import { 
  ArrowLeft, Package, User, Store, Calendar, 
  CreditCard, MapPin, CheckCircle2 
} from 'lucide-react';
import type { Transaction2 } from '../types';

interface TransactionDetailViewProps {
  transaction: Transaction2;
  onBack: () => void;
}

const TransactionDetailView: React.FC<TransactionDetailViewProps> = ({ transaction, onBack }) => {
  
  // Helper to color status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Held by Admin': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} /> Back to Transactions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Transaction Header & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">Transaction ID: {transaction.id}</span>
                <h1 className="text-3xl font-bold text-slate-900">{transaction.productName}</h1>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <Calendar size={16} /> Purchased on {transaction.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <CreditCard size={16} /> Total: <span className="text-slate-900 font-bold">${transaction.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${getStatusColor(transaction.shippingStatus)}`}>
                  {transaction.shippingStatus}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(transaction.paymentStatus)}`}>
                  {transaction.paymentStatus}
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full mb-8" />

            {/* Parties Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Seller Details */}
              <div>
                <h3 className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Store size={14} /> Seller Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{transaction.seller.businessName}</p>
                    <p className="text-sm text-slate-500">{transaction.seller.name}</p>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    <p>{transaction.seller.email}</p>
                    <p>{transaction.seller.phone}</p>
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div>
                <h3 className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <User size={14} /> Buyer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{transaction.buyer.name}</p>
                    <p className="text-sm text-slate-500">{transaction.buyer.email}</p>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    <p>{transaction.buyer.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <MapPin size={14} /> Delivery Address
            </h3>
            <p className="text-slate-700 font-medium leading-relaxed">
              {transaction.buyer.address}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Escrow Status Timeline */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl h-full">
            <h3 className="text-lg font-bold mb-8">Escrow Timeline</h3>
            
            <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800" />

              {/* Step 1 */}
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">Payment Received</p>
                  <p className="text-xs text-slate-400 mt-1">Admin is holding ${transaction.price} in escrow.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  transaction.shippingStatus !== 'Pending' ? 'bg-green-500' : 'bg-slate-700'
                }`}>
                  {transaction.shippingStatus !== 'Pending' ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                </div>
                <div>
                  <p className="text-sm font-bold">Product Shipped</p>
                  <p className="text-xs text-slate-400 mt-1">Seller has provided tracking details.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  transaction.shippingStatus === 'Completed' ? 'bg-green-500' : 'bg-slate-700 text-slate-500'
                }`}>
                  {transaction.shippingStatus === 'Completed' ? <CheckCircle2 size={14} /> : <Package size={12} />}
                </div>
                <div>
                  <p className="text-sm font-bold">Funds Released</p>
                  <p className="text-xs text-slate-400 mt-1">Funds will be added to Seller's wallet after buyer confirmation.</p>
                </div>
              </div>
            </div>

            {/* Admin Quick Action */}
            <div className="mt-12 pt-8 border-t border-slate-800">
               <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                 As an admin, you can manually intervene if there is a dispute between the parties.
               </p>
               <button className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors uppercase tracking-widest">
                 Open Dispute Case
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransactionDetailView;