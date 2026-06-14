import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Mail, 
  Clock, 
  Check, 
  X,
  RotateCcw
} from 'lucide-react';
import type { ServiceRequest, CSStaff } from '../../types';

interface CSProps {
  serviceRequests: ServiceRequest[];
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  handleResolveCSRequest: (id: number) => void;
  csStaffList: CSStaff[];
  setCsStaffList: React.Dispatch<React.SetStateAction<CSStaff[]>>;
}

export interface EnrichedTicket {
  id: number;
  code: string;
  type: string;
  guestName: string;
  roomNum: number;
  stayDay: string;
  assigneeName: string;
  priority: 'Critical' | 'Medium' | 'Low';
  status: 'Pending' | 'On Progress' | 'Resolved';
  createdTime: string;
  assignedTime?: string;
  resolvedTime?: string;
}

export default function CustomerServiceManagement({ 
  serviceRequests, 
  setServiceRequests, 
  handleResolveCSRequest,
  csStaffList,
  setCsStaffList
}: CSProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(() => {
    return serviceRequests.length > 0 ? serviceRequests[0].id : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'On Progress' | 'Resolved'>('All');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newRoomNum, setNewRoomNum] = useState('');
  const [newItem, setNewItem] = useState('');
  const [newPriority, setNewPriority] = useState<'Critical' | 'Medium' | 'Low'>('Medium');

  const [internalNotes, setInternalNotes] = useState<{ [key: number]: string }>({});
  const [noteInput, setNoteInput] = useState('');

  // Enrich mock values dynamically based on request data to keep App.tsx database compatible
  const getEnrichedTickets = (): EnrichedTicket[] => {
    return serviceRequests.map(req => {
      // Determine priority
      const priority = req.priority || 'Low';

      // Guest details
      const names = ['Alexander Pierce', 'Elena Rodriguez', 'Marcus Chen', 'Sophie Laurent', 'David Kim', 'Aisha Bello'];
      const guestName = req.guestName || names[req.id % names.length];
      const stayDays = ['3/5', '1/3', '2/4', '4/7', '2/5'];
      const stayDay = stayDays[req.id % stayDays.length];

      // Assignee
      const assigneeName = req.assigneeName || 'Unassigned';

      const code = req.code || `TKT-${req.id.toString().padStart(3, '0')}`;
      const createdTime = req.createdTime || `${(9 + (req.id % 3))}:45 AM`;
      const assignedTime = req.status !== 'Pending' ? (req.assignedTime || `${(9 + (req.id % 3))}:52 AM`) : undefined;
      const resolvedTime = req.status === 'Resolved' ? (req.resolvedTime || `${(10 + (req.id % 3))}:30 AM`) : undefined;

      return {
        id: req.id,
        code,
        type: req.item,
        guestName,
        roomNum: req.roomNum,
        stayDay,
        assigneeName,
        priority,
        status: req.status,
        createdTime,
        assignedTime,
        resolvedTime
      };
    });
  };

  const enrichedTickets = getEnrichedTickets();

  // Find currently selected ticket details
  const currentTicket = enrichedTickets.find(t => t.id === selectedTicketId) || enrichedTickets[0] || null;

  // Filtered tickets
  const filteredTickets = enrichedTickets.filter(t => {
    const matchesSearch = t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.roomNum.toString().includes(searchQuery);

    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesPriority = true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate dynamic KPI counts
  const countOpen = serviceRequests.filter(r => r.status === 'Pending').length;
  const countInProgress = serviceRequests.filter(r => r.status === 'On Progress').length;
  const countCompleted = serviceRequests.filter(r => r.status === 'Resolved').length;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomNum && newItem) {
      const newId = serviceRequests.length + 1;
      const newCode = `TKT-${String(newId).padStart(3, '0')}`;
      const createdStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      setServiceRequests(prev => [
        ...prev,
        {
          id: newId,
          roomNum: parseInt(newRoomNum),
          item: newItem,
          status: 'Pending',
          code: newCode,
          priority: newPriority,
          guestName: 'Walk-in Guest / Room Service',
          createdTime: createdStr
        }
      ]);
      setSelectedTicketId(newId);
      setIsNewTicketModalOpen(false);
      setNewRoomNum('');
      setNewItem('');
    }
  };


  const handleEvenDistribution = () => {
    const activeCS = csStaffList.filter(s => s.status === 'Working');
    if (activeCS.length === 0) {
      alert('Tidak ada staf Customer Service yang sedang aktif bekerja (Mulai Kerja). Harap aktifkan status kerja staf terlebih dahulu!');
      return;
    }

    const pendingRequests = serviceRequests.filter(r => r.status === 'Pending');
    if (pendingRequests.length === 0) {
      alert('Tidak ada tiket antrean berkategori pending/open untuk dibagikan.');
      return;
    }

    // Distribute pending requests to active CS staff
    setServiceRequests(prev => {
      let distributedCount = 0;
      const updated = prev.map(req => {
        if (req.status === 'Pending') {
          const staffIndex = distributedCount % activeCS.length;
          const targetStaff = activeCS[staffIndex];
          distributedCount++;
          return {
            ...req,
            status: 'On Progress' as const,
            assigneeNip: targetStaff.id,
            assigneeName: targetStaff.name,
            assignedTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };
        }
        return req;
      });
      return updated;
    });

    // Sync csStaffList assigned tickets
    setCsStaffList(prev => {
      return prev.map(s => {
        if (s.status === 'Working') {
          const ticketsAssigned = serviceRequests
            .filter(r => r.status === 'Pending')
            .filter((_, idx) => (idx % activeCS.length) === activeCS.findIndex(as => as.id === s.id))
            .map(r => r.id);
          return {
            ...s,
            assignedTickets: [...s.assignedTickets, ...ticketsAssigned]
          };
        }
        return s;
      });
    });

    alert(`Pembagian beban kerja berhasil! ${pendingRequests.length} tiket dibagikan secara merata ke ${activeCS.length} staf CS aktif.`);
  };

  const handleAddInternalNote = () => {
    if (currentTicket && noteInput.trim()) {
      setInternalNotes(prev => ({
        ...prev,
        [currentTicket.id]: noteInput
      }));
      setNoteInput('');
      alert('Catatan internal ditambahkan!');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Ticket Code,Type,Room,Guest,Priority,Status,Created Time\n';
    const rows = enrichedTickets.map(t => {
      return `#${t.code},"${t.type}",Kamar ${t.roomNum},${t.guestName},${t.priority},${t.status},${t.createdTime}`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customer_service_tickets_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      {/* SEARCH, FILTERS & NEW TICKET HEADER */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-3xs">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="cari kamar/nomor tamu"
              className="pl-8 pr-2.5 py-1.5 w-full bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-1 text-xs font-bold text-gray-400 uppercase">
            <span className="text-[10px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Pending">Open</option>
              <option value="On Progress">In Progress</option>
              <option value="Resolved">Completed</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="w-full md:w-auto px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-extrabold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Open Tickets */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider">OPEN</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{countOpen}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider">IN PROGRESS</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{countInProgress}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-extrabold text-green-600 uppercase tracking-wider">COMPLETED</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{countCompleted}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-655">
            <Check className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REAL-TIME OPERATIONS */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-3xs">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Real-time Operations</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Daftar Laporan & Permintaan Tamu Aktif</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEvenDistribution}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors shadow-3xs"
                title="Bagi rata antrean tiket ke staf CS yang aktif"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Bagi Rata Tugas</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-[10px] font-bold rounded-lg flex items-center space-x-1 cursor-pointer transition-colors shadow-3xs"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>
              <span className="px-2.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg flex items-center space-x-1 shadow-3xs">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                <span>Live View</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                  <th className="px-5 py-3 text-[10px]">TICKET / TYPE</th>
                  <th className="px-5 py-3 text-[10px]">GUEST / ROOM</th>
                  <th className="px-5 py-3 text-[10px]">ASSIGNEE</th>
                  <th className="px-5 py-3 text-[10px]">NO. TIKET</th>
                  <th className="px-5 py-3 text-[10px]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-155">
                {filteredTickets.map(t => {
                  const isSelected = currentTicket && t.id === currentTicket.id;
                  return (
                    <tr 
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`cursor-pointer transition-all hover:bg-gray-50/75 ${
                        isSelected ? 'bg-blue-50/45 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-extrabold text-[#1E3A5F]">#{t.code}</div>
                        <div className="text-[10px] text-gray-500 font-semibold mt-0.5">{t.type}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-800">{t.guestName}</div>
                        <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Kamar {t.roomNum}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        {t.assigneeName !== 'Unassigned' ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-[#1E3A5F] text-white rounded-full flex items-center justify-center text-[9px] font-black uppercase">
                              {t.assigneeName.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-700">{t.assigneeName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic font-semibold">Belum Ditugaskan</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-gray-700">
                        #{t.code}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center space-x-1.5 font-bold">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            t.status === 'Pending' ? 'bg-blue-500' :
                            t.status === 'On Progress' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`} />
                          <span className={
                            t.status === 'Pending' ? 'text-blue-650' :
                            t.status === 'On Progress' ? 'text-orange-600' :
                            'text-green-600'
                          }>
                            {t.status === 'Pending' ? 'Open' : t.status === 'On Progress' ? 'In Progress' : 'Completed'}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                      Tidak ada tiket customer service yang cocok dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE CONTEXT */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-3xs text-left">
          <div className="border-b border-gray-200 pb-3">
            <h3 className="text-xs font-black text-gray-450 uppercase tracking-wider">ACTIVE CONTEXT</h3>
          </div>

          {currentTicket ? (
            <div className="space-y-5 text-left">
              {/* Guest Profile */}
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-gray-100/80 border border-gray-200 flex items-center justify-center font-bold text-lg text-gray-600">
                  {currentTicket.guestName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E3A5F]">{currentTicket.guestName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Tamu Hotel</p>
                </div>
              </div>

              {/* Room & Stay Details */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-lg p-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Kamar</p>
                  <p className="text-xs font-extrabold text-[#1E3A5F] mt-0.5">Kamar {currentTicket.roomNum}</p>
                </div>
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-lg p-2">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Masa Inap</p>
                  <p className="text-xs font-extrabold text-gray-800 mt-0.5">Hari {currentTicket.stayDay}</p>
                </div>
              </div>

              {/* Ticket Details summary */}
              <div className="bg-blue-50/25 border border-blue-100 rounded-lg p-3 text-xs space-y-1 text-left">
                <p className="font-extrabold text-[#1E3A5F]">Detail Permintaan/Laporan:</p>
                <p className="text-gray-700 font-semibold">{currentTicket.type}</p>
              </div>

              {/* Ticket Timeline */}
              <div className="space-y-4 pt-1 text-left">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">TICKET TIMELINE</h5>
                
                <div className="relative border-l border-gray-200 pl-5 space-y-5 ml-2">
                  {/* Step 1: Tiket Dibuat */}
                  <div className="relative">
                    <span className="absolute -left-[25px] top-0.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Tiket Dibuat</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{currentTicket.createdTime} - Dibuat via sistem</p>
                    </div>
                  </div>

                  {/* Step 2: Sedang Dikerjakan */}
                  <div className="relative">
                    <span className={`absolute -left-[25px] top-0.5 w-3 h-3 border-2 border-white rounded-full flex items-center justify-center shadow-xs ${
                      currentTicket.status !== 'Pending' ? 'bg-orange-500' : 'bg-gray-200'
                    }`} />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Sedang Dikerjakan</p>
                      {currentTicket.status !== 'Pending' ? (
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {currentTicket.assignedTime || '11:00 AM'} - Ditugaskan ke {currentTicket.assigneeName}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic mt-0.5">Menunggu penugasan staf...</p>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Sudah Selesai */}
                  <div className="relative">
                    <span className={`absolute -left-[25px] top-0.5 w-3 h-3 border-2 border-white rounded-full flex items-center justify-center shadow-xs ${
                      currentTicket.status === 'Resolved' ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Sudah Selesai</p>
                      {currentTicket.status === 'Resolved' ? (
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {currentTicket.resolvedTime || '11:30 AM'} - Masalah berhasil diselesaikan
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic mt-0.5">Belum diselesaikan</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="pt-2 border-t border-gray-150 text-left">
                <label className="block text-[9px] font-bold text-gray-455 uppercase mb-1">Catatan Internal</label>
                {internalNotes[currentTicket.id] ? (
                  <div className="p-2 bg-yellow-50 border border-yellow-100 rounded-md text-[11px] text-yellow-800 font-semibold mb-2">
                    {internalNotes[currentTicket.id]}
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tulis catatan..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddInternalNote}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-md cursor-pointer transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              {/* Assign CS Staff Dropdown */}
              <div className="pt-2 border-t border-gray-155">
                <label className="block text-[10px] font-bold text-gray-455 uppercase mb-1">Tugaskan Staf CS</label>
                <select
                  value={serviceRequests.find(r => r.id === currentTicket.id)?.assigneeNip || ''}
                  onChange={(e) => {
                    const selectedNip = e.target.value;
                    const staffMember = csStaffList.find(s => s.id === selectedNip);
                    setServiceRequests(prev => prev.map(req => {
                      if (req.id === currentTicket.id) {
                        return {
                          ...req,
                          status: selectedNip ? 'On Progress' : 'Pending',
                          assigneeNip: selectedNip || undefined,
                          assigneeName: staffMember ? staffMember.name : undefined,
                          assignedTime: selectedNip ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : undefined
                        };
                      }
                      return req;
                    }));

                    // Also update csStaffList
                    setCsStaffList(prev => prev.map(s => {
                      if (s.id === selectedNip) {
                        return {
                          ...s,
                          assignedTickets: s.assignedTickets.includes(currentTicket.id)
                            ? s.assignedTickets
                            : [...s.assignedTickets, currentTicket.id]
                        };
                      }
                      return {
                        ...s,
                        assignedTickets: s.assignedTickets.filter(tid => tid !== currentTicket.id)
                      };
                    }));
                  }}
                  className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                >
                  <option value="">Belum Ditugaskan / Antrean</option>
                  {csStaffList.map(stf => (
                    <option key={stf.id} value={stf.id}>
                      {stf.name} {stf.status === 'Offline' ? '(Offline)' : '(Aktif)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-155 flex gap-3">

                {currentTicket.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolveCSRequest(currentTicket.id)}
                    className="flex-1 py-2 bg-[#22C55E] hover:bg-green-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <span>Selesaikan Tiket</span>
                  </button>
                ) : (
                  <div className="w-full py-2 bg-green-50 border border-green-200 text-green-705 rounded-lg text-center text-xs font-extrabold flex items-center justify-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Tiket Selesai</span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-6">Tidak ada tiket aktif terpilih.</p>
          )}
        </div>
      </div>

      {/* NEW TICKET MODAL */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="px-5 py-4 bg-[#1E3A5F] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Tambah Tiket Customer Service</h3>
              <button 
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-white hover:text-gray-250 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Kamar</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 104"
                  value={newRoomNum}
                  onChange={(e) => setNewRoomNum(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Permintaan / Keluhan Tamu</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: AC kamar bocor air, minta bantal tambahan..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Prioritas</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                >
                  <option value="Low">Low (Fasilitas Ekstra)</option>
                  <option value="Medium">Medium (Permintaan Standar)</option>
                  <option value="Critical">Critical (Kerusakan Teknis/Komplain)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Simpan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
