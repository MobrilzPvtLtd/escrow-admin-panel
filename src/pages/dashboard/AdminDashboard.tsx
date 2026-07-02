import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import faviconImage from '/favicon.ico';
import { 
  Users, ShoppingBag, ShieldCheck, Clock, 
  Menu, X, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchSellers, mapSellerToPendingSeller, mapSellerToVerifiedSeller } from '../../api/sellers';
import { fetchBuyers, mapBuyerToUiBuyer } from '../../api/buyers';
import { fetchUserDetails, mapUserToBuyer, mapUserToPendingSeller, mapUserToVerifiedSeller } from '../../api/userDetails';
import { fetchTransactions, fetchTransactionDetails, mapTransactionToUiTransaction } from '../../api/transactions';

import type { Seller, VerifiedSeller, Buyer, Transaction2 } from '../../types';

// Import Your Separate Components
import SellerDetailView from '../../components/SellerDetailView';
import VerifiedSellerDetailView from '../../components/VerifiedSellerDetailView';
import TransactionDetailView from '../../components/TransactionDetailView';
import BuyerDetailView from '../../components/BuyerDetailView';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, clearSession } = useAuth();
  const [activeTab, setActiveTab] = useState('pending-sellers');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [verifiedSellers, setVerifiedSellers] = useState<VerifiedSeller[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [transactions, setTransactions] = useState<Transaction2[]>([]);
  const [isSellersLoading, setIsSellersLoading] = useState(false);
  const [sellersError, setSellersError] = useState<string | null>(null);
  const [isBuyersLoading, setIsBuyersLoading] = useState(false);
  const [buyersError, setBuyersError] = useState<string | null>(null);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  // Selection States
  const [selectedPending, setSelectedPending] = useState<Seller | null>(null);
  const [selectedVerified, setSelectedVerified] = useState<VerifiedSeller | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction2 | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    const loadSellers = async () => {
      setIsSellersLoading(true);
      setSellersError(null);

      try {
        const [pendingResponse, verifiedResponse] = await Promise.all([
          fetchSellers(false),
          fetchSellers(true),
        ]);

        setPendingSellers(pendingResponse.map(mapSellerToPendingSeller));
        setVerifiedSellers(verifiedResponse.map(mapSellerToVerifiedSeller));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load seller data.';
        setSellersError(message);
      } finally {
        setIsSellersLoading(false);
      }
    };

    const loadBuyers = async () => {
      setIsBuyersLoading(true);
      setBuyersError(null);

      try {
        const response = await fetchBuyers();
        setBuyers(response.map(mapBuyerToUiBuyer));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load buyer data.';
        setBuyersError(message);
      } finally {
        setIsBuyersLoading(false);
      }
    };

    const loadTransactions = async () => {
      setIsTransactionsLoading(true);
      setTransactionsError(null);

      try {
        const response = await fetchTransactions();
        setTransactions(response.map(mapTransactionToUiTransaction));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load transaction data.';
        setTransactionsError(message);
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    loadSellers();
    loadBuyers();
    loadTransactions();
  }, []);

  // --- HELPER TO RESET VIEWS ON TAB CHANGE ---
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPending(null);
    setSelectedVerified(null);
    setSelectedTx(null);
    setSelectedBuyer(null);
    setDetailError(null);
  };

  const handleSelectPendingSeller = async (seller: Seller) => {
    setDetailError(null);
    setDetailLoading(true);
    setSelectedPending(null);
    setSelectedVerified(null);
    setSelectedBuyer(null);

    try {
      const response = await fetchUserDetails(seller.userId ?? seller.id);
      setSelectedPending(mapUserToPendingSeller(response.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load seller profile.';
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectVerifiedSeller = async (seller: VerifiedSeller) => {
    setDetailError(null);
    setDetailLoading(true);
    setSelectedPending(null);
    setSelectedVerified(null);
    setSelectedBuyer(null);

    try {
      const response = await fetchUserDetails(seller.userId ?? seller.id);
      setSelectedVerified(mapUserToVerifiedSeller(response.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load seller profile.';
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectBuyer = async (buyer: Buyer) => {
    setDetailError(null);
    setDetailLoading(true);
    setSelectedPending(null);
    setSelectedVerified(null);
    setSelectedBuyer(null);

    try {
      const response = await fetchUserDetails(buyer.userId ?? buyer.id);
      setSelectedBuyer(mapUserToBuyer(response.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load buyer profile.';
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSelectTransaction = async (transaction: Transaction2) => {
    setDetailError(null);
    setDetailLoading(true);
    setSelectedPending(null);
    setSelectedVerified(null);
    setSelectedBuyer(null);
    setSelectedTx(null);

    try {
      const transactionId = transaction.backendId ?? (typeof transaction.id === 'string' && /^\d+$/.test(transaction.id) ? Number(transaction.id) : undefined);

      if (typeof transactionId !== 'number' || Number.isNaN(transactionId)) {
        throw new Error('Transaction ID is missing from the list response.');
      }

      const response = await fetchTransactionDetails(transactionId);
      const detailTransaction = response.transaction;
      setSelectedTx({
        ...transaction,
        productName: detailTransaction.title,
        price: detailTransaction.amount,
        date: detailTransaction.purchasedOn,
        shippingStatus: transaction.shippingStatus,
        paymentStatus: transaction.paymentStatus,
        seller: {
          name: detailTransaction.seller.name,
          businessName: detailTransaction.seller.businessName,
          email: detailTransaction.seller.email,
          phone: detailTransaction.seller.phone,
        },
        buyer: {
          name: detailTransaction.buyer.name,
          email: detailTransaction.buyer.email,
          phone: detailTransaction.buyer.phone,
          address: detailTransaction.deliveryAddress,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load transaction details.';
      setDetailError(message);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 p-4 flex flex-col h-screen sticky top-0`}>
        <div className="flex items-center gap-3 mb-10 px-2 text-slate-800">
          {/* LOGO AREA */}
          <div className="bg-white border border-slate-200 p-2 rounded-xl shrink-0 overflow-hidden w-10 h-10 flex items-center justify-center shadow-sm">
            <img src={faviconImage} alt="CoreAdmin logo" className="w-full h-full object-cover" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">CoreAdmin</span>}
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarBtn id="pending-sellers" icon={Clock} label="Pending Sellers" active={activeTab} onClick={handleTabChange} open={isSidebarOpen} />
          <SidebarBtn id="verified-sellers" icon={ShieldCheck} label="Verified Sellers" active={activeTab} onClick={handleTabChange} open={isSidebarOpen} />
          <SidebarBtn id="transactions" icon={ShoppingBag} label="Transactions" active={activeTab} onClick={handleTabChange} open={isSidebarOpen} />
          <SidebarBtn id="buyers" icon={Users} label="Buyers List" active={activeTab} onClick={handleTabChange} open={isSidebarOpen} />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 transition-colors mt-auto border-t border-slate-200 pt-6">
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
        </button>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-3 pr-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/20" title={admin?.name ?? 'Admin'}>
              {admin?.name ? admin.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">
          
          {/* RENDER LOGIC */}
          {activeTab === 'pending-sellers' && (
            selectedPending ? (
              <SellerDetailView 
                seller={selectedPending} 
                onBack={() => setSelectedPending(null)} 
                onApprove={(id) => console.log("Approve", id)} 
                onReject={(id, reason) => console.log("Reject", id, reason)} 
              />
            ) : detailLoading ? (
              <div className="p-8 text-sm text-slate-500">Loading profile…</div>
            ) : detailError ? (
              <div className="p-8 text-sm text-red-600">{detailError}</div>
            ) : (
              <TableWrapper title="Seller Applications" count={pendingSellers.length}>
                {isSellersLoading ? (
                  <div className="p-8 text-sm text-slate-500">Loading seller applications…</div>
                ) : sellersError ? (
                  <div className="p-8 text-sm text-red-600">{sellersError}</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-4">Business Name</th><th className="px-8 py-4">Contact</th><th className="px-8 py-4 text-right">View</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingSellers.map(s => (
                        <tr key={s.id} onClick={() => handleSelectPendingSeller(s)} className="hover:bg-indigo-50/50 cursor-pointer group transition-colors">
                          <td className="px-8 py-5 font-bold group-hover:text-indigo-600">{s.businessName}</td>
                          <td className="px-8 py-5 text-sm text-slate-500">{s.email}</td>
                          <td className="px-8 py-5 text-right"><span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">Details</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TableWrapper>
            )
          )}

          {activeTab === 'verified-sellers' && (
            selectedVerified ? (
              <VerifiedSellerDetailView 
                seller={selectedVerified} 
                onBack={() => setSelectedVerified(null)}
                onProcessPayout={(id, amt) => console.log("Payout", id, amt)}
                onRejectPayout={(reason) => console.log("Rejected Payout", reason)}
              />
            ) : detailLoading ? (
              <div className="p-8 text-sm text-slate-500">Loading profile…</div>
            ) : detailError ? (
              <div className="p-8 text-sm text-red-600">{detailError}</div>
            ) : (
              <TableWrapper title="Verified Sellers" count={verifiedSellers.length}>
                {isSellersLoading ? (
                  <div className="p-8 text-sm text-slate-500">Loading verified sellers…</div>
                ) : sellersError ? (
                  <div className="p-8 text-sm text-red-600">{sellersError}</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-4">Seller</th><th className="px-8 py-4">Wallet</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {verifiedSellers.map(s => (
                        <tr key={s.id} onClick={() => handleSelectVerifiedSeller(s)} className="hover:bg-indigo-50/50 cursor-pointer group">
                          <td className="px-8 py-5 font-bold">{s.businessName}</td>
                          <td className="px-8 py-5 font-black text-slate-900">${s.walletBalance.toLocaleString()}</td>
                          <td className="px-8 py-5">
                            {s.pendingPayout ? <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Payout Pending</span> : <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Active</span>}
                          </td>
                          <td className="px-8 py-5 text-right"><span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">PROFILE</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TableWrapper>
            )
          )}

          {activeTab === 'transactions' && (
            selectedTx ? (
              <TransactionDetailView transaction={selectedTx} onBack={() => setSelectedTx(null)} />
            ) : detailLoading ? (
              <div className="p-8 text-sm text-slate-500">Loading transaction details…</div>
            ) : detailError ? (
              <div className="p-8 text-sm text-red-600">{detailError}</div>
            ) : (
              <TableWrapper title="Recent Product Sales" count={transactions.length}>
                {isTransactionsLoading ? (
                  <div className="p-8 text-sm text-slate-500">Loading transactions…</div>
                ) : transactionsError ? (
                  <div className="p-8 text-sm text-red-600">{transactionsError}</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-4">Product & ID</th><th className="px-8 py-4">Parties</th><th className="px-8 py-4">Escrow Status</th><th className="px-8 py-4 text-right">Amount</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map(t => (
                        <tr key={t.id} onClick={() => handleSelectTransaction(t)} className="hover:bg-indigo-50/50 cursor-pointer group">
                          <td className="px-8 py-5"><div className="font-bold group-hover:text-indigo-600">{t.productName}</div><div className="text-[10px] font-black text-slate-300">{t.id}</div></td>
                          <td className="px-8 py-5 text-sm font-medium text-slate-500">S: {t.seller.businessName}<br/>B: {t.buyer.name}</td>
                          <td className="px-8 py-5"><span className="text-[10px] font-black uppercase bg-amber-100 text-amber-700 px-3 py-1 rounded-full">{t.paymentStatus}</span></td>
                          <td className="px-8 py-5 text-right font-black text-slate-900">${t.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TableWrapper>
            )
          )}

          {activeTab === 'buyers' && (
            selectedBuyer ? (
              <BuyerDetailView buyer={selectedBuyer} onBack={() => setSelectedBuyer(null)} />
            ) : detailLoading ? (
              <div className="p-8 text-sm text-slate-500">Loading profile…</div>
            ) : detailError ? (
              <div className="p-8 text-sm text-red-600">{detailError}</div>
            ) : (
              <TableWrapper title="Registered Buyers" count={buyers.length}>
                {isBuyersLoading ? (
                  <div className="p-8 text-sm text-slate-500">Loading buyers…</div>
                ) : buyersError ? (
                  <div className="p-8 text-sm text-red-600">{buyersError}</div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr><th className="px-8 py-4">Buyer Name</th><th className="px-8 py-4">Email</th><th className="px-8 py-4">Orders</th><th className="px-8 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {buyers.map(b => (
                        <tr key={b.id} onClick={() => handleSelectBuyer(b)} className="hover:bg-indigo-50/50 cursor-pointer group">
                          <td className="px-8 py-5 font-bold">{b.name}</td>
                          <td className="px-8 py-5 text-sm text-slate-500">{b.email}</td>
                          <td className="px-8 py-5 font-bold text-slate-900 text-center">{b.totalOrders}</td>
                          <td className="px-8 py-5 text-right"><span className="text-[10px] font-black bg-slate-100 px-3 py-1.5 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all uppercase">View History</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TableWrapper>
            )
          )}
        </div>
      </main>
    </div>
  );
};

// --- HELPER MINI-COMPONENTS ---
const SidebarBtn = ({ id, icon: Icon, label, active, onClick, open }: any) => (
  <button onClick={() => onClick(id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${active === id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 translate-x-1' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
    <Icon size={20} className="shrink-0" />
    {open && <span className="font-bold text-sm tracking-tight">{label}</span>}
  </button>
);

const TableWrapper = ({ title, count, children }: any) => (
  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
      <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{count} total</span>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export default AdminDashboard;