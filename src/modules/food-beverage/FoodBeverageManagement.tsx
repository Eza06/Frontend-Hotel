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
  FileText 
} from 'lucide-react';

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

const INITIAL_TRANSACTIONS: FBTransaction[] = [
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

export default function FoodBeverageManagement() {
  const [transactions, setTransactions] = useState<FBTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTxNumber, setSelectedTxNumber] = useState<string>('TX-2026-001');
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashier, setSelectedCashier] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('Today');
  
  // Interactive note input
  const [noteInput, setNoteInput] = useState('');

  // Modals state for creating a mock transaction to simulate cashier activity
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCashier, setNewCashier] = useState('Nina Sato');
  const [newMenu, setNewMenu] = useState('Nasi Goreng Kampung');
  const [newQty, setNewQty] = useState('1');
  const [newPrice, setNewPrice] = useState('65000');

  // Handle selected transaction
  const activeTx = transactions.find(t => t.txNumber === selectedTxNumber) || transactions[0] || null;

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.txNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCashier = selectedCashier === 'All' ? true : t.cashierName === selectedCashier;
    const matchesStatus = selectedStatus === 'All' ? true : t.status === selectedStatus;
    
    return matchesSearch && matchesCashier && matchesStatus;
  });

  // Calculate dynamic dashboard cards
  const totalTxCount = filteredTransactions.length;
  const completedTxCount = filteredTransactions.filter(t => t.status === 'Completed').length;
  const cancelledTxCount = filteredTransactions.filter(t => t.status === 'Cancelled').length;
  
  // Active cashiers list from filtered
  const activeCashiersCount = Array.from(new Set(transactions.map(t => t.cashierName))).length;
  
  // Total items sold calculations
  const totalItemsSold = filteredTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.totalItems, 0);

  // Calculate most sold menu from completed transactions
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

  // Calculate Cashier Performance metrics dynamically
  const getCashierPerformance = (): CashierPerformance[] => {
    const cashiers = ['Nina Sato', 'Siti Rahma', 'Budi Santoso'];
    return cashiers.map(name => {
      const cashierTxList = transactions.filter(t => t.cashierName === name);
      const completed = cashierTxList.filter(t => t.status === 'Completed');
      const itemsSold = completed.reduce((sum, t) => sum + t.totalItems, 0);

      return {
        name,
        totalTx: cashierTxList.length,
        completedTx: completed.length,
        itemsSold
      };
    });
  };

  const cashierPerformanceData = getCashierPerformance();

  // Quick Actions Handlers
  const handleCancelTransaction = () => {
    if (activeTx) {
      if (activeTx.status === 'Cancelled') {
        alert('Transaksi ini sudah dibatalkan.');
        return;
      }
      if (confirm(`Apakah Anda yakin ingin membatalkan Transaksi ${activeTx.txNumber}?`)) {
        setTransactions(prev => prev.map(t => {
          if (t.txNumber === activeTx.txNumber) {
            return { ...t, status: 'Cancelled', notes: t.notes ? `${t.notes} | Dibatalkan oleh Admin` : 'Dibatalkan oleh Admin' };
          }
          return t;
        }));
        alert(`Transaksi ${activeTx.txNumber} berhasil dibatalkan.`);
      }
    }
  };

  const handleAddNote = () => {
    if (activeTx && noteInput.trim()) {
      setTransactions(prev => prev.map(t => {
        if (t.txNumber === activeTx.txNumber) {
          return { ...t, notes: noteInput };
        }
        return t;
      }));
      setNoteInput('');
      alert('Catatan berhasil ditambahkan ke transaksi.');
    }
  };

  const handleCreateMockTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustName && newMenu && newQty && newPrice) {
      const nextTxId = `TX-2026-00${transactions.length + 1}`;
      const qtyNum = parseInt(newQty);
      const priceNum = parseInt(newPrice);
      const amount = qtyNum * priceNum;

      const newTx: FBTransaction = {
        txNumber: nextTxId,
        customerName: newCustName,
        cashierName: newCashier,
        totalItems: qtyNum,
        totalAmount: amount,
        status: 'Pending',
        createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        items: [
          { menuName: newMenu, quantity: qtyNum, unitPrice: priceNum }
        ]
      };

      setTransactions(prev => [newTx, ...prev]);
      setSelectedTxNumber(nextTxId);
      setIsNewTxModalOpen(false);
      setNewCustName('');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Transaction Number,Customer,Cashier,Total Items,Total Amount,Status,Created At\n';
    const rows = filteredTransactions.map(t => {
      return `${t.txNumber},"${t.customerName}",${t.cashierName},${t.totalItems},${t.totalAmount},${t.status},${t.createdAt}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fb_sales_monitoring_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-3xs">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Transaction Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi # atau nama pelanggan..."
              className="pl-8 pr-2.5 py-1.5 w-full bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Cashier Filter */}
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-400 uppercase">
            <span className="text-[10px]">Cashier:</span>
            <select
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
              className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
            >
              <option value="All">All Cashiers</option>
              <option value="Nina Sato">Nina Sato</option>
              <option value="Siti Rahma">Siti Rahma</option>
              <option value="Budi Santoso">Budi Santoso</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-400 uppercase">
            <span className="text-[10px]">Date:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
            >
              <option value="Today">Hari Ini (Today)</option>
              <option value="Yesterday">Kemarin</option>
              <option value="Week">Minggu Ini</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-400 uppercase">
            <span className="text-[10px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 lg:flex-none px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-650 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-3xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={() => setIsNewTxModalOpen(true)}
            className="flex-1 lg:flex-none px-4 py-1.5 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Mock Cashier TX</span>
          </button>
        </div>
      </div>

      {/* MONITORING WORKSPACE DASHBOARD CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5">
        {/* Total Transactions */}
        <div className="bg-white p-4 rounded-xl border border-gray-250 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">TOTAL TX TODAY</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-2xl font-black text-gray-800">{totalTxCount}</h4>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="bg-white p-4 rounded-xl border border-green-200 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-green-655 uppercase tracking-wider">COMPLETED</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-2xl font-black text-green-655">{completedTxCount}</h4>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Cancelled Transactions */}
        <div className="bg-white p-4 rounded-xl border border-red-200 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider">CANCELLED</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-2xl font-black text-red-600">{cancelledTxCount}</h4>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Active Cashiers */}
        <div className="bg-white p-4 rounded-xl border border-gray-250 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">ACTIVE CASHIERS</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-2xl font-black text-gray-800">{activeCashiersCount}</h4>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Total Items Sold */}
        <div className="bg-white p-4 rounded-xl border border-gray-255 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">ITEMS SOLD</p>
          <div className="flex items-center justify-between mt-2">
            <h4 className="text-2xl font-black text-gray-800">{totalItemsSold}</h4>
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Most Sold Menu */}
        <div className="bg-white p-4 rounded-xl border border-gray-250 flex flex-col justify-between shadow-3xs">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">BEST SELLER</p>
          <div className="flex flex-col mt-1">
            <span className="text-[10px] font-extrabold text-[#1E3A5F] truncate max-w-full" title={mostSoldMenuName}>
              {mostSoldMenuName}
            </span>
            <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Menu Terlaris</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: TRANSACTION MONITORING & PERFORMANCE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* F&B Transaction Monitoring Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-3xs">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Transaction Monitoring Ledger</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Daftar Penjualan Layanan Kasir F&B Aktif</p>
              </div>
              <span className="px-2.5 py-1 bg-green-50 border border-green-100 text-green-600 text-[10px] font-bold rounded-lg flex items-center space-x-1 shadow-3xs animate-pulse">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Live Feed</span>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3 text-[10px]">TX NUMBER</th>
                    <th className="px-5 py-3 text-[10px]">CUSTOMER</th>
                    <th className="px-5 py-3 text-[10px]">CASHIER</th>
                    <th className="px-5 py-3 text-[10px] text-center">ITEMS</th>
                    <th className="px-5 py-3 text-[10px]">AMOUNT</th>
                    <th className="px-5 py-3 text-[10px]">STATUS</th>
                    <th className="px-5 py-3 text-[10px]">CREATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredTransactions.map(t => {
                    const isSelected = activeTx && t.txNumber === activeTx.txNumber;
                    return (
                      <tr
                        key={t.txNumber}
                        onClick={() => setSelectedTxNumber(t.txNumber)}
                        className={`cursor-pointer transition-all hover:bg-gray-50/75 ${
                          isSelected ? 'bg-blue-50/45 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <td className="px-5 py-3.5 font-mono font-bold text-[#1E3A5F]">
                          #{t.txNumber}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-800">
                          {t.customerName}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-full flex items-center justify-center text-[9px] font-black uppercase">
                              {t.cashierName.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-700">{t.cashierName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-gray-600">
                          {t.totalItems}
                        </td>
                        <td className="px-5 py-3.5 font-mono font-bold text-gray-800">
                          Rp {t.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black border ${
                            t.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                            t.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-gray-400">
                          {t.createdAt}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-bold">
                        Tidak ada transaksi F&B yang cocok dengan filter monitoring.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cashier Performance Panel */}
          <div className="bg-white border border-gray-250 rounded-xl p-5 space-y-4 shadow-3xs">
            <div>
              <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Cashier Performance Panel</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Overview aktivitas & penyelesaian transaksi per siswa kasir</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cashierPerformanceData.map((cashier, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-250 bg-gray-50/20 space-y-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 bg-[#1E3A5F] text-white rounded-full flex items-center justify-center font-black text-xs uppercase">
                      {cashier.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">{cashier.name}</h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">F&B Cashier Staff</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-150">
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold">TOTAL TX</p>
                      <p className="text-sm font-black text-gray-800 mt-0.5">{cashier.totalTx}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-green-505 font-bold">COMPLETED</p>
                      <p className="text-sm font-black text-green-655 mt-0.5">{cashier.completedTx}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-blue-505 font-bold">ITEMS SOLD</p>
                      <p className="text-sm font-black text-blue-600 mt-0.5">{cashier.itemsSold}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RIGHT TRANSACTION DETAIL SIDEBAR */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-3xs text-left">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-450 uppercase tracking-wider">TRANSACTION INFORMATION</h3>
            {activeTx && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                activeTx.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                activeTx.status === 'Pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                {activeTx.status}
              </span>
            )}
          </div>

          {activeTx ? (
            <div className="space-y-5">
              
              {/* Transaction Metadata Card */}
              <div className="p-4 bg-[#1E3A5F] text-white rounded-xl space-y-2.5">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-[8px] text-blue-250 uppercase font-extrabold tracking-wider">MONITORING CONTEXT</p>
                    <h4 className="text-xs font-black">Transaction #{activeTx.txNumber}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-blue-900/60 text-xs">
                  <div>
                    <span className="text-[8px] text-blue-200 uppercase font-semibold">Customer Name</span>
                    <p className="font-extrabold mt-0.5 truncate">{activeTx.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-blue-200 uppercase font-semibold">Cashier Name</span>
                    <p className="font-extrabold mt-0.5 truncate">{activeTx.cashierName}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-blue-200 uppercase font-semibold">Created Time</span>
                    <p className="font-mono font-bold mt-0.5">{activeTx.createdAt}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-blue-200 uppercase font-semibold">Total Amount</span>
                    <p className="font-mono font-extrabold mt-0.5 text-yellow-300">
                      Rp {activeTx.totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details List */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-1.5">ORDER DETAILS</h4>
                <div className="space-y-2">
                  {activeTx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-gray-50 border border-gray-150 rounded-lg">
                      <div>
                        <p className="font-extrabold text-gray-800">{item.menuName}</p>
                        <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                          {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[#1E3A5F]">
                        Rp {(item.quantity * item.unitPrice).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Timeline */}
              <div className="space-y-3 pt-1">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TRANSACTION TIMELINE</h5>
                <div className="relative border-l border-gray-200 pl-4 space-y-4 ml-1.5 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-blue-500 border border-white rounded-full" />
                    <p className="font-bold text-gray-800">Transaction Created</p>
                    <p className="text-[9px] text-gray-450 font-semibold mt-0.5">
                      {activeTx.createdAt} - Dibuat oleh kasir {activeTx.cashierName}
                    </p>
                  </div>

                  {activeTx.status === 'Completed' && (
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                      <p className="font-bold text-gray-850">Transaction Completed</p>
                      <p className="text-[9px] text-gray-455 font-semibold mt-0.5">
                        {activeTx.completedAt || '10:18 AM'} - Selesai & Lunas
                      </p>
                    </div>
                  )}

                  {activeTx.status === 'Cancelled' && (
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-red-500 border border-white rounded-full" />
                      <p className="font-bold text-red-700">Transaction Cancelled</p>
                      <p className="text-[9px] text-red-500 font-semibold mt-0.5">
                        Dibatalkan oleh Admin
                      </p>
                    </div>
                  )}

                  {activeTx.status === 'Pending' && (
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-orange-400 border border-white rounded-full" />
                      <p className="font-bold text-orange-600">Waiting for Completion</p>
                      <p className="text-[9px] text-orange-400 italic mt-0.5">
                        Kasir sedang memproses pembayaran...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction Notes */}
              <div className="pt-2 border-t border-gray-150 text-left">
                <label className="block text-[9px] font-bold text-gray-455 uppercase mb-1">Catatan Transaksi</label>
                {activeTx.notes ? (
                  <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-md text-[10px] text-yellow-800 font-bold mb-2">
                    {activeTx.notes}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 italic mb-2">Tidak ada catatan.</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tambah catatan admin..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md cursor-pointer transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="pt-2 border-t border-gray-155 flex flex-col gap-2">
                <button
                  onClick={() => alert(`Detail invoice lengkap untuk ${activeTx.txNumber} dikirim ke printer kasir!`)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors text-center shadow-3xs"
                >
                  View Details (Print Folio)
                </button>
                
                {activeTx.status !== 'Cancelled' ? (
                  <button
                    onClick={handleCancelTransaction}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-lg cursor-pointer transition-colors text-center"
                  >
                    Cancel Transaction
                  </button>
                ) : (
                  <div className="w-full py-2 bg-red-50/50 border border-red-150 text-red-400 rounded-lg text-center text-xs font-bold">
                    Transaksi Dibatalkan
                  </div>
                )}
              </div>

            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-6">Pilih salah satu transaksi untuk memantau detail penjualan.</p>
          )}
        </div>
      </div>

      {/* MOCK TRANSACTION MODAL */}
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
                  placeholder="Contoh: Marcus Chen"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Siswa Kasir</label>
                  <select
                    value={newCashier}
                    onChange={(e) => setNewCashier(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                  >
                    <option value="Nina Sato">Nina Sato</option>
                    <option value="Siti Rahma">Siti Rahma</option>
                    <option value="Budi Santoso">Budi Santoso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pilih Menu</label>
                  <select
                    value={newMenu}
                    onChange={(e) => {
                      setNewMenu(e.target.value);
                      if (e.target.value === 'Nasi Goreng Kampung') {
                        setNewPrice('65000');
                      } else if (e.target.value === 'Sirloin Steak') {
                        setNewPrice('165000');
                      } else if (e.target.value === 'Club Sandwich') {
                        setNewPrice('75000');
                      } else if (e.target.value === 'Ice Lychee Tea') {
                        setNewPrice('55000');
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                  >
                    <option value="Nasi Goreng Kampung">Nasi Goreng Kampung</option>
                    <option value="Sirloin Steak">Sirloin Steak</option>
                    <option value="Club Sandwich">Club Sandwich</option>
                    <option value="Ice Lychee Tea">Ice Lychee Tea</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jumlah (Qty)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
    </div>
  );
}
