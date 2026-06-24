import React, { useState } from 'react';
import { 
  ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, 
  History, CheckCircle2, XCircle, Landmark, AlertCircle, Clock
} from 'lucide-react';
import type { VerifiedSeller } from '../types';

interface VerifiedSellerDetailViewProps {
  seller: VerifiedSeller;
  onBack: () => void;
  onProcessPayout: (id: number, amount: number) => void;
  onRejectPayout: (id: number, amount: number, reason: string) => void;
}

const VerifiedSellerDetailView: React.FC<VerifiedSellerDetailViewProps> = ({ 
  seller, onBack, onProcessPayout, onRejectPayout 
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <ArrowLeft size={18} /> Back to Verified Sellers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Profile & Wallet Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Wallet Card */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={120} />
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Total Wallet Balance</p>
            <h2 className="text-4xl font-black mb-6">${seller.walletBalance.toLocaleString()}</h2>
            
            <div className="flex flex-col gap-4">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Bank Account</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Landmark size={14} className="text-indigo-400" />
                  {seller.bankName} • {seller.accountNumber.slice(-4).padStart(8, '*')}
                </div>
              </div>
            </div>
          </div>

          {/* Payout Request Card (Only shows if a request exists) */}
          {seller.pendingPayout ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
              <div className="flex items-center gap-2 text-amber-700 font-bold mb-4">
                <Clock size={20} /> Payout Requested
              </div>
              <p className="text-sm text-slate-600 mb-2">The seller has requested a payout of:</p>
              <h3 className="text-3xl font-black text-slate-900 mb-6">${seller.pendingPayout.toLocaleString()}</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => onProcessPayout(seller.id, seller.pendingPayout!)}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Proceed with Payout
                </button>
                <button 
                  onClick={() => setIsRejectModalOpen(true)}
                  className="w-full bg-white text-red-600 border border-red-100 py-3.5 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject Request
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center py-12">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <History size={24} />
              </div>
              <p className="text-slate-400 font-bold text-sm uppercase">No Pending Payouts</p>
              <p className="text-xs text-slate-400 mt-2">Payouts appear here when requested by the seller.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="text-indigo-600" size={20} /> Transaction History
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lifetime History</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Transaction Details</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4 text-right">Balance After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seller.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${tx.type === 'sale' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                            {tx.type === 'sale' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 capitalize">{tx.type}</div>
                            <div className="text-xs text-slate-400">{tx.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          tx.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`px-8 py-5 font-bold ${tx.type === 'sale' ? 'text-green-600' : 'text-slate-900'}`}>
                        {tx.type === 'sale' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right font-semibold text-slate-400">
                        ${tx.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* REJECTION MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsRejectModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-2">Reject Payout?</h3>
            <p className="text-slate-500 text-center text-sm mb-6">
              This will return the <strong>${seller.pendingPayout?.toLocaleString()}</strong> back to the seller's available balance. Please state why you are rejecting this.
            </p>
            
            <textarea 
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none h-32 mb-6 bg-slate-50"
              placeholder="e.g. Bank details incorrect, suspicious activity..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 bg-slate-100 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                Cancel
              </button>
              <button 
                onClick={() => {
                  onRejectPayout(seller.id, seller.pendingPayout!, rejectReason);
                  setIsRejectModalOpen(false);
                }}
                disabled={!rejectReason.trim()}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedSellerDetailView;