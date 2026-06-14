import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle, 
  XCircle, 
  Coffee, 
  Users, 
  ShoppingBag, 
  Plus, 
  Minus,
  Trash2,
  Printer,
  Activity,
  Sparkles
} from 'lucide-react';
import type { User, ServiceRequest } from '../../types';

// Define structures matching F&B sales monitoring requirements
export interface OrderItem {
  menuName: string;
  quantity: number;
  unitPrice: number;
}

export interface FBTransaction {
  txNumber: string;
  customerName: string;
  cashierName: string;
  totalItems: number;
  totalAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  completedAt?: string;
  items: OrderItem[];
  notes?: string;
}

export interface CashierPerformance {
  name: string;
  totalTx: number;
  completedTx: number;
  itemsSold: number;
}

// Menu Items for the Cafe Standalone POS (Student-operated)
export interface CafeMenuItem {
  id: number;
  name: string;
  price: number;
  category: 'Food' | 'Beverage' | 'Snack';
  available: boolean;
}

export const CAFE_MENU: CafeMenuItem[] = [
  { id: 1, name: 'Kopi Susu Gula Aren', price: 15000, category: 'Beverage', available: true },
  { id: 2, name: 'Espresso Single', price: 12000, category: 'Beverage', available: true },
  { id: 3, name: 'Matcha Latte Premium', price: 18000, category: 'Beverage', available: true },
  { id: 4, name: 'Roti Bakar Keju Cokelat', price: 12000, category: 'Food', available: true },
  { id: 5, name: 'Nasi Goreng SMK Factory', price: 17000, category: 'Food', available: true },
  { id: 6, name: 'Kentang Goreng Krispi', price: 10000, category: 'Snack', available: true },
  { id: 7, name: 'Cireng Bumbu Rujak', price: 8000, category: 'Snack', available: true },
  { id: 8, name: 'Americano Ice', price: 13000, category: 'Beverage', available: true },
  { id: 9, name: 'Ayam Geprek Sambal Korek', price: 15000, category: 'Food', available: true }
];

export const INITIAL_TRANSACTIONS: FBTransaction[] = [
  {
    txNumber: 'TX-2026-001',
    customerName: 'Alexander Pierce',
    cashierName: 'Nina Sato',
    totalItems: 3,
    totalAmount: 185000,
    status: 'Completed',
    createdAt: '10:15 AM',
    completedAt: '10:18 AM',
    items: [
      { menuName: 'Nasi Goreng Kampung', quantity: 2, unitPrice: 65000 },
      { menuName: 'Ice Lychee Tea', quantity: 1, unitPrice: 55000 }
    ],
    notes: 'Minta sendok tambahan'
  },
  {
    txNumber: 'TX-2026-002',
    customerName: 'Elena Rodriguez',
    cashierName: 'Siti Rahma',
    totalItems: 4,
    totalAmount: 240000,
    status: 'Pending',
    createdAt: '10:42 AM',
    items: [
      { menuName: 'Sirloin Steak', quantity: 1, unitPrice: 165000 },
      { menuName: 'Fresh Orange Juice', quantity: 2, unitPrice: 30000 },
      { menuName: 'Mineral Water', quantity: 1, unitPrice: 15000 }
    ],
    notes: 'Medium rare'
  },
  {
    txNumber: 'TX-2026-003',
    customerName: 'Marcus Chen',
    cashierName: 'Nina Sato',
    totalItems: 2,
    totalAmount: 110000,
    status: 'Completed',
    createdAt: '11:05 AM',
    completedAt: '11:10 AM',
    items: [
      { menuName: 'Club Sandwich', quantity: 1, unitPrice: 75000 },
      { menuName: 'Espresso Double', quantity: 1, unitPrice: 35000 }
    ]
  },
  {
    txNumber: 'TX-2026-004',
    customerName: 'Sophie Laurent',
    cashierName: 'Budi Santoso',
    totalItems: 3,
    totalAmount: 145000,
    status: 'Cancelled',
    createdAt: '11:20 AM',
    items: [
      { menuName: 'Fettuccine Carbonara', quantity: 1, unitPrice: 85000 },
      { menuName: 'Ice Lemon Tea', quantity: 2, unitPrice: 30000 }
    ],
    notes: 'Salah input menu oleh kasir'
  },
  {
    txNumber: 'TX-2026-005',
    customerName: 'David Kim',
    cashierName: 'Nina Sato',
    totalItems: 5,
    totalAmount: 310000,
    status: 'Completed',
    createdAt: '11:45 AM',
    completedAt: '11:50 AM',
    items: [
      { menuName: 'Nasi Goreng Kampung', quantity: 3, unitPrice: 65000 },
      { menuName: 'Fresh Orange Juice', quantity: 2, unitPrice: 30000 },
      { menuName: 'Ice Lychee Tea', quantity: 1, unitPrice: 55000 }
    ]
  },
  {
    txNumber: 'TX-2026-006',
    customerName: 'Aisha Bello',
    cashierName: 'Siti Rahma',
    totalItems: 1,
    totalAmount: 75000,
    status: 'Pending',
    createdAt: '12:02 PM',
    items: [
      { menuName: 'Club Sandwich', quantity: 1, unitPrice: 75000 }
    ]
  }
];

