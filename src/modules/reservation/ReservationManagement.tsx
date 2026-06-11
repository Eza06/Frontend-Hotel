import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  ChevronDown, 
  Edit2 
} from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

interface ReservationManagementProps {
  setActiveTab: (tab: any) => void;
}

export interface ReservationItem {
  code: string;
  guestName: string;
  guestId: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  status: 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Issues';
  ratePerNight: number;
  totalCharge: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
  balanceStatus: 'Settled' | 'Due';
  createdDate: string;
  createdTime: string;
}

export const INITIAL_RESERVATIONS: ReservationItem[] = [
  {
    code: 'RES-10421',
    guestName: 'James Whitmore',
    guestId: 'GST-00142',
    roomNumber: '101',
    roomType: 'Standard Room',
    checkInDate: '2024-06-08',
    checkOutDate: '2024-06-12',
    nights: 4,
    status: 'Confirmed',
    ratePerNight: 150000,
    totalCharge: 600000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-06-01',
    createdTime: '10:15:30'
  },
  {
    code: 'RES-10389',
    guestName: 'Amara Osei',
    guestId: 'GST-00216',
    roomNumber: '601',
    roomType: 'Suite Room',
    checkInDate: '2024-06-18',
    checkOutDate: '2024-06-25',
    nights: 7,
    status: 'Checked In',
    ratePerNight: 500000,
    totalCharge: 3500000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-06-10',
    createdTime: '14:22:15'
  },
  {
    code: 'RES-10312',
    guestName: 'Michael Chen',
    guestId: 'GST-00223',
    roomNumber: '408',
    roomType: 'Suite Room',
    checkInDate: '2024-06-08',
    checkOutDate: '2024-06-16',
    nights: 8,
    status: 'Checked In',
    ratePerNight: 450000,
    totalCharge: 3600000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-06-02',
    createdTime: '09:05:12'
  },
  {
    code: 'RES-10445',
    guestName: 'Priya Sharma',
    guestId: 'GST-00084',
    roomNumber: '206',
    roomType: 'Deluxe Room',
    checkInDate: '2024-06-12',
    checkOutDate: '2024-06-15',
    nights: 3,
    status: 'Confirmed',
    ratePerNight: 250000,
    totalCharge: 750000,
    paymentStatus: 'Pending',
    balanceStatus: 'Due',
    createdDate: '2024-06-05',
    createdTime: '11:45:00'
  },
  {
    code: 'RES-10278',
    guestName: 'Robert Bell',
    guestId: 'GST-00119',
    roomNumber: '301',
    roomType: 'Suite Room',
    checkInDate: '2024-06-07',
    checkOutDate: '2024-06-15',
    nights: 8,
    status: 'Checked Out',
    ratePerNight: 400000,
    totalCharge: 3200000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-05-28',
    createdTime: '16:30:22'
  },
  {
    code: 'RES-10467',
    guestName: 'Yuki Tanaka',
    guestId: 'GST-00052',
    roomNumber: '208',
    roomType: 'Deluxe Room',
    checkInDate: '2024-06-20',
    checkOutDate: '2024-06-26',
    nights: 6,
    status: 'Pending',
    ratePerNight: 250000,
    totalCharge: 1500000,
    paymentStatus: 'Unpaid',
    balanceStatus: 'Due',
    createdDate: '2024-06-12',
    createdTime: '08:14:05'
  },
  {
    code: 'RES-10501',
    guestName: 'Lena Fischer',
    guestId: 'GST-00150',
    roomNumber: '103',
    roomType: 'Standard Room',
    checkInDate: '2024-06-15',
    checkOutDate: '2024-06-21',
    nights: 6,
    status: 'Pending',
    ratePerNight: 150000,
    totalCharge: 900000,
    paymentStatus: 'Unpaid',
    balanceStatus: 'Due',
    createdDate: '2024-06-14',
    createdTime: '13:00:00'
  },
  {
    code: 'RES-10332',
    guestName: 'Carlos Mendez',
    guestId: 'GST-00301',
    roomNumber: '205',
    roomType: 'Deluxe Room',
    checkInDate: '2024-06-15',
    checkOutDate: '2024-06-20',
    nights: 5,
    status: 'Confirmed',
    ratePerNight: 250000,
    totalCharge: 1250000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-06-06',
    createdTime: '17:10:45'
  },
  {
    code: 'RES-10254',
    guestName: 'Victor Petrov',
    guestId: 'GST-00401',
    roomNumber: '801',
    roomType: 'Suite Room',
    checkInDate: '2024-06-04',
    checkOutDate: '2024-06-18',
    nights: 14,
    status: 'Checked In',
    ratePerNight: 600000,
    totalCharge: 8400000,
    paymentStatus: 'Paid',
    balanceStatus: 'Settled',
    createdDate: '2024-05-25',
    createdTime: '10:00:00'
  },
  {
    code: 'RES-10510',
    guestName: 'Sophie Laurent',
    guestId: 'GST-00445',
    roomNumber: '407',
    roomType: 'Standard Room',
    checkInDate: '2024-06-18',
    checkOutDate: '2024-06-21',
    nights: 3,
    status: 'Pending',
    ratePerNight: 150000,
    totalCharge: 450000,
    paymentStatus: 'Unpaid',
    balanceStatus: 'Due',
    createdDate: '2024-06-15',
    createdTime: '15:20:00'
  },
  {
    code: 'RES-10533',
    guestName: 'Greg Wallace',
    guestId: 'GST-00480',
    roomNumber: '704',
    roomType: 'Suite Room',
    checkInDate: '2024-06-25',
    checkOutDate: '2024-06-30',
    nights: 5,
    status: 'Issues',
    ratePerNight: 400000,
    totalCharge: 2000000,
    paymentStatus: 'Unpaid',
    balanceStatus: 'Due',
    createdDate: '2024-06-15',
    createdTime: '09:00:00'
  }
];

