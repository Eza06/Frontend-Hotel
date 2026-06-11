import { 
  CheckCircle2, 
  BedDouble, 
  Brush, 
  UserCheck, 
  UserX, 
  Wrench, 
  ChevronRight,
  Bell
} from 'lucide-react';
import type { CheckInGuest, CheckOutGuest, ServiceRequest } from '../../types';

interface DashboardProps {
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
}

export default function Dashboard({
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
  handleCheckOutAction
}: DashboardProps) {
  return (
    <div className="space-y-6">
      
      {/* KPI CARDS (3x2 Grid Layout) */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statistik Operasional Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          
          {/* Card 1: Available Rooms (Green style) */}
          <div className="bg-white p-5 rounded-xl border border-green-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Kamar Tersedia (Available)</p>
              <h3 className="text-3xl font-extrabold text-green-600 mt-1">{availableCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Siap untuk Tamu Baru</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Occupied Rooms (Blue style) */}
          <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Kamar Terisi (Occupied)</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{occupiedCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Okupansi: {Math.round((occupiedCount / totalRoomsCount) * 105) > 100 ? 100 : Math.round((occupiedCount / totalRoomsCount) * 100)}%</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Dirty Rooms (Orange style) */}
          <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Kamar Kotor (Dirty)</p>
              <h3 className="text-3xl font-extrabold text-orange-600 mt-1">{dirtyCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Butuh Pembersihan Staf</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <Brush className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Today's Check In */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kedatangan Hari Ini (Check-In)</p>
              <h3 className="text-3xl font-extrabold text-[#1E3A5F] mt-1">{todayCheckInCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">
                {checkins.filter(c => c.status === 'Checked In').length} Berhasil Masuk
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#1E3A5F] shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 5: Today's Check Out */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keberangkatan Hari Ini (Check-Out)</p>
              <h3 className="text-3xl font-extrabold text-[#1E3A5F] mt-1">{todayCheckOutCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">
                {checkouts.filter(c => c.status === 'Checked Out').length} Berhasil Keluar
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#1E3A5F] shrink-0">
              <UserX className="w-6 h-6" />
            </div>
          </div>

          {/* Card 6: Maintenance Rooms (Red style) */}
          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Perbaikan (Maintenance)</p>
              <h3 className="text-3xl font-extrabold text-red-600 mt-1">{maintenanceCount}</h3>
              <p className="text-[10px] text-gray-500 mt-1">Kamar Sedang Diperbaiki</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 1: CHECK-IN & CHECK-OUT ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Check-In Activity */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Aktivitas Kedatangan (Check-In)</h3>
            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded border border-green-200">
              {checkins.filter(c => c.status === 'Pending').length} Antrean
            </span>
          </div>
          <div className="space-y-3">
            {checkins.map(ci => (
              <div key={ci.id} className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-[#1E3A5F]">{ci.name}</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    Kamar {ci.roomNum} ({ci.roomType}) • Kedatangan: {ci.time}
                  </p>
                </div>
                <div>
                  {ci.status === 'Checked In' ? (
                    <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[9px] font-bold rounded-full border border-green-200 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      <span>Masuk</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckInAction(ci.id, ci.roomNum)}
                      className="px-3 py-1 bg-[#1E3A5F] text-white text-[9px] font-bold rounded-lg hover:bg-[#1E3A5F]/95 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Check-In</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Check-Out Activity */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Aktivitas Kepulangan (Check-Out)</h3>
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded border border-orange-200">
              {checkouts.filter(c => c.status === 'Pending').length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {checkouts.map(co => (
              <div key={co.id} className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-[#1E3A5F]">{co.name}</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                    Kamar {co.roomNum} • Jadwal: {co.time} • Tagihan: {co.balance === 0 ? 'Lunas' : `Rp ${co.balance.toLocaleString('id-ID')}`}
                  </p>
                </div>
                <div>
                  {co.status === 'Checked Out' ? (
                    <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[9px] font-bold rounded-full border border-gray-200 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      <span>Keluar</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckOutAction(co.id, co.roomNum)}
                      className="px-3 py-1 bg-red-600 text-white text-[9px] font-bold rounded-lg hover:bg-red-700 transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Check-Out</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 2: LIVE QUEUE & STAFF ON DUTY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Live Queue (Antrean Langsung) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#1E3A5F] shrink-0" />
              <span>Antrean Operasional Langsung (Live Queue)</span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {/* Queue 1: Pending Check-In */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kedatangan Pending</p>
              <div className="space-y-2">
                {checkins.filter(c => c.status === 'Pending').map(c => (
                  <div key={c.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{c.name} (Kamar {c.roomNum})</span>
                    <span className="text-[9px] font-bold text-[#1E3A5F] uppercase tracking-wider bg-[#1E3A5F]/10 px-2 py-0.5 rounded">Menunggu FO</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue 2: Pending Check-Out */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Keberangkatan Pending</p>
              <div className="space-y-2">
                {checkouts.filter(c => c.status === 'Pending').map(c => (
                  <div key={c.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="font-semibold text-gray-700">{c.name} (Kamar {c.roomNum})</span>
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Menunggu Billing</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue 3: Pending Service Requests */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Permintaan Layanan Tamu</p>
              <div className="space-y-2">
                {serviceRequests.filter(s => s.status !== 'Resolved').map(s => (
                  <div key={s.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Kamar {s.roomNum}: {s.item}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      s.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Staff Duty */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs text-left">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Jadwal Tugas Staf Aktif (Staff Duty)</h3>
          </div>
          <div className="space-y-4">
            {[
              { dept: 'Front Office', name: 'Ana Morales (FO Supervisor)', status: 'Online' },
              { dept: 'Housekeeping', name: 'Tom Reeves (Pembersihan Kamar)', status: 'Online' },
              { dept: 'Customer Service', name: 'Gao Achebe (Pelayanan Kamar)', status: 'Offline' },
              { dept: 'Food & Beverage', name: 'Nina Sato (Room Service POS)', status: 'Online' },
            ].map((stf, index) => {
              const isOnline = stf.status === 'Online';
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FA] border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-[10px] font-bold text-[#1E3A5F] uppercase tracking-wider">{stf.dept}</p>
                    <p className="text-xs font-extrabold text-gray-800 mt-0.5">{stf.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded border ${
                      isOnline 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {stf.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
