import React, { useState } from 'react';
import { 
  DollarSign, 
  Coffee, 
  ShoppingBag, 
  Bell, 
  ArrowRight, 
  UtensilsCrossed, 
  TrendingUp, 
  Clock, 
  Activity, 
  PlusCircle, 
  HelpCircle
} from 'lucide-react';
import type { FBTransaction } from './FoodBeverageManagement';
import type { ServiceRequest, User } from '../../types';

interface CafeDashboardProps {
  transactions: FBTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<FBTransaction[]>>;
  serviceRequests: ServiceRequest[];
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  setActiveTab: (tab: any) => void;
  loggedInUser?: User | null;
}

export default function CafeDashboard({
  transactions,
  serviceRequests,
  setServiceRequests,
  setActiveTab,
  loggedInUser
}: CafeDashboardProps) {
  const [isCsModalOpen, setIsCsModalOpen] = useState(false);
  const [csText, setCsText] = useState('');
  const [csPriority, setCsPriority] = useState<'Critical' | 'Medium' | 'Low'>('Medium');

  // Filter transactions for completed and today
  const completedTx = transactions.filter(t => t.status === 'Completed');
  const totalRevenue = completedTx.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalOrders = completedTx.length;
  const totalItems = completedTx.reduce((sum, t) => sum + t.totalItems, 0);

  // Active Cafe Tickets (roomNum === 0 represents Cafe)
  const cafeTickets = serviceRequests.filter(req => req.roomNum === 0);
  const activeTicketsCount = cafeTickets.filter(req => req.status !== 'Resolved').length;

  // Calculate top items
  const getItemRankings = () => {
    const counts: { [key: string]: { qty: number; revenue: number } } = {};
    completedTx.forEach(t => {
      t.items.forEach(item => {
        if (!counts[item.menuName]) {
          counts[item.menuName] = { qty: 0, revenue: 0 };
        }
        counts[item.menuName].qty += item.quantity;
        counts[item.menuName].revenue += item.quantity * item.unitPrice;
      });
    });

    return Object.entries(counts)
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  };

  const topItems = getItemRankings();
  const maxQty = topItems.length > 0 ? Math.max(...topItems.map(i => i.qty)) : 1;

  const handleSendCSRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csText.trim()) return;

    const newTicketId = serviceRequests.length + 1;
    const ticketCode = `TKT-${String(newTicketId).padStart(3, '0')}`;
    const createdStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newTicket: ServiceRequest = {
      id: newTicketId,
      roomNum: 0, // Standalone Cafe
      item: `[ADUAN CAFE] ${csText}`,
      status: 'Pending',
      code: ticketCode,
      priority: csPriority,
      guestName: `Kasir Cafe (${loggedInUser?.name || 'Rian Hidayat'})`,
      createdTime: createdStr
    };

    setServiceRequests(prev => [newTicket, ...prev]);
    setCsText('');
    setIsCsModalOpen(false);
    alert(`Tiket Bantuan ${ticketCode} Berhasil Dikirim ke Customer Service!\nTim CS akan memproses aduan secara real-time.`);
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      
      {/* WELCOME BANNER CARD */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
              <span>Halo, {loggedInUser?.name || 'Rian Hidayat'}!</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                Cafe Cashier Mode
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">SMA PERHOTELAN • Monitor Kinerja Penjualan & Pengaduan Operasional Cafe</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-gray-50 border rounded-lg flex items-center space-x-2 text-xs font-bold text-gray-650">
            <Clock className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span>Shift Pagi: 08.00 - 16.00 WIB</span>
          </div>

          <button
            onClick={() => setActiveTab('fb')}
            className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white text-xs font-black uppercase tracking-wider rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all active:scale-98"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Buka Kasir POS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Omzet Cafe Hari Ini</p>
            <h3 className="text-2xl font-black text-[#1E3A5F] mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-emerald-600 mt-0.5 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Transaksi Selesai
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Completed Orders */}
        <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Nota Transaksi</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{totalOrders} Pesanan</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Berhasil disajikan</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#1E3A5F] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Items Sold */}
        <div className="bg-white p-4.5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Produk Terjual</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{totalItems} Porsi</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Makanan, minuman, & snack</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Active CS Complaints */}
        <div className={`p-4.5 rounded-xl border shadow-3xs flex items-center justify-between transition-all ${
          activeTicketsCount > 0 
            ? 'bg-rose-50/50 border-rose-250' 
            : 'bg-white border-gray-200'
        }`}>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aduan Cafe Aktif</p>
            <h3 className={`text-2xl font-black mt-1 ${
              activeTicketsCount > 0 ? 'text-rose-600 animate-pulse' : 'text-gray-850'
            }`}>
              {activeTicketsCount} Tiket
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Dipantau CS Hotel</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            activeTicketsCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE WORKSPACE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Orders & Best Sellers */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent Orders Card */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-3xs">
            <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between">
              <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Riwayat Penjualan Terkini</h3>
              <button 
                onClick={() => setActiveTab('fb')}
                className="text-[10px] font-bold text-[#1E3A5F] hover:underline flex items-center cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 uppercase text-[9px] font-black tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">No. Transaksi</th>
                    <th className="px-5 py-3">Pelanggan</th>
                    <th className="px-5 py-3 text-center">Item</th>
                    <th className="px-5 py-3 text-right">Total Bayar</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.txNumber} className="hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-bold text-[#1E3A5F]">#{tx.txNumber}</td>
                      <td className="px-5 py-3 font-semibold text-gray-800">{tx.customerName}</td>
                      <td className="px-5 py-3 text-center font-bold text-gray-600">{tx.totalItems}</td>
                      <td className="px-5 py-3 text-right font-extrabold text-gray-800">
                        Rp {tx.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          tx.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : tx.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 font-medium">{tx.createdAt}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-450 italic">
                        Belum ada transaksi di mesin kasir hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bestseller Menu Performance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
            <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Top Menu Terlaris Hari Ini</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topItems.map((item, idx) => {
                const widthPercent = Math.round((item.qty / maxQty) * 100);
                return (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-150 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-gray-800 truncate block max-w-[150px]">{item.name}</span>
                      <span className="font-black text-[#1E3A5F]">{item.qty} Porsi</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                      <span>Peringkat #{idx + 1}</span>
                      <span>Total: Rp {item.revenue.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                );
              })}

              {topItems.length === 0 && (
                <div className="col-span-2 text-center py-6 text-gray-400 italic">
                  Data menu terlaris belum tersedia.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: CS Helpdesk status tracker & Quick helpdesk button */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick CS request panel */}
          <div className="bg-amber-50/60 border border-amber-250 p-5 rounded-xl shadow-3xs space-y-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-amber-600 text-white rounded-lg">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">Aduan CS Cafe</h3>
            </div>
            
            <p className="text-[11px] text-amber-800 leading-normal font-semibold">
              Mengalami kendala teknis (mati lampu, mesin kopi bermasalah, kehabisan es)? Kirim tiket agar tim Customer Service Hotel segera memprosesnya.
            </p>

            <button
              onClick={() => setIsCsModalOpen(true)}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Buat Aduan / Tiket Baru</span>
            </button>
          </div>

          {/* CS Tickets status timeline */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
            <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Status Penanganan Aduan Cafe</span>
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cafeTickets.map(ticket => (
                <div key={ticket.id} className="p-3 bg-gray-50 border border-gray-150 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[#1E3A5F]">#{ticket.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      ticket.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : ticket.status === 'On Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <p className="font-semibold text-gray-750 line-clamp-2">
                    {ticket.item.replace('[ADUAN CAFE] ', '')}
                  </p>

                  <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold border-t border-gray-200/60 pt-1.5">
                    <span className="flex items-center">
                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                      {ticket.createdTime}
                    </span>
                    <span>
                      {ticket.assigneeName ? `CS: ${ticket.assigneeName}` : 'Menunggu CS'}
                    </span>
                  </div>
                </div>
              ))}

              {cafeTickets.length === 0 && (
                <div className="text-center py-12 text-gray-400 italic">
                  <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
                  <p className="text-[11px] font-semibold">Tidak ada aduan aktif dari cafe.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL: SUBMIT TICKET FORM */}
      {isCsModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="px-5 py-4 bg-amber-600 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Kirim Tiket Aduan Operasional Cafe</h3>
              <button 
                onClick={() => setIsCsModalOpen(false)}
                className="text-white hover:text-gray-200 cursor-pointer font-extrabold text-xs"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSendCSRequest} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Masalah / Deskripsi Bantuan
                </label>
                <textarea
                  required
                  rows={3}
                  value={csText}
                  onChange={(e) => setCsText(e.target.value)}
                  placeholder="Contoh: Blender mati mendadak, air galon untuk espresso habis, AC kasir rusak..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Tingkat Kepentingan (Prioritas)
                </label>
                <select
                  value={csPriority}
                  onChange={(e) => setCsPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-750 cursor-pointer"
                >
                  <option value="Low">Low (Minor / Biasa)</option>
                  <option value="Medium">Medium (Penting / Menghambat Kerja)</option>
                  <option value="Critical">Critical (Urgent / Menghentikan Operasional)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsCsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Kirim Aduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
