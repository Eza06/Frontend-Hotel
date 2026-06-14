import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  User as UserIcon,
  Calendar,
  Layers,
  ChevronRight,
  Plus
} from 'lucide-react';
import type { ServiceRequest, User, CSStaff } from '../../types';

interface CustomerServiceDashboardProps {
  serviceRequests: ServiceRequest[];
  handleResolveCSRequest: (id: number) => void;
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  loggedInUser: User | null;
  setActiveTab: (tab: any) => void;
  csStaffList: CSStaff[];
  setCsStaffList: React.Dispatch<React.SetStateAction<CSStaff[]>>;
}

export interface EnrichedCSTask {
  id: number;
  roomNum: number;
  item: string;
  status: 'Pending' | 'On Progress' | 'Resolved';
  guestName: string;
  stayDay: string;
  priority: 'Critical' | 'Medium' | 'Low';
  createdTime: string;
  assigneeName: string;
  code?: string;
}

export default function CustomerServiceDashboard({
  serviceRequests,
  handleResolveCSRequest,
  setServiceRequests,
  loggedInUser,
  setActiveTab,
  csStaffList,
  setCsStaffList
}: CustomerServiceDashboardProps) {

  const staffName = loggedInUser?.name || 'Rina Lestari';
  const staffRole = loggedInUser?.role || 'Customer Service';
  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentStaff = csStaffList.find(s => s.id === loggedInUser?.nip || s.name === staffName);
  const isWorking = currentStaff ? currentStaff.status === 'Working' : false;

  const handleStartWorking = () => {
    setCsStaffList(prev => prev.map(s => (s.id === loggedInUser?.nip || s.name === staffName) ? { ...s, status: 'Working' } : s));
  };

  const handleStopWorking = () => {
    setCsStaffList(prev => prev.map(s => (s.id === loggedInUser?.nip || s.name === staffName) ? { ...s, status: 'Offline', assignedTickets: [] } : s));
    setServiceRequests(prev => prev.map(req => {
      if (req.assigneeNip === loggedInUser?.nip || req.assigneeName === staffName) {
        return { ...req, status: 'Pending', assigneeName: undefined, assigneeNip: undefined };
      }
      return req;
    }));
  };

  // Modal State for quick ticket creation
  const [isQuickTicketOpen, setIsQuickTicketOpen] = useState(false);
  const [roomNumInput, setRoomNumInput] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'Critical' | 'Medium' | 'Low'>('Medium');

  // Selected ticket ID for detail sidebar
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(() => {
    return serviceRequests.length > 0 ? serviceRequests[0].id : null;
  });

  // Enrich data for display (Guest Names, Stay days, priority, assignee etc)
  const getEnrichedTickets = (): EnrichedCSTask[] => {
    return serviceRequests.map(req => {
      const priority = req.priority || 'Low';

      // Guest details
      const names = ['Alexander Pierce', 'Elena Rodriguez', 'Marcus Chen', 'Sophie Laurent', 'David Kim', 'Aisha Bello'];
      const guestName = req.guestName || names[req.id % names.length];
      const stayDays = ['3/5', '1/3', '2/4', '4/7', '2/5'];
      const stayDay = stayDays[req.id % stayDays.length];

      // Assignee
      const assigneeName = req.assigneeName || 'Unassigned';

      const createdTime = req.createdTime || `${(9 + (req.id % 3))}:45 AM`;

      return {
        id: req.id,
        roomNum: req.roomNum,
        item: req.item,
        status: req.status,
        guestName,
        stayDay,
        priority,
        createdTime,
        assigneeName,
        code: req.code || `TKT-${req.id.toString().padStart(3, '0')}`
      };
    });
  };

  const enrichedTickets = getEnrichedTickets();
  const currentTicket = enrichedTickets.find(t => t.id === selectedTicketId) || enrichedTickets[0] || null;

  // Counters
  const countOpen = serviceRequests.filter(r => r.status === 'Pending').length;
  const countInProgress = serviceRequests.filter(r => r.status === 'On Progress').length;
  const countCompleted = serviceRequests.filter(r => r.status === 'Resolved').length;
  const countTotal = serviceRequests.length;

  // Helper stats category counts
  const categoryCounts = enrichedTickets.reduce((acc, t) => {
    let cat = 'Amenities';
    if (t.item.toLowerCase().includes('ac') || t.item.toLowerCase().includes('bocor') || t.item.toLowerCase().includes('lampu')) {
      cat = 'Maintenance';
    } else if (t.item.toLowerCase().includes('makan') || t.item.toLowerCase().includes('teh') || t.item.toLowerCase().includes('kopi')) {
      cat = 'Food & Beverage';
    } else if (t.item.toLowerCase().includes('antar') || t.item.toLowerCase().includes('bandara') || t.item.toLowerCase().includes('taksi')) {
      cat = 'Transportation';
    }
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAssignToStaff = (id: number) => {
    setServiceRequests(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'On Progress' };
      }
      return req;
    }));
  };

  const handleCreateQuickTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomNumInput && itemInput) {
      const newId = serviceRequests.length + 1;
      setServiceRequests(prev => [
        ...prev,
        {
          id: newId,
          roomNum: parseInt(roomNumInput),
          item: itemInput,
          status: 'Pending'
        }
      ]);
      setSelectedTicketId(newId);
      setIsQuickTicketOpen(false);
      setRoomNumInput('');
      setItemInput('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* MAIN WORKSPACE VIEW (9 COLS) */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1E3A5F]">Customer Service Workspace</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-bold">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{currentDate}</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                <span>{staffName} ({staffRole})</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${isWorking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span>Status: {isWorking ? 'Aktif Bekerja' : 'Offline'}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {!isWorking ? (
              <button
                onClick={handleStartWorking}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg flex items-center justify-center space-x-1.5 shadow-3xs cursor-pointer transition-all active:scale-95"
              >
                <span>START WORKING</span>
              </button>
            ) : (
              <button
                onClick={handleStopWorking}
                className="px-4 py-2.5 bg-red-650 hover:bg-red-750 text-white text-xs font-black rounded-lg flex items-center justify-center space-x-1.5 shadow-3xs cursor-pointer transition-all active:scale-95"
              >
                <span>STOP WORKING</span>
              </button>
            )}

            <button
              onClick={() => setIsQuickTicketOpen(true)}
              className="px-4 py-2.5 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white text-xs font-black rounded-lg flex items-center justify-center space-x-1.5 shadow-3xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>BUAT TIKET BARU</span>
            </button>
            <button
              onClick={() => setActiveTab('cs')}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors"
            >
              <span>BUKA WORKSPACE CS</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Tickets */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tickets</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{countTotal}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-550">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* Open Tickets */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Open (Pending)</p>
              <h3 className="text-2xl font-black text-blue-700 mt-1">{countOpen}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
          </div>

          {/* In progress tickets */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-black text-orange-700 mt-1">{countInProgress}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Completed tickets */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-black text-[#22C55E] mt-1">{countCompleted}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ACTIVE QUEUE TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">
              Antrean Permintaan Tamu Aktif
            </h3>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-full animate-pulse border border-blue-150">
              Live updates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-250 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-3 px-4">Kamar</th>
                  <th className="py-3 px-4">Detail Permintaan / Item</th>
                  <th className="py-3 px-4">Nama Tamu</th>
                  <th className="py-3 px-4">No. Tiket</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody>
                {enrichedTickets.map(task => {
                  const isSelected = task.id === selectedTicketId;
                  return (
                    <tr 
                      key={task.id}
                      onClick={() => setSelectedTicketId(task.id)}
                      className={`border-b border-gray-150 hover:bg-gray-50/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/20 font-semibold border-l-4 border-l-[#1E3A5F]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-extrabold text-[#1E3A5F]">Room {task.roomNum}</td>
                      <td className="py-3 px-4 text-gray-700 truncate max-w-[200px]" title={task.item}>
                        {task.item}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{task.guestName}</td>
                      <td className="py-3 px-4 font-bold text-gray-650">
                        #{task.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          task.status === 'Resolved'
                            ? 'bg-green-50 text-[#22C55E] border-green-200'
                            : task.status === 'On Progress'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {task.status === 'Resolved' ? 'Completed' : task.status === 'On Progress' ? 'In Progress' : 'Open'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'Pending' && (
                          <button
                            onClick={() => handleAssignToStaff(task.id)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 rounded text-[10px] cursor-pointer"
                          >
                            Tugaskan
                          </button>
                        )}
                        {task.status !== 'Resolved' ? (
                          <button
                            onClick={() => handleResolveCSRequest(task.id)}
                            className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 font-bold border border-green-200 rounded text-[10px] cursor-pointer"
                          >
                            Selesaikan
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[10px] font-semibold">Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* TWO BOTTOM SECTIONS: CATEGORICAL VISUAL STATS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12 bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">
              Sebaran Kategori Permintaan Layanan
            </h3>
            
            <div className="space-y-4 pt-1">
              {['Amenities', 'Food & Beverage', 'Maintenance', 'Transportation'].map(cat => {
                const count = categoryCounts[cat] || 0;
                const pct = countTotal > 0 ? Math.round((count / countTotal) * 100) : 0;
                
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-gray-750">{cat}</span>
                      <span className="text-gray-500">{count} Tiket ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat === 'Maintenance' ? 'bg-red-500' :
                          cat === 'Food & Beverage' ? 'bg-orange-500' :
                          cat === 'Transportation' ? 'bg-sky-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: ACTIVE TICKET DETAIL (3 COLS) */}
      <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-5">
        <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider pb-2 border-b border-gray-200">
          Ticket Detail Pane
        </h3>

        {currentTicket ? (
          <div className="space-y-5">
            {/* Guest Info */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Profil Tamu</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Kamar</span>
                  <span className="font-black text-[#1E3A5F]">Room {currentTicket.roomNum}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Nama Tamu</span>
                  <span className="font-bold text-gray-700">{currentTicket.guestName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-bold">Masa Inap</span>
                  <span className="font-bold text-gray-700">Hari ke-{currentTicket.stayDay}</span>
                </div>
              </div>
            </div>

            {/* Request Info */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Permintaan Tamu</h4>
              <div className="p-3 bg-blue-50/25 border border-blue-100 rounded-lg space-y-1.5">
                <p className="text-xs font-bold text-gray-800 italic">"{currentTicket.item}"</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Detail Tiket</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Waktu Dibuat</span>
                  <span className="font-mono text-gray-800">{currentTicket.createdTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>No. Tiket</span>
                  <span className="font-mono text-gray-800">#{currentTicket.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Petugas</span>
                  <span className="text-gray-800">{currentTicket.assigneeName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`font-bold uppercase text-[10px] ${
                    currentTicket.status === 'Resolved' ? 'text-green-600' :
                    currentTicket.status === 'On Progress' ? 'text-orange-655' : 'text-blue-600'
                  }`}>{currentTicket.status === 'Resolved' ? 'Completed' : currentTicket.status === 'On Progress' ? 'In Progress' : 'Open'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 border-t border-gray-200 pt-4">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Aksi Cepat</h4>
              
              <div className="space-y-2">
                {currentTicket.status === 'Pending' && (
                  <button
                    onClick={() => handleAssignToStaff(currentTicket.id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs transition-colors"
                  >
                    <span>Tugaskan Petugas</span>
                  </button>
                )}

                {currentTicket.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolveCSRequest(currentTicket.id)}
                    className="w-full py-2.5 bg-[#22C55E] hover:bg-green-600 text-white font-extrabold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Selesaikan Tiket Layanan</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 bg-green-50 border border-green-200 text-[#22C55E] font-black rounded-lg text-center text-xs">
                    ✓ Tiket Selesai & Ditutup
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs font-bold">No Ticket Selected</p>
            <p className="text-[10px]">Silakan klik salah satu baris tabel di samping untuk melihat detail.</p>
          </div>
        )}
      </div>

      {/* QUICK NEW TICKET MODAL */}
      {isQuickTicketOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm p-6 text-left relative">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider mb-4">
              Buat Tiket Layanan Kamar Baru
            </h3>
            
            <form onSubmit={handleCreateQuickTicket} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                <input
                  type="number"
                  required
                  placeholder="Nomor Kamar (misal: 102)"
                  value={roomNumInput}
                  onChange={(e) => setRoomNumInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keluhan / Permintaan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Misal: AC bocor, minta handuk mandi tambahan..."
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prioritas</label>
                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuickTicketOpen(false)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
