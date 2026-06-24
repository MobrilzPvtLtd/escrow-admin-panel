import React, { useState } from 'react';
import { 
  ArrowLeft, Building2, Phone, Mail, Globe, 
  Landmark, FileText, CheckCircle2, XCircle, 
  ExternalLink, AlertCircle 
} from 'lucide-react';
import type { Seller } from '../types'; 

interface SellerDetailViewProps {
  seller: Seller;
  onBack: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
}

const SellerDetailView: React.FC<SellerDetailViewProps> = ({ seller, onBack, onApprove, onReject }) => {
  const [modalType, setModalType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (modalType === 'approve') {
      onApprove(seller.id);
    } else if (modalType === 'reject') {
      onReject(seller.id, rejectionReason);
    }
    setModalType(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Navigation Header */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Pending List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{seller.businessName}</h1>
                <p className="text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                  <Building2 size={16} /> Registered by {seller.name}
                </p>
              </div>
              <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Pending Approval
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <InfoBlock icon={Mail} label="Contact Email" value={seller.email} />
              <InfoBlock icon={Phone} label="Phone Number" value={seller.phone} />
              <InfoBlock 
                icon={Globe} 
                label="Business Website" 
                value={seller.website} 
                isLink 
              />
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Landmark className="text-indigo-600" size={20} /> Bank Account Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InfoBlock label="Bank Name" value={seller.bankName} />
              <InfoBlock label="Account Number" value={seller.accountNumber} />
              <InfoBlock label="Routing Number" value={seller.routingNumber} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Docs & Actions */}
        <div className="space-y-6">
          {/* Verification Docs */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="text-indigo-600" size={20} /> Identity Proof
            </h3>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer group">
               <FileText size={40} className="mx-auto text-slate-300 group-hover:text-indigo-400 mb-2" />
               <p className="text-sm font-semibold text-slate-600">Business_ID_Doc.pdf</p>
               <p className="text-xs text-slate-400 mt-1">Click to view full document</p>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-2">Admin Review</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Verify all details above. Once approved, the seller can list products immediately.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setModalType('approve')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <CheckCircle2 size={18} /> Approve Seller
              </button>
              <button 
                onClick={() => setModalType('reject')}
                className="w-full bg-white/5 hover:bg-red-600/20 text-white hover:text-red-400 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <XCircle size={18} /> Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setModalType(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-6 flex flex-col items-center text-center ${modalType === 'approve' ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${modalType === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {modalType === 'approve' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
              </div>
              <h3 className="text-xl font-bold">
                {modalType === 'approve' ? 'Approve Seller?' : 'Reject Application?'}
              </h3>
              <p className="text-sm text-slate-500 mt-2 px-4">
                {modalType === 'approve' 
                  ? `Are you sure you want to approve ${seller.businessName}?`
                  : `Please provide a reason for rejecting ${seller.businessName}.`}
              </p>
            </div>
            
            <div className="p-6">
              {modalType === 'reject' && (
                <textarea 
                  className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all h-28 mb-4 bg-slate-50"
                  placeholder="Reason for rejection (e.g., Document invalid...)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              )}
              <div className="flex gap-3">
                <button onClick={() => setModalType(null)} className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all">
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={modalType === 'reject' && !rejectionReason.trim()}
                  className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50 ${modalType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Helper for Layout
const InfoBlock = ({ icon: Icon, label, value, isLink }: any) => (
  <div className="flex flex-col">
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5">{label}</span>
    <div className="flex items-center gap-2 font-bold text-slate-800">
      {Icon && <Icon size={16} className="text-indigo-500 shrink-0" />}
      {isLink ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1.5 overflow-hidden text-ellipsis">
          {value} <ExternalLink size={12} />
        </a>
      ) : (
        <span className="truncate">{value || 'N/A'}</span>
      )}
    </div>
  </div>
);

export default SellerDetailView;