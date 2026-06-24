import { useState } from 'react';
import { 
  Users, ShoppingBag, ShieldCheck, Clock, Wallet, 
  CheckCircle2, ExternalLink, Menu, X, LogOut 
} from 'lucide-react';

// 1. MOVE THIS OUTSIDE the AdminDashboard component
interface SidebarItemProps {
  id: string;
  icon: any;
  label: string;
  activeTab: string;
  setActiveTab: (id: string) => void;
  isSidebarOpen: boolean;
}

const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab, isSidebarOpen }: SidebarItemProps) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      activeTab === id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
    }`}
  >
    <Icon size={20} />
    {isSidebarOpen && <span className="font-medium">{label}</span>}
  </button>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending-sellers');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Mock Data
  const pendingSellers = [
    { id: 1, name: "John Doe", email: "john@techcorp.com", businessName: "TechCorp", website: "techcorp.io", phone: "+1 234 567", bank: "Chase - ****4242", idProof: "view_doc.pdf" },
  ];
  const verifiedSellers = [
    { id: 101, name: "Alice Brown", businessName: "Gadget World", wallet: 1250.00, phone: "+1 444 555", bank: "Wells Fargo - ****1122" },
  ];
  const transactions = [
    { id: "TX-9901", product: "iPhone 15 Pro", seller: "Gadget World", buyer: "Kevin Hart", price: 999, shippingStatus: "Shipped", paymentStatus: "Held by Admin" },
  ];
  const buyers = [
    { id: 1, name: "Kevin Hart", email: "kevin@gmail.com", joined: "2024-01-10" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 p-4 flex flex-col`}>
        <div className="flex items-center gap-3 mb-10 px-2 text-white">
          <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
            <ShieldCheck size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">CoreAdmin</span>}
        </div>

        <nav className="space-y-2 flex-1">
          {/* 2. PASS THE PROPS TO THE SIDEBAR ITEM */}
          <SidebarItem 
            id="pending-sellers" 
            icon={Clock} 
            label="Pending Sellers" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
          />
          <SidebarItem 
            id="verified-sellers" 
            icon={ShieldCheck} 
            label="Verified Sellers" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
          />
          <SidebarItem 
            id="transactions" 
            icon={ShoppingBag} 
            label="Transactions" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
          />
          <SidebarItem 
            id="buyers" 
            icon={Users} 
            label="Buyers List" 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
          />
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 mt-auto transition-colors">
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Super Admin</p>
              <p className="text-xs text-slate-500">admin@coreadmin.com</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
              AD
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Dashboard Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Buyers</p>
              <h3 className="text-3xl font-bold">{buyers.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Pending Sellers</p>
              <h3 className="text-3xl font-bold text-orange-500">{pendingSellers.length}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Verified Sellers</p>
              <h3 className="text-3xl font-bold text-green-600">{verifiedSellers.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* CONTENT LOGIC ACCORDING TO ACTIVE TAB */}
            {activeTab === 'pending-sellers' && (
              <section>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold">Pending Seller Approvals</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                        <th className="px-6 py-4">Business Info</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Bank Account</th>
                        <th className="px-6 py-4">Documents</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingSellers.map(seller => (
                        <tr key={seller.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="font-bold">{seller.businessName}</div>
                            <div className="text-sm text-slate-500">{seller.name}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div>{seller.email}</div>
                            <div className="text-indigo-600">{seller.website}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-mono">{seller.bank}</td>
                          <td className="px-6 py-4">
                            <button className="flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:underline">
                              <ExternalLink size={14} /> ID Proof
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold hover:bg-green-200">APPROVE</button>
                              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold hover:bg-red-200">REJECT</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 2. VERIFIED SELLERS */}
            {activeTab === 'verified-sellers' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold">Verified Sellers & Wallets</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Business Name</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Bank Account</th>
                        <th className="px-6 py-4">Wallet Balance</th>
                        <th className="px-6 py-4">Payout</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {verifiedSellers.map(seller => (
                        <tr key={seller.id}>
                          <td className="px-6 py-4 font-semibold">{seller.businessName}</td>
                          <td className="px-6 py-4 text-sm">{seller.phone}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{seller.bank}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-bold text-green-600">
                              <Wallet size={16} /> ${seller.wallet.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-600 transition-colors">
                              Process Payout
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TRANSACTIONS (Escrow Flow) */}
            {activeTab === 'transactions' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold">Recent Product Sales</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Product & ID</th>
                        <th className="px-6 py-4">Parties</th>
                        <th className="px-6 py-4">Shipment Status</th>
                        <th className="px-6 py-4">Payment Status</th>
                        <th className="px-6 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map(tx => (
                        <tr key={tx.id}>
                          <td className="px-6 py-4">
                            <div className="font-semibold">{tx.product}</div>
                            <div className="text-xs text-slate-400">{tx.id}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-col">
                              <span><span className="text-slate-400">Seller:</span> {tx.seller}</span>
                              <span><span className="text-slate-400">Buyer:</span> {tx.buyer}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              tx.shippingStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {tx.shippingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                              {tx.paymentStatus.includes('Released') ? <CheckCircle2 size={14} className="text-green-500"/> : <Clock size={14} className="text-orange-500"/>}
                              {tx.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">${tx.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. BUYERS LIST */}
            {activeTab === 'buyers' && (
              <div>
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold">Registered Buyers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-6 py-4">Full Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {buyers.map(buyer => (
                        <tr key={buyer.id}>
                          <td className="px-6 py-4 font-medium">{buyer.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{buyer.email}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{buyer.joined}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-indigo-600 text-sm hover:underline">View History</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;