export function ReservationManagement({ setActiveTab: _setActiveTab }: ReservationManagementProps) {
  const [reservations, setReservations] = useState<ReservationItem[]>(INITIAL_RESERVATIONS);
  const [selectedResCode, setSelectedResCode] = useState<string>('RES-10389');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Multi-select status filter
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Issues', 'Cancelled']);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(prev => prev.filter(s => s !== status));
    } else {
      setSelectedStatuses(prev => [...prev, status]);
    }
  };
  
  // Date Filters
  const [checkInFilter, setCheckInFilter] = useState<string>('');
  const [checkOutFilter, setCheckOutFilter] = useState<string>('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRoom, setFormRoom] = useState('101');
  const [formRoomType, setFormRoomType] = useState('Standard Room');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [formRate, setFormRate] = useState(150000);
  const [formPaymentStatus, setFormPaymentStatus] = useState<'Paid' | 'Unpaid' | 'Pending'>('Unpaid');
  const [formStatus, setFormStatus] = useState<'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Issues'>('Pending');

  const selectedRes = reservations.find(r => r.code === selectedResCode) || reservations[0];

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const date1 = new Date(formCheckIn);
    const date2 = new Date(formCheckOut);
    const nights = Math.max(1, Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))) || 1;
    const totalCharge = nights * formRate;
    const newCode = `RES-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRes: ReservationItem = {
      code: newCode,
      guestName: formName || 'Tamu Baru',
      guestId: `GST-00${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: formRoom,
      roomType: formRoomType,
      checkInDate: formCheckIn || '2024-06-20',
      checkOutDate: formCheckOut || '2024-06-22',
      nights: nights,
      status: 'Confirmed',
      ratePerNight: formRate,
      totalCharge: totalCharge,
      paymentStatus: formPaymentStatus,
      balanceStatus: formPaymentStatus === 'Paid' ? 'Settled' : 'Due',
      createdDate: new Date().toISOString().split('T')[0],
      createdTime: new Date().toTimeString().split(' ')[0]
    };

    setReservations(prev => [newRes, ...prev]);
    setSelectedResCode(newCode);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleModifyReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes) return;
    const date1 = new Date(formCheckIn);
    const date2 = new Date(formCheckOut);
    const nights = Math.max(1, Math.round((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))) || 1;
    const totalCharge = nights * formRate;

    setReservations(prev => prev.map(r => {
      if (r.code === selectedResCode) {
        return {
          ...r,
          guestName: formName || r.guestName,
          roomNumber: formRoom || r.roomNumber,
          roomType: formRoomType || r.roomType,
          checkInDate: formCheckIn || r.checkInDate,
          checkOutDate: formCheckOut || r.checkOutDate,
          nights: nights,
          ratePerNight: formRate,
          totalCharge: totalCharge,
          status: formStatus,
          paymentStatus: formPaymentStatus,
          balanceStatus: formPaymentStatus === 'Paid' ? 'Settled' : 'Due'
        };
      }
      return r;
    }));
    setIsModifyModalOpen(false);
  };

  const openModifyModal = () => {
    if (!selectedRes) return;
    setFormName(selectedRes.guestName);
    setFormRoom(selectedRes.roomNumber);
    setFormRoomType(selectedRes.roomType);
    setFormCheckIn(selectedRes.checkInDate);
    setFormCheckOut(selectedRes.checkOutDate);
    setFormRate(selectedRes.ratePerNight);
    setFormPaymentStatus(selectedRes.paymentStatus);
    setFormStatus(selectedRes.status);
    setIsModifyModalOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormRoom('101');
    setFormRoomType('Standard Room');
    setFormCheckIn('');
    setFormCheckOut('');
    setFormRate(150000);
    setFormPaymentStatus('Unpaid');
    setFormStatus('Pending');
  };

  const checkAvailability = () => {
    if (!checkInFilter || !checkOutFilter) {
      alert('Silakan pilih Tanggal Check-in dan Check-out terlebih dahulu.');
      return;
    }
    alert(`Hasil Pencarian Ketersediaan untuk ${checkInFilter} s.d ${checkOutFilter}:\nSemua tipe kamar TERSEDIA (Kecuali Kamar Suite lantai 6 penuh).`);
  };

  const handleExport = () => {
    alert('Daftar reservasi berhasil diekspor ke format Excel/CSV!');
  };

  const executeStatusChange = (code: string, newStatus: 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled') => {
    setReservations(prev => prev.map(r => {
      if (r.code === code) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const printFolio = (code: string) => {
    alert(`Mencetak Guest Folio Rekening untuk Kode Reservasi: ${code}\nStatus Tagihan: LUNAS\nSilakan periksa printer front desk.`);
  };

  // Filter Logic
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomNumber.includes(searchQuery);

    const matchesStatus = selectedStatuses.includes(r.status);

    let matchesDates = true;
    if (checkInFilter) {
      matchesDates = matchesDates && r.checkInDate >= checkInFilter;
    }
    if (checkOutFilter) {
      matchesDates = matchesDates && r.checkOutDate <= checkOutFilter;
    }

    return matchesSearch && matchesStatus && matchesDates;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-850 border-yellow-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Checked In':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Checked Out':
        return 'bg-gray-100 text-gray-750 border-gray-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Issues':
        return 'bg-orange-50 text-orange-750 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Confirmed': return 'bg-blue-500';
      case 'Checked In': return 'bg-green-500';
      case 'Checked Out': return 'bg-gray-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Issues': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  const columns = [
    {
      header: 'Res Code',
      accessor: (res: ReservationItem) => <span className="font-mono text-gray-550 text-[11px] font-bold">{res.code}</span>,
      sortKey: 'code'
    },
    {
      header: 'Guest Name',
      accessor: (res: ReservationItem) => <span className="text-[#1E3A5F] font-bold">{res.guestName}</span>,
      sortKey: 'guestName'
    },
    {
      header: 'Room',
      accessor: (res: ReservationItem) => <span className="font-mono font-bold text-gray-700">{res.roomNumber}</span>,
      sortKey: 'roomNumber'
    },
    {
      header: 'Room Type',
      accessor: (res: ReservationItem) => <span className="text-gray-650">{res.roomType}</span>,
      sortKey: 'roomType'
    },
    {
      header: 'Check In',
      accessor: (res: ReservationItem) => <span className="font-mono text-gray-650">{res.checkInDate}</span>,
      sortKey: 'checkInDate'
    },
    {
      header: 'Check Out',
      accessor: (res: ReservationItem) => <span className="font-mono text-gray-650">{res.checkOutDate}</span>,
      sortKey: 'checkOutDate'
    },
    {
      header: 'Nights',
      accessor: (res: ReservationItem) => <span className="text-gray-650 font-bold">{res.nights}N</span>,
      sortKey: 'nights'
    },
    {
      header: 'Status',
      accessor: (res: ReservationItem) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeStyle(res.status)}`}>
          <span className={`w-1 h-1 rounded-full mr-1 ${getStatusDotColor(res.status)}`} />
          {res.status}
        </span>
      ),
      sortKey: 'status'
    }
  ];

  return (
    <div className="res-mgmt-wrapper bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Booking & Reservation</h2>
          <p className="text-xs text-gray-500 mt-1">SMA PERHOTELAN • Front Desk & Workspace • {reservations.length} Bookings</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Reservation Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Res code, guest, room..."
              className="pl-9 pr-3 py-1.5 w-64 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Create Reservation Button */}
          <button
            onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
            className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Reservation</span>
          </button>
        </div>
      </div>

      {/* QUICK DATE FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 py-3.5 border-b border-gray-200 text-xs font-bold text-gray-700 bg-gray-50/50 px-4 rounded-lg mt-3">
        <div className="flex items-center space-x-2">
          <span>Check In:</span>
          <input
            type="date"
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
            className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span>Check Out:</span>
          <input
            type="date"
            value={checkOutFilter}
            onChange={(e) => setCheckOutFilter(e.target.value)}
            className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={checkAvailability}
          className="px-4 py-1.5 bg-blue-50 border border-blue-200 text-[#1E3A5F] hover:bg-blue-100 rounded-lg font-bold transition-all cursor-pointer shadow-3xs"
        >
          Check Availability
        </button>

        {(checkInFilter || checkOutFilter) && (
          <button
            onClick={() => { setCheckInFilter(''); setCheckOutFilter(''); }}
            className="text-red-500 hover:text-red-700 text-xs font-extrabold cursor-pointer"
          >
            Clear Date Filters
          </button>
        )}
      </div>

      {/* STATUS FILTERS ROW */}
      <div className="flex flex-wrap items-center justify-between py-3 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-3xs transition-all"
          >
            <span>Filter Status</span>
            <span className="bg-blue-50 text-[#1E3A5F] px-1.5 py-0.5 rounded text-[10px] font-black">
              {selectedStatuses.length} Selected
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {isFilterDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-250 rounded-xl shadow-xl z-40 p-3 space-y-2 text-xs font-bold text-gray-700">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Select Statuses</span>
                  <button 
                    onClick={() => setSelectedStatuses(['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Issues', 'Cancelled'])}
                    className="text-[10px] text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                </div>
                
                {[
                  { id: 'Pending', label: 'Pending', color: 'bg-yellow-500' },
                  { id: 'Confirmed', label: 'Confirmed', color: 'bg-blue-500' },
                  { id: 'Issues', label: 'Issues', color: 'bg-orange-500' },
                  { id: 'Checked In', label: 'Checked In', color: 'bg-green-500' },
                  { id: 'Checked Out', label: 'Checked Out', color: 'bg-gray-500' },
                  { id: 'Cancelled', label: 'Cancelled', color: 'bg-red-500' }
                ].map(item => {
                  const isChecked = selectedStatuses.includes(item.id);
                  return (
                    <label 
                      key={item.id}
                      className="flex items-center justify-between p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleStatus(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span>{item.label}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ({reservations.filter(r => r.status === item.id).length})
                      </span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        {selectedStatuses.length < 6 && (
          <button
            onClick={() => setSelectedStatuses(['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Issues', 'Cancelled'])}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* SPLIT PANE MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        
        {/* LEFT COLUMN: RESERVATION DATA TABLE */}
        <div className="lg:col-span-8">
          <DataTable
            data={filteredReservations}
            columns={columns}
            rowIdKey="code"
            selectedRowId={selectedResCode}
            onRowClick={(row) => setSelectedResCode(row.code)}
            pageSize={10}
          />
        </div>

        {/* RIGHT COLUMN: RESERVATION DETAIL SIDEBAR */}
        {selectedRes && (
          <div className="lg:col-span-4 bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-mono tracking-wider block font-bold">RESERVATION DETAILS</span>
                <h3 className="text-sm font-black text-[#1E3A5F] font-mono mt-0.5">{selectedRes.code}</h3>
                <p className="text-xs text-gray-600 font-bold mt-1">{selectedRes.guestName}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusBadgeStyle(selectedRes.status)}`}>
                {selectedRes.status}
              </span>
            </div>

            {/* STAY DETAILS (Grid Cards) */}
            <div className="space-y-2.5">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">STAY DETAILS</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">→ Check In</span>
                  <span className="font-extrabold text-[#1E3A5F] text-[10px] font-mono">{selectedRes.checkInDate}</span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">← Check Out</span>
                  <span className="font-extrabold text-[#1E3A5F] text-[10px] font-mono">{selectedRes.checkOutDate}</span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Room Number</span>
                  <span className="font-extrabold text-[#1E3A5F] text-[10px] font-mono">Room {selectedRes.roomNumber} ({selectedRes.roomType})</span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Total Nights</span>
                  <span className="font-extrabold text-[#1E3A5F] text-[10px]">{selectedRes.nights} nights</span>
                </div>

              </div>
            </div>

            {/* GUEST INFORMATION */}
            <div className="space-y-3 bg-white border border-gray-200 rounded-xl p-3">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-1.5">GUEST INFORMATION</h4>
              <div className="space-y-2 text-xs font-semibold text-gray-650">
                <div className="flex justify-between">
                  <span>Guest Name:</span>
                  <span className="text-[#1E3A5F] font-bold">{selectedRes.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone Number:</span>
                  <span className="text-gray-800 font-mono">+62 812-7788-9900</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Address:</span>
                  <span className="text-gray-800 truncate font-mono max-w-[170px]" title="tamu@email.com">
                    {selectedRes.guestName.toLowerCase().replace(' ', '')}@email.com
                  </span>
                </div>
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="space-y-3 bg-white border border-gray-200 rounded-xl p-3">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b pb-1.5">FINANCIAL SUMMARY</h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between font-semibold text-gray-650">
                  <span>Rate Per Night:</span>
                  <span className="text-gray-800 font-mono">Rp {selectedRes.ratePerNight.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1E3A5F]">
                  <span>Total Charge:</span>
                  <span className="font-mono">Rp {selectedRes.totalCharge.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-gray-100">
                  <span className="font-bold text-gray-400 uppercase">Payment Status:</span>
                  <div className="flex space-x-1.5">
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] border ${
                      selectedRes.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                      selectedRes.paymentStatus === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {selectedRes.paymentStatus.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[9px] border ${
                      selectedRes.balanceStatus === 'Settled' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      'bg-orange-50 text-orange-850 border-orange-200'
                    }`}>
                      {selectedRes.balanceStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOOKING TIMELINE */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">BOOKING TIMELINE</h4>
              <div className="relative pl-4 space-y-4 border-l border-dashed border-gray-300 ml-2 text-xs">
                
                {/* 1. Reservation Created */}
                <div className="relative">
                  <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[20px] border-2 border-white top-1"></div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800">Reservation Created</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Waktu Pendaftaran oleh Front Desk</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-bold text-right">
                      {selectedRes.createdDate}<br/>{selectedRes.createdTime}
                    </span>
                  </div>
                </div>

                {/* 2. Check In */}
                <div className="relative">
                  <div className="absolute w-2 h-2 bg-green-500 rounded-full -left-[20px] border-2 border-white top-1"></div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800">Check In Schedule</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Rencana waktu kedatangan tamu</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-bold text-right">
                      {selectedRes.checkInDate}<br/>13:00:00
                    </span>
                  </div>
                </div>

                {/* 3. Check Out */}
                <div className="relative">
                  <div className="absolute w-2 h-2 bg-gray-500 rounded-full -left-[20px] border-2 border-white top-1"></div>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-extrabold text-gray-800">Check Out Schedule</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">Batas akhir pemakaian kamar</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 font-bold text-right">
                      {selectedRes.checkOutDate}<br/>11:00:00
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">QUICK ACTIONS</h4>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedRes.status === 'Confirmed' || selectedRes.status === 'Pending' ? (
                  <button
                    onClick={() => executeStatusChange(selectedRes.code, 'Checked In')}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>Check In Guest</span>
                  </button>
                ) : (
                  <button
                    onClick={() => executeStatusChange(selectedRes.code, 'Checked Out')}
                    disabled={selectedRes.status === 'Checked Out' || selectedRes.status === 'Cancelled'}
                    className="w-full py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Check Out</span>
                  </button>
                )}

                <button
                  onClick={openModifyModal}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-750 border border-blue-200 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Modify</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => printFolio(selectedRes.code)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>Print Folio</span>
                </button>

                <button
                  onClick={() => executeStatusChange(selectedRes.code, 'Cancelled')}
                  disabled={selectedRes.status === 'Cancelled' || selectedRes.status === 'Checked Out'}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-750 border border-red-200 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Cancel Res.</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* CREATE RESERVATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 text-left relative">
            <h3 className="text-base font-black text-[#1E3A5F] mb-4 flex items-center space-x-1.5">
              <Plus className="w-5 h-5" />
              <span>Buat Reservasi Baru</span>
            </h3>
            
            <form onSubmit={handleCreateReservation} className="space-y-3.5 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1 font-bold">NAMA TAMU</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Masukkan nama lengkap tamu"
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TANGGAL CHECK-IN</label>
                  <input
                    type="date"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">TANGGAL CHECK-OUT</label>
                  <input
                    type="date"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TIPE KAMAR</label>
                  <select
                    value={formRoomType}
                    onChange={(e) => setFormRoomType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Standard Room">Standard Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Suite Room">Suite Room</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">NOMOR KAMAR</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="101 / 204..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TARIF PER MALAM (RP)</label>
                  <input
                    type="number"
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">STATUS PEMBAYARAN</label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Unpaid">Belum Bayar (Unpaid)</option>
                    <option value="Paid">Lunas (Paid)</option>
                    <option value="Pending">Menunggu Jaminan (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer transition-colors text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg cursor-pointer transition-colors text-center shadow-xs"
                >
                  Simpan Reservasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODIFY RESERVATION MODAL */}
      {isModifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 text-left relative">
            <h3 className="text-base font-black text-[#1E3A5F] mb-4 flex items-center space-x-1.5">
              <Edit2 className="w-4 h-4" />
              <span>Modify Reservasi {selectedRes?.code}</span>
            </h3>
            
            <form onSubmit={handleModifyReservation} className="space-y-3.5 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1 font-bold">NAMA TAMU</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TANGGAL CHECK-IN</label>
                  <input
                    type="date"
                    value={formCheckIn}
                    onChange={(e) => setFormCheckIn(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">TANGGAL CHECK-OUT</label>
                  <input
                    type="date"
                    value={formCheckOut}
                    onChange={(e) => setFormCheckOut(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TIPE KAMAR</label>
                  <select
                    value={formRoomType}
                    onChange={(e) => setFormRoomType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Standard Room">Standard Room</option>
                    <option value="Deluxe Room">Deluxe Room</option>
                    <option value="Suite Room">Suite Room</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">NOMOR KAMAR</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TARIF PER MALAM (RP)</label>
                  <input
                    type="number"
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">STATUS PEMBAYARAN</label>
                  <select
                    value={formPaymentStatus}
                    onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Unpaid">Belum Bayar (Unpaid)</option>
                    <option value="Paid">Lunas (Paid)</option>
                    <option value="Pending">Menunggu Jaminan (Pending)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">STATUS RESERVASI</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Issues">Issues</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModifyModalOpen(false)}
                  className="flex-1 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer transition-colors text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg cursor-pointer transition-colors text-center shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
