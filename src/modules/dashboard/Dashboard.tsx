import React, { useState } from 'react';
import { 
  CheckCircle2, 
  BedDouble, 
  Brush, 
  Wrench, 
  Bell,
  ArrowRightLeft,
  Calendar,
  Layers,
  DollarSign,
  User,
  Activity,
  Clock,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import type { Room, CheckInGuest, CheckOutGuest, ServiceRequest, User as UserType, Housekeeper, CleaningHistoryItem, CSStaff } from '../../types';
import HousekeepingDashboard from '../housekeeping/HousekeepingDashboard';
import CustomerServiceDashboard from '../customer-service/CustomerServiceDashboard';

interface DashboardProps {
  rooms: Room[];
  availableCount: number;
  occupiedCount: number;
  dirtyCount: number;
  maintenanceCount: number;
  totalRoomsCount: number;
  todayCheckInCount: number;
  todayCheckOutCount: number;
  checkins: CheckInGuest[];
  checkouts: CheckOutGuest[];
  serviceRequests: ServiceRequest[];
  handleCheckInAction: (id: number, roomNum: number) => void;
  handleCheckOutAction: (id: number, roomNum: number) => void;
  setActiveTab: (tab: any) => void;
  userRole: string;
  loggedInUser?: UserType | null;
  handleCleanRoomAction: (roomNum: number) => void;
  handleResolveCSRequest: (id: number) => void;
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  staffList: Housekeeper[];
  setStaffList: React.Dispatch<React.SetStateAction<Housekeeper[]>>;
  cleaningHistory: CleaningHistoryItem[];
  setCleaningHistory: React.Dispatch<React.SetStateAction<CleaningHistoryItem[]>>;
  csStaffList: CSStaff[];
  setCsStaffList: React.Dispatch<React.SetStateAction<CSStaff[]>>;
}

export default function Dashboard({
  rooms,
  availableCount,
  occupiedCount,
  dirtyCount,
  maintenanceCount,
  totalRoomsCount,
  todayCheckInCount,
  todayCheckOutCount,
  checkins,
  checkouts,
  serviceRequests,
  handleCheckInAction,
  handleCheckOutAction,
  setActiveTab,
  userRole,
  loggedInUser,
  handleCleanRoomAction,
  handleResolveCSRequest,
  setServiceRequests,
  staffList,
  setStaffList,
  cleaningHistory,
  setCleaningHistory,
  csStaffList,
  setCsStaffList
}: DashboardProps) {
  
  // Interactive Room States (used in Front Office view)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');

  // Floor Map grouping helper
  const roomsByFloor = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  // Get status color styling
  const getStatusStyle = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-50/70 hover:bg-emerald-50',
          border: 'border-emerald-200 hover:border-emerald-300',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Available'
        };
      case 'occupied':
        return {
          bg: 'bg-sky-50/70 hover:bg-sky-50',
          border: 'border-sky-200 hover:border-sky-300',
          text: 'text-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          label: 'Occupied'
        };
      case 'dirty':
        return {
          bg: 'bg-amber-50/70 hover:bg-amber-50',
          border: 'border-amber-200 hover:border-amber-300',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Dirty'
        };
      case 'maintenance':
        return {
          bg: 'bg-rose-50/70 hover:bg-rose-50',
          border: 'border-rose-200 hover:border-rose-300',
          text: 'text-rose-700',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          label: 'Maintenance'
        };
    }
  };

  // Perform quick check-in from floor map
  const executeQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !selectedGuestId) return;
    
    const guestIdNum = parseInt(selectedGuestId);
    handleCheckInAction(guestIdNum, selectedRoom.id);
    
    setSelectedRoom(null);
    setSelectedGuestId('');
    alert(`Proses Check-In Kamar ${selectedRoom.id} sukses! Status kamar terisi.`);
  };

  // Perform quick check-out from floor map
  const executeQuickCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    // Find the checkout guest record for this room
    const matchingCheckout = checkouts.find(c => c.roomNum === selectedRoom.id && c.status === 'Pending');
    if (matchingCheckout) {
      handleCheckOutAction(matchingCheckout.id, selectedRoom.id);
      setSelectedRoom(null);
      alert(`Proses Check-Out Kamar ${selectedRoom.id} sukses! Kamar siap dibersihkan housekeeping.`);
    } else {
      handleCheckOutAction(Date.now(), selectedRoom.id);
      setSelectedRoom(null);
      alert(`Proses Check-Out Kamar ${selectedRoom.id} sukses! Kamar diset menjadi kotor.`);
    }
  };

  // Check if room has pending guest checkin/checkout
  const getRoomGuestName = (roomId: number) => {
    const activeCheckout = checkouts.find(c => c.roomNum === roomId && c.status === 'Pending');
    if (activeCheckout) return activeCheckout.name;
    const activeCheckin = checkins.find(c => c.roomNum === roomId && c.status === 'Checked In');
    if (activeCheckin) return activeCheckin.name;
    return 'Guest';
  };

  // ==========================================
  // VIEW RENDERER 3: HOUSEKEEPING DASHBOARD
  // ==========================================
  if (userRole === 'Housekeeping' || userRole === 'Housekeeping Supervisor') {
    return (
      <HousekeepingDashboard 
        rooms={rooms}
        handleCleanRoomAction={handleCleanRoomAction}
        loggedInUser={loggedInUser || null}
        setActiveTab={setActiveTab}
        staffList={staffList}
        setStaffList={setStaffList}
        cleaningHistory={cleaningHistory}
        setCleaningHistory={setCleaningHistory}
      />
    );
  }

  // ==========================================
  // VIEW RENDERER 4: CUSTOMER SERVICE DASHBOARD
  // ==========================================
  if (userRole === 'Customer Service') {
    return (
      <CustomerServiceDashboard 
        serviceRequests={serviceRequests}
        handleResolveCSRequest={handleResolveCSRequest}
        setServiceRequests={setServiceRequests}
        loggedInUser={loggedInUser || null}
        setActiveTab={setActiveTab}
        csStaffList={csStaffList}
        setCsStaffList={setCsStaffList}
      />
    );
  }

  // ==========================================
  // VIEW RENDERER 1: ADMINISTRATOR DASHBOARD
  // ==========================================
  if (userRole === 'Administrator' || userRole === 'Hotel Manager') {
    // Admin metrics calculations
    const estimatedRoomRevenue = occupiedCount * 750000; // Mock average rate
    const pendingCSCount = serviceRequests.filter(s => s.status !== 'Resolved').length;

    return (
      <div className="space-y-6 text-left">
        
        {/* ADMIN GREETING HEADER */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1E3A5F]">Administrator Control Center</h2>
              <p className="text-xs text-gray-500 mt-0.5">SMA PERHOTELAN • Tinjauan Operasional Menyeluruh & Kontrol Master Data</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 bg-gray-50 border rounded-lg flex items-center space-x-2 text-xs font-bold text-gray-650">
              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              <span>Est. Revenue Kamar: Rp {estimatedRoomRevenue.toLocaleString('id-ID')}</span>
            </div>

            <button 
              onClick={() => setActiveTab('master')}
              className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-extrabold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Manage Master Data</span>
            </button>
          </div>
        </div>

        {/* ADMIN KPI METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Available Rooms */}
          <div className="bg-white p-4.5 rounded-xl border border-emerald-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Kamar Tersedia</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{availableCount}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Siap untuk Tamu Baru</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Occupied Rooms */}
          <div className="bg-white p-4.5 rounded-xl border border-blue-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Kamar Terisi</p>
              <h3 className="text-2xl font-black text-blue-600 mt-1">{occupiedCount}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Okupansi: {totalRoomsCount > 0 ? Math.round((occupiedCount / totalRoomsCount) * 100) : 0}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Dirty Rooms */}
          <div className="bg-white p-4.5 rounded-xl border border-orange-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Kamar Kotor</p>
              <h3 className="text-2xl font-black text-orange-600 mt-1">{dirtyCount}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Butuh Pembersihan Staf</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Brush className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Under Repair */}
          <div className="bg-white p-4.5 rounded-xl border border-rose-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Dalam Perbaikan</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">{maintenanceCount}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Kamar Dikunci Fasilitas</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* SYSTEM STATUS NOTIFICATION BANNER */}
        {pendingCSCount > 0 && (
          <div className="p-3.5 bg-blue-50/50 border border-blue-150 rounded-xl text-xs font-bold text-[#1E3A5F] flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#1E3A5F] animate-bounce shrink-0" />
              <span>Informasi Sistem: Ada {pendingCSCount} tiket keluhan tamu / permintaan layanan kamar pending.</span>
            </span>
            <button onClick={() => setActiveTab('cs')} className="text-blue-700 hover:underline cursor-pointer">
              Buka Layanan Pelanggan ➜
            </button>
          </div>
        )}

        {/* MAIN ADMIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* LEFT 8-COLUMNS: CHECK-IN & CHECK-OUT LEDGERS */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Check-In / Check-Out ledger grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Check-In Activity */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Aktivitas Masuk (Check-In)</h3>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded border border-emerald-200">
                    {checkins.length} Total
                  </span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {checkins.map(ci => (
                    <div key={ci.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs font-extrabold text-[#1E3A5F]">{ci.name}</p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                          Kamar {ci.roomNum} ({ci.roomType}) • Waktu: {ci.time}
                        </p>
                      </div>
                      <div>
                        {ci.status === 'Checked In' ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-200">
                            Masuk
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCheckInAction(ci.id, ci.roomNum)}
                            className="px-2.5 py-0.5 bg-[#1E3A5F] text-white text-[9px] font-extrabold rounded hover:bg-[#1E3A5F]/95 cursor-pointer flex items-center space-x-1"
                          >
                            <span>Check-In</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-Out Activity */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Aktivitas Keluar (Check-Out)</h3>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded border border-orange-200">
                    {checkouts.length} Total
                  </span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {checkouts.map(co => (
                    <div key={co.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-xs font-extrabold text-[#1E3A5F]">{co.name}</p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                          Kamar {co.roomNum} • Tagihan: Rp {co.balance.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div>
                        {co.status === 'Checked Out' ? (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-black rounded-full border border-gray-200">
                            Keluar
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCheckOutAction(co.id, co.roomNum)}
                            className="px-2.5 py-0.5 bg-red-650 text-white text-[9px] font-extrabold rounded hover:bg-red-750 cursor-pointer flex items-center space-x-1"
                          >
                            <span>Check-Out</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT 4-COLUMNS: STAFF ON DUTY & ADMIN SHORTCUTS */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Staff duty schedule */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Staf Aktif (Active Staff Duty)</h3>
              </div>
              <div className="space-y-3.5">
                {[
                  { dept: 'Front Office', name: 'Ana Morales (Supervisor)', status: 'Online' },
                  { dept: 'Housekeeping', name: 'Tom Reeves (Cleaner Coordinator)', status: 'Online' },
                  { dept: 'Customer Service', name: 'Gao Achebe (Desk Representative)', status: 'Offline' },
                  { dept: 'Food & Beverage', name: 'Nina Sato (Cashier Cafe)', status: 'Online' },
                ].map((stf, index) => {
                  const isOnline = stf.status === 'Online';
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-150 rounded-lg text-xs">
                      <div>
                        <p className="text-[9px] font-bold text-[#1E3A5F] uppercase tracking-wider">{stf.dept}</p>
                        <p className="font-extrabold text-gray-800 mt-0.5">{stf.name}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded border ${
                        isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {stf.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Admin Navigation Panel */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left space-y-3">
              <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider border-b pb-2">Admin Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-extrabold text-gray-700">
                <button onClick={() => setActiveTab('reports')} className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1">
                  <DollarSign className="w-5 h-5 text-[#1E3A5F]" />
                  <span>Laporan Keuangan</span>
                </button>
                <button onClick={() => setActiveTab('master')} className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1">
                  <ClipboardList className="w-5 h-5 text-[#1E3A5F]" />
                  <span>Master Kamar/Menu</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW RENDERER 2: FRONT OFFICE DASHBOARD
  // ==========================================
  return (
    <div className="space-y-6 text-left">
      
      {/* FRONT OFFICE GREETING HEADER */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white shrink-0">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1E3A5F]">Front Office Command Center</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              SMA PERHOTELAN • Rencana Hari Ini: {todayCheckInCount} Kedatangan (Check-In) • {todayCheckOutCount} Keberangkatan (Check-Out)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-1.5 bg-gray-50 border rounded-lg flex items-center space-x-2 text-xs font-bold text-gray-600">
            <Clock className="w-3.5 h-3.5 text-[#1E3A5F]" />
            <span>Shift Pagi: 07:00 - 15:00 WIB</span>
          </div>

          <button 
            onClick={() => setActiveTab('reservation')}
            className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-extrabold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS (4 Column Hospitality Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Available */}
        <div className="bg-white p-4.5 rounded-xl border border-emerald-150 shadow-3xs flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Kamar Tersedia</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-1">{availableCount}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Siap huni</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Occupied */}
        <div className="bg-white p-4.5 rounded-xl border border-sky-150 shadow-3xs flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div>
            <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Kamar Terisi</p>
            <h3 className="text-2xl font-black text-sky-700 mt-1">{occupiedCount}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">
              Okupansi: {totalRoomsCount > 0 ? Math.round((occupiedCount / totalRoomsCount) * 100) : 0}%
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50/50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Dirty */}
        <div className="bg-white p-4.5 rounded-xl border border-amber-150 shadow-3xs flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div>
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Kamar Kotor</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{dirtyCount}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Butuh dibersihkan</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50/50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Brush className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: In Queue */}
        <div className="bg-white p-4.5 rounded-xl border border-purple-150 shadow-3xs flex items-center justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div>
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Antrean Hari Ini</p>
            <h3 className="text-2xl font-black text-purple-700 mt-1">
              {checkins.filter(c => c.status === 'Pending').length + checkouts.filter(c => c.status === 'Pending').length} Pax
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">FO Queue</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50/50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 8-COLUMNS: INTERACTIVE FLOOR MAP */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-5">
          <div className="flex items-center justify-between border-b pb-3.5">
            <div>
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#1E3A5F]" />
                <span>Denah Kamar Interaktif (Interactive Floor Map)</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Klik pada kotak kamar untuk melihat detail atau memproses Check-In & Check-Out.</p>
            </div>
            
            <div className="flex items-center space-x-2 text-[10px] font-bold">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span><span className="text-gray-500">Avail</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-sky-500"></span><span className="text-gray-500">Occupied</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span><span className="text-gray-500">Dirty</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span><span className="text-gray-500">Maint</span></span>
            </div>
          </div>

          {serviceRequests.filter(s => s.status !== 'Resolved').length > 0 && (
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[10px] font-bold text-[#1E3A5F] flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-[#1E3A5F] animate-bounce shrink-0" />
                <span>Ada {serviceRequests.filter(s => s.status !== 'Resolved').length} Permintaan Layanan Kamar Aktif menuntut respon Front Office.</span>
              </span>
              <button onClick={() => setActiveTab('cs')} className="text-[#1E3A5F] hover:underline cursor-pointer">Kelola CS ➜</button>
            </div>
          )}

          {maintenanceCount > 0 && (
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg text-[10px] font-bold text-rose-750 flex items-center space-x-1.5">
              <Wrench className="w-3.5 h-3.5 text-rose-600 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
              <span>Perhatian: Ada {maintenanceCount} kamar dalam perbaikan. Jangan menetapkan kamar ini pada tamu baru.</span>
            </div>
          )}

          {/* Grouped floor cards */}
          <div className="space-y-6">
            {Object.keys(roomsByFloor).sort().map(floorStr => {
              const floor = parseInt(floorStr);
              return (
                <div key={floor} className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                    <span>Lantai {floor}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    <span className="font-semibold text-gray-500 font-mono">({roomsByFloor[floor].length} Kamar)</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {roomsByFloor[floor].map(room => {
                      const style = getStatusStyle(room.status);
                      const displayGuest = room.status === 'occupied' ? getRoomGuestName(room.id) : null;
                      
                      return (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${style.bg} ${style.border} flex flex-col justify-between h-24`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-mono font-black text-gray-900">Rm {room.id}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${style.badge}`}>
                              {style.label}
                            </span>
                          </div>
                          
                          <div className="mt-2 text-left">
                            {displayGuest ? (
                              <p className="text-[10px] font-bold text-gray-800 truncate" title={displayGuest}>
                                {displayGuest}
                              </p>
                            ) : (
                              <p className="text-[10px] text-gray-400 font-semibold">{room.type}</p>
                            )}
                            <p className="text-[9px] text-gray-555 font-bold mt-0.5">Rp {room.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 4-COLUMNS: ACTIVE QUEUES & ACTIONS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Shortcuts */}
          <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-3xs space-y-3">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b pb-2">
              Front Office Actions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-extrabold text-gray-700">
              <button 
                onClick={() => setActiveTab('reservation')}
                className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>Pemesanan</span>
              </button>
              <button 
                onClick={() => setActiveTab('room')}
                className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <BedDouble className="w-5 h-5 text-gray-500" />
                <span>Status Kamar</span>
              </button>
              <button 
                onClick={() => setActiveTab('guest')}
                className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span>Data Tamu</span>
              </button>
              <button 
                onClick={() => setActiveTab('reports')}
                className="p-3 bg-gray-50 hover:bg-[#1E3A5F]/10 hover:text-[#1E3A5F] border rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span>Laporan Harian</span>
              </button>
            </div>
          </div>

          {/* Pending Operations Lists */}
          <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-3xs space-y-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
              <span>Operational Queue</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            </h3>

            {/* Check-ins Queue */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Antrean Kedatangan (Check-In)</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {checkins.filter(c => c.status === 'Pending').map(c => (
                  <div key={c.id} className="p-2.5 bg-emerald-50/20 border border-emerald-100 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-850">{c.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Rm {c.roomNum} ({c.roomType})</p>
                    </div>
                    <button
                      onClick={() => {
                        const room = rooms.find(r => r.id === c.roomNum);
                        if (room && room.status === 'available') {
                          handleCheckInAction(c.id, c.roomNum);
                          alert(`Check-In untuk ${c.name} di Kamar ${c.roomNum} berhasil!`);
                        } else {
                          alert(`Peringatan: Kamar ${c.roomNum} tidak tersedia atau sedang kotor/perbaikan. Selesaikan status kamar terlebih dahulu.`);
                        }
                      }}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-md text-[9px] cursor-pointer hover:bg-emerald-700"
                    >
                      Check-In
                    </button>
                  </div>
                ))}
                {checkins.filter(c => c.status === 'Pending').length === 0 && (
                  <p className="text-[10px] text-gray-455 italic">Tidak ada antrean kedatangan hari ini.</p>
                )}
              </div>
            </div>

            {/* Check-outs Queue */}
            <div className="space-y-2.5 pt-2 border-t border-gray-150">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Antrean Keberangkatan (Check-Out)</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {checkouts.filter(c => c.status === 'Pending').map(c => (
                  <div key={c.id} className="p-2.5 bg-orange-50/20 border border-orange-100 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-850">{c.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Rm {c.roomNum} • Tagihan: Rp {c.balance.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleCheckOutAction(c.id, c.roomNum);
                        alert(`Check-Out untuk ${c.name} dari Kamar ${c.roomNum} berhasil!`);
                      }}
                      className="px-2.5 py-1 bg-orange-600 text-white font-extrabold rounded-md text-[9px] cursor-pointer hover:bg-orange-700"
                    >
                      Billing
                    </button>
                  </div>
                ))}
                {checkouts.filter(c => c.status === 'Pending').length === 0 && (
                  <p className="text-[10px] text-gray-455 italic">Tidak ada antrean check-out pending.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* INTERACTIVE DETAIL MODAL PANEL */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left text-xs">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-[#1E3A5F] text-white flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Kamar {selectedRoom.id} Details</h3>
                <p className="text-[10px] text-white/70 font-semibold mt-0.5">Room Classification: {selectedRoom.type}</p>
              </div>
              <button 
                onClick={() => setSelectedRoom(null)}
                className="text-white hover:text-gray-250 cursor-pointer text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              
              {/* Room Metadata Card */}
              <div className="p-4 bg-gray-50 border rounded-xl grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Room Tariff</span>
                  <p className="font-extrabold text-gray-800 text-sm mt-0.5">Rp {selectedRoom.price.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Floor Location</span>
                  <p className="font-extrabold text-gray-800 text-sm mt-0.5">{selectedRoom.floor}nd Floor</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Current Status</span>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 border rounded text-[9px] font-black uppercase ${getStatusStyle(selectedRoom.status).badge}`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Room Custodian</span>
                  <p className="font-semibold text-gray-600 mt-1">FO Representative</p>
                </div>
              </div>

              {/* Status Specific Info */}
              {selectedRoom.status === 'occupied' && (
                <div className="p-3.5 bg-blue-50/30 border border-blue-200 rounded-lg space-y-1">
                  <span className="text-[9px] font-bold text-blue-600 uppercase">Occupying Guest</span>
                  <p className="font-black text-gray-800 text-sm">{getRoomGuestName(selectedRoom.id)}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Tamu memiliki reservasi aktif di sistem hotel.</p>
                </div>
              )}

              {selectedRoom.status === 'available' && (
                <div className="p-3 bg-emerald-50/20 border border-emerald-200 rounded-lg text-emerald-800 font-semibold">
                  Kamar ini bersih dan siap diisi. Silakan pilih tamu dari antrean kedatangan untuk check-in.
                </div>
              )}

              {selectedRoom.status === 'dirty' && (
                <div className="p-3 bg-amber-50/30 border border-amber-250 rounded-lg text-amber-800 font-semibold">
                  Kamar kotor setelah kepulangan tamu. Butuh pembersihan sebelum bisa digunakan kembali.
                </div>
              )}

              {selectedRoom.status === 'maintenance' && (
                <div className="p-3 bg-rose-50/30 border border-rose-250 rounded-lg text-rose-800 font-semibold">
                  Kamar sedang dalam masa pemeliharaan fasilitas (AC rusak, listrik padam, dll).
                </div>
              )}

              {/* Modals trigger within modal */}
              {selectedRoom.status === 'available' && (
                <div className="space-y-3">
                  <div className="border-t border-gray-150 pt-3">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Pilih Tamu Check-In</label>
                    <select
                      value={selectedGuestId}
                      onChange={(e) => setSelectedGuestId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">-- Pilih Tamu Antrean --</option>
                      {checkins.filter(c => c.status === 'Pending').map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Rm preferred: {c.roomNum})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={executeQuickCheckIn}
                      disabled={!selectedGuestId}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold rounded-lg text-center cursor-pointer transition-colors"
                    >
                      Konfirmasi Check-In
                    </button>
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {selectedRoom.status === 'occupied' && (
                <div className="space-y-3 border-t border-gray-150 pt-3">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                    <span>Sisa Tagihan Billing:</span>
                    <span className="text-red-650 text-sm">
                      Rp {(checkouts.find(c => c.roomNum === selectedRoom.id && c.status === 'Pending')?.balance || 0).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={executeQuickCheckOut}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg text-center cursor-pointer transition-colors"
                    >
                      Proses Check-Out & Lunas
                    </button>
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}

              {selectedRoom.status === 'dirty' && (
                <div className="flex space-x-2 pt-2 border-t border-gray-150">
                  <button
                    onClick={() => {
                      alert(`Penugasan pembersihan Kamar ${selectedRoom.id} dikirim ke modul Housekeeping.`);
                      setSelectedRoom(null);
                    }}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-center cursor-pointer transition-colors"
                  >
                    Kirim ke Housekeeping
                  </button>
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {selectedRoom.status === 'maintenance' && (
                <div className="flex space-x-2 pt-2 border-t border-gray-150">
                  <button
                    onClick={() => {
                      alert(`Tiket perbaikan Kamar ${selectedRoom.id} diperbarui.`);
                      setSelectedRoom(null);
                    }}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg text-center cursor-pointer transition-colors"
                  >
                    Update Perbaikan
                  </button>
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
