import { useState } from 'react';
import { 
  Download, 
  Search, 
  Brush, 
  Clock, 
  Users, 
  Check 
} from 'lucide-react';
import type { Room } from '../../types';

interface HousekeepingProps {
  rooms: Room[];
  handleCleanRoomAction: (roomNum: number) => void;
}

export interface Housekeeper {
  id: string;
  name: string;
  status: 'Online';
  assignedRooms: string[];
}

export default function HousekeepingManagement({ rooms, handleCleanRoomAction }: HousekeepingProps) {
  const dirtyRooms = rooms.filter(r => r.status === 'dirty');
  
  const [staffList, setStaffList] = useState<Housekeeper[]>([
    { id: 'HK-01', name: 'Tom Reeves', status: 'Online', assignedRooms: ['101', '102'] },
    { id: 'HK-02', name: 'Sarah Connor', status: 'Online', assignedRooms: ['201'] },
    { id: 'HK-03', name: 'Mike Jenkins', status: 'Online', assignedRooms: [] },
  ]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('All');

  // Clean room handler: clean the room and remove it from housekeeper assignments
  const onCleanRoom = (roomId: number) => {
    handleCleanRoomAction(roomId);
    setStaffList(prev => prev.map(stf => ({
      ...stf,
      assignedRooms: stf.assignedRooms.filter(r => r !== roomId.toString())
    })));
  };

  // Assign staff handler
  const handleAssignStaff = (roomId: number, staffId: string) => {
    setStaffList(prev => prev.map(stf => {
      // Remove room from any other housekeeper
      let roomsList = stf.assignedRooms.filter(r => r !== roomId.toString());
      // Add room to selected housekeeper
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Manajemen Pembersihan Kamar (Housekeeping)</h2>
          <p className="text-xs text-gray-500 mt-1">SMA PERHOTELAN • Monitor Beban Kerja Staf & Antrean Kamar Kotor</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors shadow-3xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 py-3 border-b border-gray-200 text-xs font-bold text-gray-755 font-sans">
        <div className="flex items-center space-x-2">
          <span>Cari Kamar:</span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nomor kamar..."
              className="pl-8 pr-2.5 py-1.5 w-40 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span>Tipe Kamar:</span>
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 cursor-pointer"
          >
            <option value="All">Semua Tipe</option>
            <option value="Standard Room">Standard Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Suite Room">Suite Room</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span>Status Penugasan:</span>
          <select
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            className="p-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 cursor-pointer"
          >
            <option value="All">Semua Status</option>
            <option value="Assigned">Sedang Dibersihkan (Assigned)</option>
            <option value="Unassigned">Belum Ditugaskan (Unassigned)</option>
          </select>
        </div>

        {(searchQuery || roomTypeFilter !== 'All' || assignmentFilter !== 'All') && (
          <button
            onClick={() => { setSearchQuery(''); setRoomTypeFilter('All'); setAssignmentFilter('All'); }}
            className="text-red-500 hover:text-red-700 text-xs font-extrabold cursor-pointer ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {/* Vacant Dirty Card */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Vacant Dirty (Kamar Kotor)</p>
            <h3 className="text-2xl font-black text-red-750 mt-1">{dirtyRooms.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-100/50 flex items-center justify-center text-red-650">
            <Brush className="w-5 h-5" />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">In Progress (Sedang Dibersihkan)</p>
            <h3 className="text-2xl font-black text-blue-750 mt-1">{inProgressCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-650">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Staff on Duty Card */}
        <div className="p-4 rounded-xl border border-green-200 bg-green-50/20 flex items-center justify-between shadow-3xs">
          <div>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Staff on Duty (Staf Aktif)</p>
            <h3 className="text-2xl font-black text-green-750 mt-1">{staffList.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100/50 flex items-center justify-center text-green-650">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANE: ROOM CLEANING QUEUE */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-[#1E3A5F] uppercase tracking-wider">Antrean Kamar Kotor ({filteredDirtyRooms.length})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDirtyRooms.map(room => {
              const assignedStaffId = getAssignedStaffIdForRoom(room.id);
              return (
                <div key={room.id} className="p-4 rounded-xl border border-orange-200 bg-orange-50/10 flex flex-col justify-between space-y-3 shadow-3xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-extrabold text-[#1E3A5F]">Kamar {room.id}</p>
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
                        <option key={stf.id} value={stf.id}>{stf.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onCleanRoom(room.id)}
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
                <p className="text-sm font-extrabold text-gray-600">Tidak ada kamar cocok!</p>
                <p className="text-xs text-gray-400 mt-1">Silakan sesuaikan filter pencarian Anda.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: STAFF LOAD */}
        <div className="lg:col-span-4 bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Staff Load</h3>
            
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-full border bg-green-50 text-green-700 border-green-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
              Online
            </span>
          </div>

          <div className="space-y-3">
            {staffList.map(stf => (
              <div key={stf.id} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2.5 shadow-3xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 bg-[#1E3A5F] text-white font-extrabold rounded-full flex items-center justify-center text-xs">
                      {stf.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{stf.name}</p>
                      <p className="text-[9px] text-gray-400 font-semibold">{stf.id}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned rooms tags */}
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Kamar Ditugaskan ({stf.assignedRooms.length})
                  </span>
                  {stf.assignedRooms.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {stf.assignedRooms.map(rNum => (
                        <span key={rNum} className="px-2 py-0.5 bg-blue-50 text-[#1E3A5F] border border-blue-100 rounded text-[10px] font-bold">
                          Room {rNum}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Bebas Tugas (Idle)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
