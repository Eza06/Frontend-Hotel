import { useState } from 'react';
import { 
  Download, 
  Search, 
  Brush, 
  Clock, 
  Users, 
  Check, 
  Play, 
  Square, 
  History, 
  RotateCcw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { Room, User } from '../../types';

interface HousekeepingProps {
  rooms: Room[];
  handleCleanRoomAction: (roomNum: number) => void;
  loggedInUser?: User;
}

export interface Housekeeper {
  id: string;
  name: string;
  status: 'Working' | 'Offline';
  assignedRooms: string[];
}

export interface CleaningHistoryItem {
  id: string;
  roomNum: string;
  roomType: string;
  housekeeperName: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'Completed';
}

const INITIAL_HISTORY: CleaningHistoryItem[] = [
  { id: 'CL-901', roomNum: '103', roomType: 'Standard Room', housekeeperName: 'Tom Reeves', startTime: '08:15', endTime: '08:35', duration: '20 menit', status: 'Completed' },
  { id: 'CL-902', roomNum: '202', roomType: 'Deluxe Room', housekeeperName: 'Sarah Connor', startTime: '09:00', endTime: '09:25', duration: '25 menit', status: 'Completed' },
  { id: 'CL-903', roomNum: '305', roomType: 'Suite Room', housekeeperName: 'Mike Jenkins', startTime: '10:10', endTime: '10:45', duration: '35 menit', status: 'Completed' },
];

export default function HousekeepingManagement({ rooms, handleCleanRoomAction, loggedInUser }: HousekeepingProps) {
  const dirtyRooms = rooms.filter(r => r.status === 'dirty');
  const currentHKName = loggedInUser?.name || 'Agus Saputra';
  const currentHKId = 'HK-04';

  // State for Housekeepers list
  const [staffList, setStaffList] = useState<Housekeeper[]>([
    { id: 'HK-01', name: 'Tom Reeves', status: 'Working', assignedRooms: ['101', '102'] },
    { id: 'HK-02', name: 'Sarah Connor', status: 'Working', assignedRooms: ['204'] },
    { id: 'HK-03', name: 'Mike Jenkins', status: 'Offline', assignedRooms: [] },
    { id: 'HK-04', name: currentHKName, status: 'Offline', assignedRooms: [] },
  ]);

  // Working state for the currently logged in housekeeper (Agus Saputra / loggedInUser)
  const [isWorking, setIsWorking] = useState<boolean>(false);
  
  // Cleaning History State
  const [historyList, setHistoryList] = useState<CleaningHistoryItem[]>(INITIAL_HISTORY);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('All');

  // Start Working Handler
  const handleStartWorking = () => {
    setIsWorking(true);
    setStaffList(prev => prev.map(stf => {
      if (stf.id === currentHKId) {
        return { ...stf, status: 'Working' };
      }
      return stf;
    }));
    
    // Prompt to auto-distribute dirty rooms immediately
    if (dirtyRooms.length > 0) {
      const shouldDistribute = window.confirm(
        'Status Anda sekarang: AKTIF BEKERJA.\n\nApakah Anda ingin membagi rata antrean kamar kotor secara merata ke seluruh staf aktif sekarang?'
      );
      if (shouldDistribute) {
        distributeRoomsHelper(true);
      }
    }
  };

  // Stop Working Handler
  const handleStopWorking = () => {
    setIsWorking(false);
    setStaffList(prev => prev.map(stf => {
      if (stf.id === currentHKId) {
        // Remove Agus from working status and empty his assigned rooms
        return { ...stf, status: 'Offline', assignedRooms: [] };
      }
      return stf;
    }));
    alert('Status Anda sekarang: OFFLINE. Tugas pembersihan Anda telah dikembalikan ke antrean.');
  };

  // Re-distribute helper that takes into account current logged in user status
  const distributeRoomsHelper = (forceCurrentUserWorking: boolean) => {
    setStaffList(prev => {
      // Calculate active staff list using the updated status
      const updatedStaff = prev.map(stf => {
        if (stf.id === currentHKId) {
          return { ...stf, status: forceCurrentUserWorking ? 'Working' : stf.status };
        }
        return stf;
      });

      const activeStaff = updatedStaff.filter(s => s.status === 'Working');
      if (activeStaff.length === 0) return prev;

      // Reset all assignments for active staff to distribute fresh
      const resetStaff = updatedStaff.map(s => ({
        ...s,
        assignedRooms: [] as string[]
      }));

      // Distribute dirty rooms evenly
      dirtyRooms.forEach((room, idx) => {
        const staffIndex = idx % activeStaff.length;
        const targetStaffId = activeStaff[staffIndex].id;
        const staffObj = resetStaff.find(s => s.id === targetStaffId);
        if (staffObj) {
          staffObj.assignedRooms.push(room.id.toString());
        }
      });

      return resetStaff;
    });
  };

  // Manual Even Workload Distribution Trigger
  const handleEvenDistribution = () => {
    const activeStaffCount = staffList.filter(s => s.status === 'Working').length;
    if (activeStaffCount === 0) {
      alert('Tidak ada staf yang sedang aktif bekerja (Mulai Kerja). Harap aktifkan status kerja staf terlebih dahulu!');
      return;
    }

    distributeRoomsHelper(isWorking);
    alert(`Pembagian beban kerja berhasil! ${dirtyRooms.length} kamar kotor dibagi rata ke ${activeStaffCount} staf aktif.`);
  };

  // Clean room handler: clean the room, remove from assignment, and add to history
  const onCleanRoom = (roomId: number, roomType: string) => {
    // Determine which staff member cleaned the room
    const assignedStaff = staffList.find(stf => stf.assignedRooms.includes(roomId.toString())) || 
                          staffList.find(stf => stf.id === currentHKId);
    
    const staffName = assignedStaff ? assignedStaff.name : currentHKName;

    // Call global app state handler
    handleCleanRoomAction(roomId);

    // Remove room from housekeeper assignments
    setStaffList(prev => prev.map(stf => ({
      ...stf,
      assignedRooms: stf.assignedRooms.filter(r => r !== roomId.toString())
    })));

    // Add record to Cleaning History log
    const now = new Date();
    const endTimeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const startMinutes = now.getMinutes() - Math.floor(15 + Math.random() * 15);
    const startHour = now.getHours() - (startMinutes < 0 ? 1 : 0);
    const correctedMinutes = (startMinutes + 60) % 60;
    const startTimeStr = `${startHour.toString().padStart(2, '0')}:${correctedMinutes.toString().padStart(2, '0')}`;
    
    const newHistoryItem: CleaningHistoryItem = {
      id: `CL-${Math.floor(904 + Math.random() * 99)}`,
      roomNum: roomId.toString(),
      roomType: roomType,
      housekeeperName: staffName,
      startTime: startTimeStr,
      endTime: endTimeStr,
      duration: `${Math.floor(15 + Math.random() * 15)} menit`,
      status: 'Completed'
    };

    setHistoryList(prev => [newHistoryItem, ...prev]);
    alert(`Kamar ${roomId} berhasil dibersihkan dan status diubah menjadi AVAILABLE!`);
  };

  // Assign staff manually
  const handleAssignStaff = (roomId: number, staffId: string) => {
    setStaffList(prev => prev.map(stf => {
      let roomsList = stf.assignedRooms.filter(r => r !== roomId.toString());
      if (stf.id === staffId) {
        roomsList = [...roomsList, roomId.toString()];
      }
      return {
        ...stf,
        assignedRooms: roomsList
      };
    }));
  };

  // Find assigned staff for a room
  const getAssignedStaffIdForRoom = (roomId: number) => {
    const found = staffList.find(stf => stf.assignedRooms.includes(roomId.toString()));
    return found ? found.id : '';
  };

  // Filtered rooms logic
  const filteredDirtyRooms = rooms.filter(r => {
    if (r.status !== 'dirty') return false;
    
    const matchesSearch = r.id.toString().includes(searchQuery);
    const matchesType = roomTypeFilter === 'All' ? true : r.type === roomTypeFilter;
    
    const assignedStaffId = getAssignedStaffIdForRoom(r.id);
    const matchesAssignment = 
      assignmentFilter === 'All' ? true :
      assignmentFilter === 'Assigned' ? assignedStaffId !== '' :
      assignedStaffId === '';
      
    return matchesSearch && matchesType && matchesAssignment;
  });

  const inProgressCount = dirtyRooms.filter(r => getAssignedStaffIdForRoom(r.id) !== '').length;

  const handleExportCSV = () => {
    const headers = 'Room Number,Type,Status,Assigned Staff\n';
    const rows = dirtyRooms.map(room => {
      const staffName = staffList.find(stf => stf.assignedRooms.includes(room.id.toString()))?.name || 'Unassigned';
      return `${room.id},${room.type},Dirty,${staffName}`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `housekeeping_dirty_rooms_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HOUSEKEEPER PERSONAL DUTY BOARD */}
      <div className="p-6 bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F]/90 rounded-2xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-sky-500/30 text-sky-200 border border-sky-400/40 rounded text-[10px] font-bold tracking-wider uppercase">
              {loggedInUser?.role || 'Housekeeping Supervisor'}
            </span>
            <span className={`w-2 h-2 rounded-full ${isWorking ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          </div>
          <h2 className="text-xl font-black">{currentHKName} Command Dashboard</h2>
          <p className="text-xs text-blue-200">
            {isWorking 
              ? `Status: Aktif Bekerja • Ditugaskan menangani ${staffList.find(s => s.id === currentHKId)?.assignedRooms.length || 0} kamar kotor.` 
              : 'Status: Offline • Silakan tekan tombol Start Working untuk mulai menerima tugas pembersihan.'}
          </p>
        </div>

        {/* Start / Stop Working Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {!isWorking ? (
            <button
              onClick={handleStartWorking}
              className="flex-1 md:flex-initial px-5 py-3 bg-[#22C55E] hover:bg-green-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START WORKING</span>
            </button>
          ) : (
            <button
              onClick={handleStopWorking}
              className="flex-1 md:flex-initial px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>STOP WORKING</span>
            </button>
          )}

          <button
            onClick={handleEvenDistribution}
            className="flex-1 md:flex-initial px-5 py-3 bg-blue-500 hover:bg-blue-650 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-95"
            title="Bagi rata antrean kamar kotor ke seluruh staf aktif"
          >
            <RotateCcw className="w-4 h-4" />
            <span>BAGI RATA TUGAS</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Vacant Dirty Card */}
        <div className="p-4 rounded-xl border border-gray-250 bg-white flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Kamar Kotor (Dirty)</p>
            <h3 className="text-2xl font-black text-red-650 mt-1">{dirtyRooms.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <Brush className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="p-4 rounded-xl border border-gray-250 bg-white flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Sedang Dibersihkan</p>
            <h3 className="text-2xl font-black text-blue-750 mt-1">{inProgressCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* My Assigned Rooms */}
        <div className="p-4 rounded-xl border border-gray-250 bg-white flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Tugas Saya hari ini</p>
            <h3 className="text-2xl font-black text-purple-750 mt-1">
              {(staffList.find(s => s.id === currentHKId)?.assignedRooms.length || 0)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Staff Active Card */}
        <div className="p-4 rounded-xl border border-gray-250 bg-white flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Staf Sedang Bekerja</p>
            <h3 className="text-2xl font-black text-green-750 mt-1">
              {staffList.filter(s => s.status === 'Working').length} / {staffList.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-650">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE: ROOM CLEANING QUEUE */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-gray-200 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-black text-[#1E3A5F] uppercase tracking-wider">Antrean Kamar Kotor ({filteredDirtyRooms.length})</h3>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="pl-7 pr-2 py-1 w-24 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none"
                />
              </div>
              <select
                value={roomTypeFilter}
                onChange={(e) => setRoomTypeFilter(e.target.value)}
                className="p-1 bg-white border border-gray-300 rounded-lg text-[11px] font-bold text-gray-700 cursor-pointer"
              >
                <option value="All">Tipe Kamar</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Suite Room">Suite Room</option>
              </select>
              <select
                value={assignmentFilter}
                onChange={(e) => setAssignmentFilter(e.target.value)}
                className="p-1 bg-white border border-gray-300 rounded-lg text-[11px] font-bold text-gray-700 cursor-pointer"
              >
                <option value="All">Semua Penugasan</option>
                <option value="Assigned">Sedang Dibersihkan</option>
                <option value="Unassigned">Belum Ditugaskan</option>
              </select>
              <button
                onClick={handleExportCSV}
                className="p-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 text-xs"
                title="Ekspor CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDirtyRooms.map(room => {
              const assignedStaffId = getAssignedStaffIdForRoom(room.id);
              const isAssignedToMe = assignedStaffId === currentHKId;
              
              return (
                <div 
                  key={room.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                    isAssignedToMe 
                      ? 'border-purple-200 bg-purple-50/15 shadow-sm ring-1 ring-purple-100'
                      : 'border-orange-200 bg-orange-50/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <p className="text-sm font-extrabold text-[#1E3A5F]">Kamar {room.id}</p>
                        {isAssignedToMe && (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[8px] font-black rounded tracking-wider">TUGAS SAYA</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{room.type}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-100 border border-orange-200 text-orange-700 text-[9px] font-bold rounded">
                      DIRTY
                    </span>
                  </div>

                  {/* Assign Housekeeper Dropdown */}
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Tugaskan Staf</label>
                    <select
                      value={assignedStaffId}
                      onChange={(e) => handleAssignStaff(room.id, e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
                    >
                      <option value="">Belum Ditugaskan</option>
                      {staffList.map(stf => (
                        <option key={stf.id} value={stf.id}>
                          {stf.name} {stf.status === 'Offline' ? '(Offline)' : '(Aktif)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onCleanRoom(room.id, room.type)}
                      className="px-3 py-1.5 bg-[#22C55E] hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
                      title="Tandai Kamar Selesai Dibersihkan"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Selesai Bersih</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredDirtyRooms.length === 0 && (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Check className="w-10 h-10 text-[#22C55E] mx-auto mb-3" />
                <p className="text-sm font-extrabold text-gray-600">Tidak ada antrean kamar kotor!</p>
                <p className="text-xs text-gray-400 mt-1">Semua kamar dalam kondisi bersih & siap digunakan.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: STAFF STATUS & CLEANING HISTORY */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* STAFF LOAD STATUS CARD */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider">Beban Kerja Staf</h3>
              <span className="text-[10px] font-bold text-gray-400">Active Status</span>
            </div>

            <div className="space-y-3">
              {staffList.map(stf => {
                const isMe = stf.id === currentHKId;
                return (
                  <div 
                    key={stf.id} 
                    className={`p-3 border rounded-xl space-y-2 shadow-3xs transition-all ${
                      isMe 
                        ? 'border-purple-200 bg-purple-50/10' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white ${
                          isMe ? 'bg-purple-700' : 'bg-[#1E3A5F]'
                        }`}>
                          {stf.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-gray-800">
                            {stf.name} {isMe && '(Anda)'}
                          </p>
                          <p className="text-[9px] text-gray-400 font-semibold">{stf.id}</p>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                        stf.status === 'Working'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200'
                      }`}>
                        <span className={`w-1 h-1 rounded-full mr-1 ${
                          stf.status === 'Working' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        {stf.status === 'Working' ? 'AKTIF' : 'OFFLINE'}
                      </span>
                    </div>

                    {/* Assigned rooms tags */}
                    <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Tugas Pembersihan</span>
                      <span className="text-xs font-black text-[#1E3A5F]">
                        {stf.assignedRooms.length} Kamar
                      </span>
                    </div>

                    {stf.assignedRooms.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {stf.assignedRooms.map(rNum => (
                          <span key={rNum} className="px-2 py-0.5 bg-blue-50 text-[#1E3A5F] border border-blue-100 rounded text-[9px] font-bold">
                            Room {rNum}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLEANING HISTORY LOG CARD */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-xs font-black text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-1.5">
                <History className="w-3.5 h-3.5 text-gray-500" />
                <span>Cleaning History (Hari Ini)</span>
              </h3>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>

            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {historyList.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[#1E3A5F]">Room {item.roomNum}</span>
                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[8px] font-black rounded-full border border-green-200 uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="text-[10px] text-gray-600 font-semibold space-y-0.5">
                    <div className="flex justify-between">
                      <span>Tipe Kamar:</span>
                      <span className="text-gray-800 font-bold">{item.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Staf Pembersih:</span>
                      <span className="text-gray-800 font-bold">{item.housekeeperName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Waktu Kerja:</span>
                      <span className="font-mono text-gray-700">{item.startTime} - {item.endTime} ({item.duration})</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {historyList.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-6">Belum ada pembersihan selesai hari ini.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