interface FoodBeverageManagementProps {
  transactions: FBTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<FBTransaction[]>>;
  loggedInUser?: User | null;
  serviceRequests: ServiceRequest[];
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
}

export default function FoodBeverageManagement({
  transactions,
  setTransactions,
  loggedInUser,
  serviceRequests,
  setServiceRequests
}: FoodBeverageManagementProps) {
  // Determine if we show cashier POS view or the Admin Monitoring Dashboard
  const [viewMode, setViewMode] = useState<'pos' | 'admin'>(() => {
    return loggedInUser?.role === 'Food & Beverage' ? 'pos' : 'admin';
  });

  const activeViewMode = loggedInUser?.role === 'Food & Beverage' ? 'pos' : viewMode;

  const [selectedTxNumber, setSelectedTxNumber] = useState<string>(() => {
    return transactions.length > 0 ? transactions[0].txNumber : 'TX-2026-001';
  });
  
  // Search & Filters state (Admin Dashboard)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashier, setSelectedCashier] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Interactive note input
  const [noteInput, setNoteInput] = useState('');

  // Modals state for creating a mock transaction to simulate cashier activity
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCashier, setNewCashier] = useState('Rian Hidayat (Student)');
  const [newMenu, setNewMenu] = useState('Kopi Susu Gula Aren');
  const [newQty, setNewQty] = useState('1');
  const [newPrice, setNewPrice] = useState('15000');

  // Cafe POS Cashier States
  const [cart, setCart] = useState<{ menuItem: CafeMenuItem; quantity: number }[]>([]);
  const [custNameInput, setCustNameInput] = useState('');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [posNotesInput, setPosNotesInput] = useState('');
  const [posMenuCategory, setPosMenuCategory] = useState<'All' | 'Food' | 'Beverage' | 'Snack'>('All');
  const [posSearchQuery, setPosSearchQuery] = useState('');

  // Last completed transaction print/receipt modal
  const [completedReceipt, setCompletedReceipt] = useState<FBTransaction | null>(null);

  // CS Helpdesk Integration States & Handler
  const [csRequestText, setCsRequestText] = useState('');
  const [csRequestPriority, setCsRequestPriority] = useState<'Critical' | 'Medium' | 'Low'>('Medium');
  const [isCsHelpdeskOpen, setIsCsHelpdeskOpen] = useState(false);

  const handleSubmitCSRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csRequestText.trim()) {
      alert('Mohon isi deskripsi keluhan/bantuan!');
      return;
    }

    const newTicketId = serviceRequests.length + 1;
    const ticketCode = `TKT-${String(newTicketId).padStart(3, '0')}`;
    const createdStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newTicket: ServiceRequest = {
      id: newTicketId,
      roomNum: 0, // 0 signifies Cafe Standalone
      item: `[ADUAN CAFE] ${csRequestText}`,
      status: 'Pending',
      code: ticketCode,
      priority: csRequestPriority,
      guestName: `Kasir Cafe (${loggedInUser?.name || 'Rian Hidayat'})`,
      createdTime: createdStr
    };

    setServiceRequests(prev => [newTicket, ...prev]);
    setCsRequestText('');
    setIsCsHelpdeskOpen(false);
    alert(`Tiket Bantuan ${ticketCode} Berhasil Dikirim ke Customer Service!\nTim CS hotel akan memantau aduan ini secara real-time.`);
  };

  // ----------------------------------------------------
  // ADMIN MONITORING ENGINE
  // ----------------------------------------------------
  const activeTx = transactions.find(t => t.txNumber === selectedTxNumber) || transactions[0] || null;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.txNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCashier = selectedCashier === 'All' ? true : t.cashierName === selectedCashier;
    const matchesStatus = selectedStatus === 'All' ? true : t.status === selectedStatus;
    
    return matchesSearch && matchesCashier && matchesStatus;
  });

  const totalTxCount = filteredTransactions.length;
  const completedTxCount = filteredTransactions.filter(t => t.status === 'Completed').length;
  const cancelledTxCount = filteredTransactions.filter(t => t.status === 'Cancelled').length;
  
  const activeCashiersCount = Array.from(new Set(transactions.map(t => t.cashierName))).length;
  
  const totalItemsSold = filteredTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalItems, 0);

  const getMostSoldMenu = () => {
    const menuCounts: { [key: string]: number } = {};
    transactions
      .filter(t => t.status === 'Completed')
      .forEach(t => {
        t.items.forEach(item => {
          menuCounts[item.menuName] = (menuCounts[item.menuName] || 0) + item.quantity;
        });
      });
    
    let maxMenu = 'None';
    let maxCount = 0;
    Object.entries(menuCounts).forEach(([menu, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMenu = menu;
      }
    });
    return maxMenu;
  };

  const mostSoldMenuName = getMostSoldMenu();

  const getCashierPerformance = (): CashierPerformance[] => {
    const performances: { [name: string]: CashierPerformance } = {};
    
    transactions.forEach(t => {
      if (!performances[t.cashierName]) {
        performances[t.cashierName] = {
          name: t.cashierName,
          totalTx: 0,
          completedTx: 0,
          itemsSold: 0
        };
      }
      
      performances[t.cashierName].totalTx += 1;
      if (t.status === 'Completed') {
        performances[t.cashierName].completedTx += 1;
        performances[t.cashierName].itemsSold += t.totalItems;
      }
    });
    
    return Object.values(performances);
  };

  const cashierStatsList = getCashierPerformance();

  const handleUpdateStatus = (txNum: string, nextStatus: 'Completed' | 'Cancelled') => {
    setTransactions(prev => prev.map(t => {
      if (t.txNumber === txNum) {
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'Completed' ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : undefined
        };
      }
      return t;
    }));
  };

  const handleSaveNote = () => {
    if (!activeTx) return;
    setTransactions(prev => prev.map(t => {
      if (t.txNumber === activeTx.txNumber) {
        return { ...t, notes: noteInput };
      }
      return t;
    }));
    setNoteInput('');
  };

  const handleCreateMockTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;

    const newTxNum = `TX-2026-${String(transactions.length + 1).padStart(3, '0')}`;
    const qtyNum = parseInt(newQty) || 1;
    const priceNum = parseInt(newPrice) || 0;
    
    const newTx: FBTransaction = {
      txNumber: newTxNum,
      customerName: newCustName,
      cashierName: newCashier,
      totalItems: qtyNum,
      totalAmount: qtyNum * priceNum,
      status: 'Pending',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      items: [
        { menuName: newMenu, quantity: qtyNum, unitPrice: priceNum }
      ]
    };

    setTransactions(prev => [newTx, ...prev]);
    setSelectedTxNumber(newTxNum);
    setIsNewTxModalOpen(false);
    setNewCustName('');
  };

  const handleExportCSV = () => {
    const headers = ['No. Transaksi', 'Pelanggan', 'Kasir', 'Total Item', 'Total Bayar', 'Status', 'Waktu'];
    const rows = filteredTransactions.map(t => [
      t.txNumber,
      t.customerName,
      t.cashierName,
      t.totalItems,
      t.totalAmount,
      t.status,
      t.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `F&B_Transactions_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // CASHIER POS ENGINE
  // ----------------------------------------------------
  const filteredPOSMenu = CAFE_MENU.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(posSearchQuery.toLowerCase());
    const matchesCategory = posMenuCategory === 'All' ? true : m.category === posMenuCategory;
    return matchesSearch && matchesCategory && m.available;
  });

  const handleAddToCart = (menuItem: CafeMenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (menuId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.menuItem.id === menuId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (menuId: number) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== menuId));
  };

  const posSubtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const posGrandTotal = posSubtotal; // Cafe stands alone, no service charge/tax for simplicity
  const cashNum = parseFloat(cashGiven) || 0;
  const posChange = cashNum - posGrandTotal;

  const handleCheckoutPOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (cashNum < posGrandTotal) {
      alert('Pembayaran tunai kurang dari total belanja!');
      return;
    }

    const txId = transactions.length + 1;
    const newTxNum = `TX-2026-${String(txId).padStart(3, '0')}`;
    const timestampStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newTx: FBTransaction = {
      txNumber: newTxNum,
      customerName: custNameInput || 'Pelanggan Cafe',
      cashierName: loggedInUser?.name || 'Kasir Cafe',
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
      totalAmount: posGrandTotal,
      status: 'Completed', // Student cashiers complete transactions directly
      createdAt: timestampStr,
      completedAt: timestampStr,
      items: cart.map(item => ({
        menuName: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.menuItem.price
      })),
      notes: posNotesInput
    };

    setTransactions(prev => [newTx, ...prev]);
    setCompletedReceipt(newTx);
    
    // Clear cart & POS inputs
    setCart([]);
    setCustNameInput('');
    setCashGiven('');
    setPosNotesInput('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-[#1E3A5F] text-white rounded-lg">
              <Coffee className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-[#1E3A5F] tracking-tight uppercase flex items-center gap-1.5">
                <span>Edutech Cafe Standalone POS</span>
                <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-extrabold rounded-full tracking-wider animate-pulse">
                  STUDENT RUN
                </span>
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Sistem Kasir Cafe Mandiri & Monitoring Transaksi Siswa (Shared VPS Server)
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle switcher */}
        {loggedInUser?.role !== 'Food & Beverage' && (
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 self-start md:self-auto shadow-3xs">
            <button
              onClick={() => setViewMode('pos')}
              className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeViewMode === 'pos'
                  ? 'bg-[#1E3A5F] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Kasir POS
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeViewMode === 'admin'
                  ? 'bg-[#1E3A5F] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Dashboard Admin
            </button>
          </div>
        )}
      </div>

      {/* VIEW: ADMIN MONITORING DASHBOARD */}
      {activeViewMode === 'admin' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* FILTER CONTROLS */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari transaksi / nama tamu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                />
              </div>

              {/* Cashier Filter */}
              <div>
                <select
                  value={selectedCashier}
                  onChange={(e) => setSelectedCashier(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 cursor-pointer"
                >
                  <option value="All">Semua Kasir</option>
                  <option value="Nina Sato">Nina Sato</option>
                  <option value="Siti Rahma">Siti Rahma</option>
                  <option value="Budi Santoso">Budi Santoso</option>
                  <option value="Rian Hidayat (Siswa)">Rian Hidayat (Siswa)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 cursor-pointer"
                >
                  <option value="All">Semua Status</option>
                  <option value="Pending">Menunggu (Pending)</option>
                  <option value="Completed">Selesai (Completed)</option>
                  <option value="Cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsNewTxModalOpen(true)}
                className="px-3.5 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-all active:scale-98 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Simulasi Order</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-all active:scale-98 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* MAIN DASHBOARD CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</span>
              <p className="text-xl font-black text-gray-800 mt-1">{totalTxCount}</p>
              <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">Hari ini</span>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-emerald-600">Selesai (Completed)</span>
              <p className="text-xl font-black text-emerald-600 mt-1">{completedTxCount}</p>
              <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">Siap saji</span>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-red-500">Dibatalkan</span>
              <p className="text-xl font-black text-red-600 mt-1">{cancelledTxCount}</p>
              <span className="text-[9px] text-red-400 font-semibold block mt-0.5">Void / Gagal</span>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kasir Aktif</span>
              <p className="text-xl font-black text-blue-600 mt-1">{activeCashiersCount}</p>
              <span className="text-[9px] text-blue-500 font-semibold block mt-0.5">Praktik siswa</span>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-[#1E3A5F]">Porsi Terjual</span>
              <p className="text-xl font-black text-[#1E3A5F] mt-1">{totalItemsSold}</p>
              <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">Makanan & Minuman</span>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-amber-600">Menu Terlaris</span>
              <p className="text-[11px] font-black text-gray-800 mt-1 truncate" title={mostSoldMenuName}>
                {mostSoldMenuName}
              </p>
              <span className="text-[9px] text-amber-600 font-bold block mt-1 flex items-center">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Best Seller
              </span>
            </div>
          </div>

          {/* MAIN MONITORING WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Table Area */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-3xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1E3A5F]/5 text-[#1E3A5F] uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                      <th className="px-5 py-3.5">No. Transaksi</th>
                      <th className="px-5 py-3.5">Pelanggan</th>
                      <th className="px-5 py-3.5">Kasir (Siswa)</th>
                      <th className="px-5 py-3.5 text-center">Item</th>
                      <th className="px-5 py-3.5 text-right">Total</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {filteredTransactions.map((tx) => {
                      const isActive = tx.txNumber === selectedTxNumber;
                      return (
                        <tr
                          key={tx.txNumber}
                          onClick={() => setSelectedTxNumber(tx.txNumber)}
                          className={`hover:bg-blue-50/40 transition-all cursor-pointer ${
                            isActive ? 'bg-blue-50/80 font-semibold' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5 font-bold text-[#1E3A5F]">#{tx.txNumber}</td>
                          <td className="px-5 py-3.5 text-gray-800 font-bold">{tx.customerName}</td>
                          <td className="px-5 py-3.5 text-gray-500 font-semibold">{tx.cashierName}</td>
                          <td className="px-5 py-3.5 text-center font-bold text-gray-700">{tx.totalItems}</td>
                          <td className="px-5 py-3.5 text-right font-extrabold text-gray-900">
                            Rp {tx.totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              tx.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : tx.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 font-medium">{tx.createdAt}</td>
                        </tr>
                      );
                    })}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-gray-400 italic">
                          Tidak ada data transaksi yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sidebar Details Area */}
            <div className="lg:col-span-4 space-y-4">
              {activeTx ? (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4 text-left">
                  <div className="pb-3 border-b border-gray-150 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Detail Transaksi</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">#{activeTx.txNumber}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      activeTx.status === 'Completed'
                        ? 'bg-green-150 text-green-800'
                        : activeTx.status === 'Cancelled'
                        ? 'bg-red-150 text-red-800'
                        : 'bg-amber-150 text-amber-800'
                    }`}>
                      {activeTx.status}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Nama Pelanggan:</span>
                      <span className="font-extrabold text-gray-800">{activeTx.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Petugas Kasir:</span>
                      <span className="font-extrabold text-gray-800">{activeTx.cashierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Waktu Pesan:</span>
                      <span className="font-medium text-gray-500">{activeTx.createdAt}</span>
                    </div>
                    {activeTx.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">Waktu Saji:</span>
                        <span className="font-medium text-emerald-600">{activeTx.completedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items Breakdown */}
                  <div className="pt-3 border-t border-gray-150 space-y-2">
                    <h5 className="text-[10px] font-black text-[#1E3A5F] uppercase tracking-wider">Rincian Menu</h5>
                    {activeTx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-gray-50 border border-gray-150 rounded-lg">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-800 block">{item.menuName}</span>
                          <span className="text-[10px] text-gray-400 font-bold">
                            Rp {item.unitPrice.toLocaleString('id-ID')} x{item.quantity}
                          </span>
                        </div>
                        <span className="font-extrabold text-gray-900">
                          Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-black text-gray-900">
                      <span>Total Bayar:</span>
                      <span className="text-sm text-[#1E3A5F]">
                        Rp {activeTx.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Note */}
                  <div className="pt-3 border-t border-gray-150 space-y-2">
                    <h5 className="text-[10px] font-black text-[#1E3A5F] uppercase tracking-wider">Catatan Kasir</h5>
                    {activeTx.notes ? (
                      <div className="p-2.5 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-xs font-semibold italic leading-relaxed">
                        "{activeTx.notes}"
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 italic">Tidak ada catatan.</p>
                    )}

                    <div className="flex space-x-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Ubah/tambah catatan..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="flex-1 p-1.5 bg-white border border-gray-300 rounded text-xs placeholder-gray-400 text-gray-800 focus:outline-none"
                      />
                      <button
                        onClick={handleSaveNote}
                        className="px-2.5 py-1.5 bg-[#1E3A5F] text-white text-[10px] font-black rounded-lg cursor-pointer hover:bg-[#1E3A5F]/95"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>

                  {/* Actions for Pending order */}
                  {activeTx.status === 'Pending' && (
                    <div className="pt-4 border-t border-gray-150 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(activeTx.txNumber, 'Cancelled')}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-98"
                      >
                        Batalkan Order
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(activeTx.txNumber, 'Completed')}
                        className="w-full py-2 bg-green-650 hover:bg-green-700 text-white border border-green-650 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Selesaikan</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center text-gray-450 italic text-xs">
                  Pilih transaksi untuk melihat detail lengkap.
                </div>
              )}

              {/* CASHIER PERFORMANCE MONITOR */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-3.5 text-left">
                <div className="pb-2.5 border-b border-gray-150 flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Kinerja Kasir (Siswa)</h4>
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {cashierStatsList.map((stat, idx) => {
                    const successRate = stat.totalTx > 0 ? Math.round((stat.completedTx / stat.totalTx) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-800">{stat.name}</span>
                          <span className="font-black text-gray-500">{successRate}% Selesai</span>
                        </div>
                        <div className="w-full bg-gray-150 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                          <span>{stat.totalTx} Order dibuat</span>
                          <span>{stat.itemsSold} Porsi saji</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: STANDALONE CAFE POS CASHIER */}
      {activeViewMode === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
          {/* LEFT COLUMN: MENU CATALOG */}
          <div className="lg:col-span-7 space-y-4">
            {/* Catalog search and category tabs */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-3xs space-y-3 text-left">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari makanan, kopi, cemilan..."
                  value={posSearchQuery}
                  onChange={(e) => setPosSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                />
              </div>

              {/* Category selector tabs */}
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'Food', 'Beverage', 'Snack'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPosMenuCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border transition-all cursor-pointer ${
                      posMenuCategory === cat
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat === 'All' ? 'Semua Menu' : cat === 'Food' ? 'Makanan' : cat === 'Beverage' ? 'Minuman' : 'Cemilan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredPOSMenu.map(menu => (
                <button
                  key={menu.id}
                  onClick={() => handleAddToCart(menu)}
                  className="bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 text-left shadow-3xs hover:shadow-xs transition-all active:scale-98 cursor-pointer flex flex-col justify-between h-32"
                >
                  <div className="space-y-1">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      menu.category === 'Food'
                        ? 'bg-orange-100 text-orange-700'
                        : menu.category === 'Beverage'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {menu.category}
                    </span>
                    <h4 className="text-xs font-black text-gray-850 leading-tight block truncate mt-1.5" title={menu.name}>
                      {menu.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 w-full">
                    <span className="text-xs font-black text-[#1E3A5F]">
                      Rp {menu.price.toLocaleString('id-ID')}
                    </span>
                    <span className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Empty menu warning */}
            {filteredPOSMenu.length === 0 && (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-400 italic text-xs font-semibold">
                Tidak ada menu cafe yang sesuai dengan pencarian Anda.
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: POS CHECKOUT CART */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Keranjang Belanja POS</span>
                </h3>
                <button
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                  className="text-[10px] font-bold text-red-500 hover:text-red-750 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center space-x-0.5 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Bersihkan</span>
                </button>
              </div>

              {/* Cart list */}
              {cart.length > 0 ? (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-150 rounded-lg text-xs animate-in slide-in-from-right-1 duration-100">
                      <div className="space-y-0.5 max-w-[150px]">
                        <span className="font-bold text-gray-800 block truncate" title={item.menuItem.name}>
                          {item.menuItem.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Rp {item.menuItem.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <div className="flex items-center border border-gray-350 rounded bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.menuItem.id, -1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-500 font-black cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-2 text-xs font-black text-gray-800 min-w-[15px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCartQty(item.menuItem.id, 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-gray-500 font-black cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(item.menuItem.id)}
                          className="p-1 text-red-500 hover:text-red-750 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-250 rounded-xl text-gray-450 italic text-xs font-semibold flex flex-col items-center justify-center space-y-1">
                  <ShoppingBag className="w-6 h-6 text-gray-300" />
                  <span>Belum ada pesanan terpilih.</span>
                  <span className="text-[9px] text-gray-450 not-italic font-normal">Klik item menu di sebelah kiri</span>
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutPOS} className="pt-3 border-t border-gray-200 space-y-3.5">
                {/* Customer Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Pembeli / Tamu</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pak Budi (Guru) / Guest Alexander"
                    value={custNameInput}
                    onChange={(e) => setCustNameInput(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* POS Notes */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Catatan Tambahan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Kopi kurangi manis, bungkus terpisah..."
                    value={posNotesInput}
                    onChange={(e) => setPosNotesInput(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Subtotal Display */}
                <div className="pt-2 border-t border-dashed border-gray-200 space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-gray-500">
                    <span>Subtotal:</span>
                    <span>Rp {posSubtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-black text-gray-900 text-sm">
                    <span>Total Bayar (Grand Total):</span>
                    <span className="text-[#1E3A5F]">Rp {posGrandTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Payment Input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Uang Tunai Diterima (Cash Given)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs font-bold text-gray-400">Rp</span>
                    <input
                      type="number"
                      required
                      placeholder="Masukkan jumlah uang..."
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                {/* Cash Change calculator display */}
                {cashNum >= posGrandTotal && posGrandTotal > 0 && (
                  <div className="p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-bold flex justify-between items-center animate-in fade-in duration-100">
                    <span>Uang Kembali (Change):</span>
                    <span className="font-black">Rp {posChange.toLocaleString('id-ID')}</span>
                  </div>
                )}

                {/* Checkout processing button */}
                <button
                  type="submit"
                  disabled={cart.length === 0 || cashNum < posGrandTotal}
                  className={`w-full py-2.5 rounded-lg text-xs font-black uppercase flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                    cart.length === 0 || cashNum < posGrandTotal
                      ? 'bg-gray-200 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white border border-green-600 active:scale-98 cursor-pointer'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simpan Transaksi & Cetak</span>
                </button>
              </form>
            </div>

            {/* Helpdesk CS Integration Card */}
            <div className="bg-amber-50/75 border border-amber-200 rounded-xl p-5 shadow-3xs space-y-3 text-left animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-850 uppercase tracking-wider flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>CS Helpdesk Cafe (Shared VPS Integration)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCsHelpdeskOpen(!isCsHelpdeskOpen)}
                  className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black rounded cursor-pointer transition-colors"
                >
                  {isCsHelpdeskOpen ? 'Tutup Form' : 'Kirim Tiket / Aduan'}
                </button>
              </div>
              <p className="text-[10px] text-amber-700 leading-normal font-semibold">
                Gunakan panel ini untuk mengirim aduan operasional Cafe (AC mati, kompor bermasalah, komplain rasa, kehabisan bahan) langsung ke tim Customer Service secara real-time.
              </p>

              {isCsHelpdeskOpen && (
                <form onSubmit={handleSubmitCSRequest} className="pt-3 border-t border-amber-250 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div>
                    <label className="block text-[9px] font-bold text-amber-850 uppercase mb-1">Masalah / Deskripsi Bantuan</label>
                    <textarea
                      required
                      rows={3}
                      value={csRequestText}
                      onChange={(e) => setCsRequestText(e.target.value)}
                      placeholder="Contoh: Blender mati mendadak, komplain pelanggan meja 3 rasa kopi terlalu manis..."
                      className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs font-semibold placeholder-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-gray-805"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-[9px] font-black text-amber-850 uppercase">Prioritas:</span>
                      <select
                        value={csRequestPriority}
                        onChange={(e) => setCsRequestPriority(e.target.value as any)}
                        className="p-1 bg-white border border-amber-300 rounded text-[9px] font-bold text-amber-800 cursor-pointer"
                      >
                        <option value="Low">Low (Minor)</option>
                        <option value="Medium">Medium (Standar)</option>
                        <option value="Critical">Critical (Penting/Urgent)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold rounded-md shadow-3xs cursor-pointer transition-colors"
                    >
                      Kirim Tiket
                  </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: MOCK CASHIER SIMULATOR (FOR ADMIN CONSOLE) */}
      {/* ---------------------------------------------------- */}
      {isNewTxModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="px-5 py-4 bg-[#1E3A5F] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Simulasi Transaksi Baru (Kasir)</h3>
              <button 
                onClick={() => setIsNewTxModalOpen(false)}
                className="text-white hover:text-gray-250 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateMockTransaction} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Tamu / Pelanggan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Alexander Pierce"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Petugas Kasir</label>
                  <select
                    value={newCashier}
                    onChange={(e) => setNewCashier(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                  >
                    <option value="Rian Hidayat (Siswa)">Rian Hidayat (Siswa)</option>
                    <option value="Nina Sato">Nina Sato</option>
                    <option value="Siti Rahma">Siti Rahma</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pilih Menu Cafe</label>
                  <select
                    value={newMenu}
                    onChange={(e) => {
                      setNewMenu(e.target.value);
                      const selectedItem = CAFE_MENU.find(m => m.name === e.target.value);
                      if (selectedItem) {
                        setNewPrice(String(selectedItem.price));
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                  >
                    {CAFE_MENU.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jumlah Porsi (Qty)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-805 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Harga Unit (IDR)</label>
                  <input
                    type="number"
                    required
                    readOnly
                    value={newPrice}
                    className="w-full p-2.5 bg-gray-50 border border-gray-250 rounded-lg text-xs font-semibold text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsNewTxModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Buat Order Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: MOCK PRINT RECEIPT (UPON SUCCESSFUL CHECKOUT) */}
      {/* ---------------------------------------------------- */}
      {completedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-5 py-3.5 bg-green-600 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1">
                <Printer className="w-3.5 h-3.5" />
                <span>Transaksi Sukses!</span>
              </h3>
              <button 
                onClick={() => setCompletedReceipt(null)}
                className="text-white hover:text-gray-150 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs text-gray-800">
              <div className="text-center space-y-1">
                <h4 className="font-black text-sm uppercase text-[#1E3A5F]">EDUTECH CAFE</h4>
                <p className="text-[10px] text-gray-500">SMK Vocational Teaching Factory</p>
                <p className="text-[9px] text-gray-450">Jl. Pendidikan No. 45 Bandung</p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>No. Resi:</span>
                  <span className="font-bold">#{completedReceipt.txNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir (Siswa):</span>
                  <span>{completedReceipt.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{completedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{completedReceipt.createdAt}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 space-y-2">
                <span className="font-bold text-[10px] text-gray-450 uppercase block">Rincian Item:</span>
                {completedReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span>{item.menuName} (x{item.quantity})</span>
                    <span>Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 space-y-1 text-[11px]">
                <div className="flex justify-between font-black">
                  <span>Total Bayar:</span>
                  <span>Rp {completedReceipt.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Metode:</span>
                  <span>Tunai (Cash)</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Catatan:</span>
                  <span className="truncate max-w-[200px]">{completedReceipt.notes || '-'}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 text-center text-[10px] text-gray-400 space-y-1 italic">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Pembelian Anda mendukung program praktik siswa.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-150 flex justify-end gap-2">
              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Nota</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
