import { useState } from 'react';
import { 
  Play, 
  Square, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  User as UserIcon, 
  Calendar, 
  Layers, 
  HelpCircle
} from 'lucide-react';
import type { Room, User } from '../../types';

interface HousekeepingDashboardProps {
  rooms: Room[];
  handleCleanRoomAction: (roomNum: number) => void;
  loggedInUser: User | null;
  setActiveTab: (tab: any) => void;
}

export interface HousekeepingTask {
  roomNumber: string;
  roomType: string;
  floor: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  lastUpdated: string;
  assignmentTime: string;
  startTime?: string;
  completionTime?: string;
  guestName: string;
  checkoutDate: string;
  specialRequests: string;
  cleaningNotes: string;
  maintenanceNotes: string;
}

export interface MaintenanceReportItem {
  roomNumber: string;
  issueDescription: string;
  reportedAt: string;
  status: 'Pending' | 'In Review' | 'Resolved';
}

export default function HousekeepingDashboard({ 
  rooms: _rooms, 
  handleCleanRoomAction, 
  loggedInUser 
}: HousekeepingDashboardProps) {
  
  const staffName = loggedInUser?.name || 'Agus Saputra';
  const staffRole = loggedInUser?.role || 'Housekeeping Supervisor';
  const currentDate = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // 1. Shift working session state
  const [isWorking, setIsWorking] = useState<boolean>(false);

  // 2. Personal Housekeeping tasks list state
  const [tasks, setTasks] = useState<HousekeepingTask[]>([
    { 
      roomNumber: '101', 
      roomType: 'Standard Room', 
      floor: '1', 
      status: 'Assigned', 
      lastUpdated: '08:00',
      assignmentTime: '08:00',
      guestName: 'Budi Santoso', 
      checkoutDate: '12 Juni 2026',
      specialRequests: 'Bantal hypoallergenic ekstra.',
      cleaningNotes: '',
      maintenanceNotes: ''
    },
    { 
      roomNumber: '204', 
      roomType: 'Deluxe Room', 
      floor: '2', 
      status: 'In Progress', 
      lastUpdated: '09:15',
      assignmentTime: '08:00',
      startTime: '09:00',
      guestName: 'Siti Rahma', 
      checkoutDate: '12 Juni 2026',
      specialRequests: 'Sediakan teh kamomil di kamar.',
      cleaningNotes: 'Sedang mengepel lantai kamar mandi.',
      maintenanceNotes: ''
    },
    { 
      roomNumber: '302', 
      roomType: 'Suite Room', 
      floor: '3', 
      status: 'Completed', 
      lastUpdated: '10:00',
      assignmentTime: '08:00',
      startTime: '09:15',
      completionTime: '10:00',
      guestName: 'Jane Doe', 
      checkoutDate: '13 Juni 2026',
      specialRequests: 'Kamar bebas asap rokok (Non-smoking room).',
      cleaningNotes: 'Kamar dibersihkan sepenuhnya, handuk diganti.',
      maintenanceNotes: ''
    },
    { 
      roomNumber: '105', 
      roomType: 'Standard Room', 
      floor: '1', 
      status: 'Assigned', 
      lastUpdated: '10:30',
      assignmentTime: '10:30',
      guestName: 'John Smith', 
      checkoutDate: '12 Juni 2026',
      specialRequests: 'Check-out lambat diminta.',
      cleaningNotes: '',
      maintenanceNotes: ''
    }
  ]);

  // 3. Maintenance reports list state
  const [maintenanceReports, setMaintenanceReports] = useState<MaintenanceReportItem[]>([
    { roomNumber: '102', issueDescription: 'AC bocor air menetes deras', reportedAt: '12 Jun, 08:45', status: 'Pending' },
    { roomNumber: '305', issueDescription: 'Lampu utama kamar mandi mati', reportedAt: '12 Jun, 09:30', status: 'In Review' }
  ]);

  // 4. Currently selected room detail sidebar state
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('204');
  const selectedTask = tasks.find(t => t.roomNumber === selectedRoomNumber);

  // Form states for inline editing/modal inputs
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteType, setNoteType] = useState<'cleaning' | 'maintenance'>('cleaning');
  const [noteValue, setNoteValue] = useState('');

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintDesc, setMaintDesc] = useState('');

  // 5. Actions execution guards
  const checkShiftActive = () => {
    if (!isWorking) {
      alert('Sesi Kerja Belum Aktif!\n\nHarap klik tombol "START WORKING" di header terlebih dahulu sebelum memulai tugas pembersihan.');
      return false;
    }
    return true;
  };

  // Start Cleaning action
  const handleStartCleaning = (roomNum: string) => {
    if (!checkShiftActive()) return;

    setTasks(prev => prev.map(t => {
      if (t.roomNumber === roomNum && t.status === 'Assigned') {
        const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return {
          ...t,
          status: 'In Progress',
          startTime: nowStr,
          lastUpdated: nowStr
        };
      }
      return t;
    }));
  };

  // Mark Room Clean action
  const handleMarkClean = (roomNum: string) => {
    if (!checkShiftActive()) return;

    setTasks(prev => prev.map(t => {
      if (t.roomNumber === roomNum && t.status !== 'Completed') {
        const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        // Notify parent state to change room status to 'available'
        handleCleanRoomAction(parseInt(roomNum));

        return {
          ...t,
          status: 'Completed',
          completionTime: nowStr,
          lastUpdated: nowStr
        };
      }
      return t;
    }));
  };

  // Open note modal
  const openNoteModal = (type: 'cleaning' | 'maintenance', roomNum: string) => {
    if (!checkShiftActive()) return;
    setSelectedRoomNumber(roomNum);
    setNoteType(type);
    
    const currentTask = tasks.find(t => t.roomNumber === roomNum);
    setNoteValue(type === 'cleaning' ? currentTask?.cleaningNotes || '' : currentTask?.maintenanceNotes || '');
    setIsNoteModalOpen(true);
  };

  // Save note handler
  const handleSaveNote = () => {
    setTasks(prev => prev.map(t => {
      if (t.roomNumber === selectedRoomNumber) {
        return {
          ...t,
          cleaningNotes: noteType === 'cleaning' ? noteValue : t.cleaningNotes,
          maintenanceNotes: noteType === 'maintenance' ? noteValue : t.maintenanceNotes
        };
      }
      return t;
    }));
    setIsNoteModalOpen(false);
  };

  // Open maintenance modal
  const openMaintenanceModal = (roomNum: string) => {
    if (!checkShiftActive()) return;
    setSelectedRoomNumber(roomNum);
    setMaintDesc('');
    setIsMaintenanceModalOpen(true);
  };

  // Save maintenance report handler
  const handleSaveMaintenanceReport = () => {
    if (!maintDesc.trim()) return;

    const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ', ' + 
                   new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Add to maintenance reports list
    const newReport: MaintenanceReportItem = {
      roomNumber: selectedRoomNumber,
      issueDescription: maintDesc,
      reportedAt: nowStr,
      status: 'Pending'
    };
    
    setMaintenanceReports(prev => [newReport, ...prev]);

    // Also update task status if needed
    setTasks(prev => prev.map(t => {
      if (t.roomNumber === selectedRoomNumber) {
        return {
          ...t,
          maintenanceNotes: maintDesc,
          lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    }));

    setIsMaintenanceModalOpen(false);
    alert(`Kerusakan di kamar ${selectedRoomNumber} berhasil dilaporkan ke Teknisi.`);
  };

  // Counters calculations
  const assignedCount = tasks.filter(t => t.status === 'Assigned').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const maintenanceCount = maintenanceReports.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      
      {/* MAIN WORKSPACE VIEW (9 COLS) */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* HEADER SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#1E3A5F]">Personal Housekeeping Workspace</h2>
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
                <span>Status: {isWorking ? 'Active Bekerja' : 'Offline'}</span>
              </span>
            </div>
          </div>

          {/* Work Session Controls */}
          <div>
            {!isWorking ? (
              <button
                onClick={() => setIsWorking(true)}
                className="w-full md:w-auto px-5 py-3 bg-[#22C55E] hover:bg-green-600 text-white text-xs font-black rounded-xl flex items-center justify-center space-x-2 shadow-sm cursor-pointer transition-all active:scale-97"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START WORKING SESSION</span>
              </button>
            ) : (
              <button
                onClick={() => setIsWorking(false)}
                className="w-full md:w-auto px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl flex items-center justify-center space-x-2 shadow-sm cursor-pointer transition-all active:scale-97"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>STOP WORKING SESSION</span>
              </button>
            )}
          </div>
        </div>

        {/* SUMMARY CARDS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Assigned tasks */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Assigned Tasks</p>
              <h3 className="text-2xl font-black text-orange-700 mt-1">{assignedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-550/10 flex items-center justify-center text-orange-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* In progress tasks */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">In Progress Tasks</p>
              <h3 className="text-2xl font-black text-blue-700 mt-1">{inProgressCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-550/10 flex items-center justify-center text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Completed tasks */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">Completed Tasks</p>
              <h3 className="text-2xl font-black text-[#22C55E] mt-1">{completedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-550/10 flex items-center justify-center text-[#22C55E]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Maintenance reports */}
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-3xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Maintenance Reports</p>
              <h3 className="text-2xl font-black text-red-750 mt-1">{maintenanceCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* MY ASSIGNED TASKS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
          <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-2">
            <span>My Assigned Tasks</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-250 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-3 px-4">Room Number</th>
                  <th className="py-3 px-4">Room Type</th>
                  <th className="py-3 px-4">Floor</th>
                  <th className="py-3 px-4">Assignment Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const isSelected = task.roomNumber === selectedRoomNumber;
                  return (
                    <tr 
                      key={task.roomNumber}
                      onClick={() => setSelectedRoomNumber(task.roomNumber)}
                      className={`border-b border-gray-150 hover:bg-gray-50/70 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/20 font-semibold border-l-4 border-l-[#1E3A5F]' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-extrabold text-[#1E3A5F]">Room {task.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-700">{task.roomType}</td>
                      <td className="py-3 px-4 text-gray-500">Floor {task.floor}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          task.status === 'Completed'
                            ? 'bg-green-50 text-[#22C55E] border-green-200'
                            : task.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${
                            task.status === 'Completed' ? 'bg-[#22C55E]' : task.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                          }`} />
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-semibold">{task.lastUpdated}</td>
                      <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'Assigned' && (
                          <button
                            onClick={() => handleStartCleaning(task.roomNumber)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 rounded text-[10px] cursor-pointer"
                          >
                            Start Cleaning
                          </button>
                        )}
                        {task.status === 'In Progress' && (
                          <button
                            onClick={() => handleMarkClean(task.roomNumber)}
                            className="px-2 py-1 bg-green-50 hover:bg-green-100 text-[#22C55E] font-bold border border-green-200 rounded text-[10px] cursor-pointer"
                          >
                            Mark Clean
                          </button>
                        )}
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => openMaintenanceModal(task.roomNumber)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 rounded text-[10px] cursor-pointer"
                            title="Laporkan Kerusakan"
                          >
                            Maint.
                          </button>
                        )}
                        {task.status === 'Completed' && (
                          <span className="text-[#22C55E] font-bold text-[10px]">✓ Ready</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROOM STATUS OVERVIEW CARDS */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
          <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">Room Status Overview</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tasks.map(task => {
              const isSelected = task.roomNumber === selectedRoomNumber;
              return (
                <div 
                  key={task.roomNumber}
                  onClick={() => setSelectedRoomNumber(task.roomNumber)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-[#1E3A5F] bg-blue-50/15 shadow-sm scale-102' 
                      : task.status === 'Completed'
                      ? 'border-green-200 bg-green-50/10 hover:border-green-400'
                      : task.status === 'In Progress'
                      ? 'border-blue-200 bg-blue-50/10 hover:border-blue-400'
                      : 'border-orange-200 bg-orange-50/10 hover:border-orange-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-extrabold text-[#1E3A5F]">Room {task.roomNumber}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      task.status === 'Completed' ? 'bg-[#22C55E]' : task.status === 'In Progress' ? 'bg-blue-550' : 'bg-orange-550'
                    }`} />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{task.roomType}</p>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400 font-bold">Lantai {task.floor}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wide ${
                      task.status === 'Completed' ? 'text-[#22C55E]' : task.status === 'In Progress' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TWO BOTTOM COLUMNS (HISTORY & MAINTENANCE) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* RECENT CLEANING HISTORY */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">Recent Cleaning History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-450 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Start</th>
                    <th className="py-2.5 px-3">Complete</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.filter(t => t.status === 'Completed').map(task => (
                    <tr key={task.roomNumber} className="border-b border-gray-100 font-medium text-gray-650">
                      <td className="py-2.5 px-3 font-extrabold text-[#1E3A5F]">Room {task.roomNumber}</td>
                      <td className="py-2.5 px-3 text-[10px]">12 Jun 2026</td>
                      <td className="py-2.5 px-3 font-mono text-[10px]">{task.startTime || '08:15'}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px]">{task.completionTime || '09:00'}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 bg-green-50 text-[#22C55E] border border-green-200 text-[8px] font-black rounded uppercase">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tasks.filter(t => t.status === 'Completed').length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400 italic">Belum ada pembersihan diselesaikan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MAINTENANCE REPORTS */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-4">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">Maintenance Reports</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-450 font-bold uppercase text-[9px] tracking-wider">
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Issue Description</th>
                    <th className="py-2.5 px-3">Reported At</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceReports.map((rep, idx) => (
                    <tr key={idx} className="border-b border-gray-100 text-gray-650">
                      <td className="py-2.5 px-3 font-extrabold text-red-600">Room {rep.roomNumber}</td>
                      <td className="py-2.5 px-3 font-medium truncate max-w-[120px]" title={rep.issueDescription}>
                        {rep.issueDescription}
                      </td>
                      <td className="py-2.5 px-3 text-[10px] font-semibold text-gray-450">{rep.reportedAt}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider ${
                          rep.status === 'Pending'
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : rep.status === 'In Review'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-green-50 text-[#22C55E] border-green-200'
                        }`}>
                          {rep.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT ROOM DETAIL SIDEBAR (3 COLS) */}
      <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 shadow-3xs space-y-5">
        <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider pb-2 border-b border-gray-200">
          Room Detail Pane
        </h3>

        {selectedTask ? (
          <div className="space-y-5">
            
            {/* Room Info */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Room Information</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-bold">Room Number</span>
                  <span className="text-xs font-black text-[#1E3A5F]">Room {selectedTask.roomNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-bold">Room Type</span>
                  <span className="text-[11px] text-gray-700 font-bold">{selectedTask.roomType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-bold">Floor</span>
                  <span className="text-[11px] text-gray-700 font-bold">Lantai {selectedTask.floor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-bold">Task Status</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black border uppercase ${
                    selectedTask.status === 'Completed'
                      ? 'bg-green-50 text-[#22C55E] border-green-200'
                      : selectedTask.status === 'In Progress'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {selectedTask.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Assignment Information</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-[11px] font-semibold text-gray-650">
                <div className="flex justify-between">
                  <span>Assignment Time</span>
                  <span className="font-mono">{selectedTask.assignmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning Start Time</span>
                  <span className="font-mono">{selectedTask.startTime || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Time</span>
                  <span className="font-mono">{selectedTask.completionTime || '-'}</span>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Guest Information</h4>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-[11px] font-semibold text-gray-650">
                <div className="flex justify-between">
                  <span>Guest Name</span>
                  <span className="font-bold text-gray-800">{selectedTask.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-Out Date</span>
                  <span className="font-bold text-gray-800">{selectedTask.checkoutDate}</span>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Notes & Requests</h4>
              <div className="space-y-2 text-[11px] font-semibold text-gray-650">
                
                {/* Special Request */}
                <div className="p-2.5 bg-yellow-50/50 border border-yellow-200 rounded-lg">
                  <span className="text-[9px] font-extrabold text-yellow-700 uppercase tracking-wide block mb-0.5">⭐ Special Request</span>
                  <p className="text-gray-700 text-xs italic">
                    {selectedTask.specialRequests || 'Tidak ada permintaan khusus.'}
                  </p>
                </div>

                {/* Cleaning Notes */}
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase">Cleaning Note</span>
                    {selectedTask.status !== 'Completed' && (
                      <button 
                        onClick={() => openNoteModal('cleaning', selectedTask.roomNumber)}
                        className="text-[9px] text-[#1E3A5F] font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 italic">
                    {selectedTask.cleaningNotes || 'Belum ada catatan pembersihan.'}
                  </p>
                </div>

                {/* Maintenance Notes */}
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-extrabold text-red-500 uppercase">Maintenance Note</span>
                    {selectedTask.status !== 'Completed' && (
                      <button 
                        onClick={() => openNoteModal('maintenance', selectedTask.roomNumber)}
                        className="text-[9px] text-red-600 font-bold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 italic">
                    {selectedTask.maintenanceNotes || 'Tidak ada masalah dilaporkan.'}
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-2.5 border-t border-gray-200 pt-4">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Quick Actions</h4>
              
              <div className="grid grid-cols-2 gap-2">
                {selectedTask.status === 'Assigned' ? (
                  <button
                    onClick={() => handleStartCleaning(selectedTask.roomNumber)}
                    className="col-span-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Cleaning</span>
                  </button>
                ) : selectedTask.status === 'In Progress' ? (
                  <button
                    onClick={() => handleMarkClean(selectedTask.roomNumber)}
                    className="col-span-2 py-2.5 bg-[#22C55E] hover:bg-green-600 text-white font-extrabold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-3xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Room Clean</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="col-span-2 py-2.5 bg-green-50 border border-green-200 text-[#22C55E] font-extrabold rounded-lg text-xs flex items-center justify-center space-x-1.5 cursor-not-allowed"
                  >
                    <span>✓ Room Clean & Ready</span>
                  </button>
                )}

                {selectedTask.status !== 'Completed' && (
                  <>
                    <button
                      onClick={() => openMaintenanceModal(selectedTask.roomNumber)}
                      className="py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold rounded-lg text-[11px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Report Maint.</span>
                    </button>
                    <button
                      onClick={() => openNoteModal('cleaning', selectedTask.roomNumber)}
                      className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-extrabold rounded-lg text-[11px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Add Note</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs font-bold">No Room Selected</p>
            <p className="text-[10px]">Silakan klik baris tabel kamar atau visual card untuk mengelola tugas.</p>
          </div>
        )}

      </div>

      {/* NOTE EDIT MODAL */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full p-6 text-left relative">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider mb-3">
              {noteType === 'cleaning' ? 'Tambah Catatan Pembersihan' : 'Catatan Kerusakan (Maintenance)'} - Room {selectedRoomNumber}
            </h3>
            
            <textarea
              rows={4}
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Ketik catatan di sini..."
              className="w-full p-3 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 bg-white text-gray-800"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold rounded-lg text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAINTENANCE REPORT MODAL */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full p-6 text-left relative">
            <h3 className="text-sm font-black text-red-750 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Laporkan Kerusakan - Room {selectedRoomNumber}</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-3">
              Tindakan ini akan mengalihkan status kamar ke antrean perbaikan maintenance.
            </p>

            <textarea
              rows={4}
              value={maintDesc}
              onChange={(e) => setMaintDesc(e.target.value)}
              placeholder="Deskripsikan kerusakan (misal: Lampu koridor putus, gagang pintu longgar)..."
              className="w-full p-3 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-red-500 mb-4 bg-white text-gray-800"
              required
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsMaintenanceModalOpen(false)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold rounded-lg text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMaintenanceReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
