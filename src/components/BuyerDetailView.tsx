import React from 'react';
import { 
  ArrowLeft,  Mail, Phone, MapPin, 
  Calendar, ShoppingBag, CreditCard, 
} from 'lucide-react';
import type { Buyer } from '../types';

interface BuyerDetailViewProps {
  buyer: Buyer;
  onBack: () => void;
}

const BuyerDetailView: React.FC<BuyerDetailViewProps> = ({ buyer, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} /> Back to Buyers List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black">
                  {buyer.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{buyer.name}</h1>
                  <p className="text-slate-500 text-sm flex items-center gap-1">
                    <Calendar size={14} /> Member since {buyer.joinedDate}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                buyer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {buyer.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <DetailItem icon={Mail} label="Email Address" value={buyer.email} />
                <DetailItem icon={Phone} label="Phone Number" value={buyer.phone} />
              </div>
              <div className="space-y-6">
                <DetailItem icon={MapPin} label="Default Shipping Address" value={buyer.address} />
              </div>
            </div>
          </div>

          {/* Account Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Orders</p>
                <p className="text-2xl font-black text-slate-900">{buyer.totalOrders}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Spent</p>
                <p className="text-2xl font-black text-slate-900">${buyer.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Item Component
const DetailItem = ({ icon: Icon, label, value }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <div className="flex items-start gap-2 font-bold text-slate-800">
      <Icon size={16} className="text-indigo-500 shrink-0 mt-0.5" />
      <span className="leading-tight">{value}</span>
    </div>
  </div>
);

export default BuyerDetailView;