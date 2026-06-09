import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  RotateCw, 
  Plus, 
  User, 
  Check, 
  Brush, 
  Wrench,
  CheckCircle,
  Layers
} from 'lucide-react';
import type { Room, CheckInGuest, CheckOutGuest } from '../types';

interface RoomConsoleProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  checkins: CheckInGuest[];
  checkouts: CheckOutGuest[];
  setActiveTab: (tab: any) => void;
}

export default function RoomConsole({
  rooms,
  setRooms,
  checkins,
  checkouts,
  setActiveTab
}: RoomConsoleProps) {
  // Filters state
  const [searchNumber, setSearchNumber] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  
  // Interactive editing state
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // Live status update ticker state
  const [lastUpdated, setLastUpdated] = useState('2s');

  const handleRefresh = () => {
    setLastUpdated('0s');
    setTimeout(() => setLastUpdated('1s'), 1000);
  };

  // Helper stats
  const totalRoomsCount = rooms.length;
  const vacantCleanCount = rooms.filter(r => r.status === 'available').length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const vacantDirtyCount = rooms.filter(r => r.status === 'dirty').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  const occupancyRate = Math.round((occupiedCount / totalRoomsCount) * 100);

  const checkinsToday = checkins.length;
  const checkoutsToday = checkouts.length;

  // Status mapping to Indonesian term for display
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'VACANT CLEAN';
      case 'occupied': return 'OCCUPIED';
      case 'dirty': return 'VACANT DIRTY';
      case 'maintenance': return 'MAINTENANCE';
      default: return '';
    }
  };

  // Status style classes matching photo colors
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30';
      case 'occupied':
        return 'text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/30';
      case 'dirty':
        return 'text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30';
      case 'maintenance':
        return 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30';
      default:
        return '';
    }
  };

  const getCardBorderClass = (status: string, isEditing: boolean) => {
    if (isEditing) return 'border-[#3B82F6] ring-2 ring-[#3B82F6]/20 bg-blue-50/30';
    switch (status) {
      case 'available': return 'border-green-200 hover:border-[#22C55E]/50 bg-green-50/40';
      case 'occupied': return 'border-blue-200 hover:border-[#3B82F6]/50 bg-blue-50/40';
      case 'dirty': return 'border-orange-200 hover:border-[#F97316]/50 bg-orange-50/40';
      case 'maintenance': return 'border-red-200 hover:border-[#EF4444]/50 bg-red-50/40';
      default: return 'border-gray-200 bg-white';
    }
  };

  // Update room status
  const updateRoomStatus = (roomId: number, status: Room['status']) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        let guestName = r.guestName;
        if (status !== 'occupied') guestName = undefined; // clear guest name if no longer occupied
        return { ...r, status, guestName };
      }
      return r;
    }));
    setEditingRoomId(null);
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = searchNumber ? room.id.toString().includes(searchNumber.trim()) : true;
    const matchesFloor = selectedFloor !== 'All' ? room.floor.toString() === selectedFloor : true;
    const matchesType = selectedType !== 'All' ? room.type.toLowerCase().includes(selectedType.toLowerCase()) : true;
    
    let matchesStatus = true;
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Vacant Clean') matchesStatus = room.status === 'available';
      else if (selectedStatus === 'Occupied') matchesStatus = room.status === 'occupied';
      else if (selectedStatus === 'Vacant Dirty') matchesStatus = room.status === 'dirty';
      else if (selectedStatus === 'Maintenance') matchesStatus = room.status === 'maintenance';
    }

    return matchesSearch && matchesFloor && matchesType && matchesStatus;
  });

  // Group filtered rooms by floor
  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl border border-gray-200 shadow-3xs font-sans text-left">
      
      {/* HEADER SECTION (Operations Console) */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1E3A5F] flex items-center space-x-2">
            <Layers className="w-5.5 h-5.5 text-blue-600 shrink-0" />
            <span>Room Operations Console</span>
          </h2>
          <p className="text-[11px] font-semibold text-gray-500 mt-1">
            SMA PERHOTELAN - 12 Floors - 120 Rooms Total
          </p>
        </div>

        {/* Filters and Search controls matching the photo layout */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input (Room number only) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Room number..."
              className="pl-9 pr-3 py-1.5 w-36 bg-white border border-gray-300 rounded-lg text-xs placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
            />
          </div>

          {/* Dropdown: Floor */}
          <div className="relative">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Floors</option>
              {floors.map(f => (
                <option key={f} value={f.toString()}>Lantai {f}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Dropdown: Type */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Standard">Standard Room</option>
              <option value="Deluxe">Deluxe Room</option>
              <option value="Suite">Suite Room</option>
              <option value="Presidential Suite">Presidential Suite</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Dropdown: Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Vacant Clean">Vacant Clean</option>
              <option value="Occupied">Occupied</option>
              <option value="Vacant Dirty">Vacant Dirty</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* New Booking Button */}
          <button
            onClick={() => setActiveTab('reservation')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* LIVE STATUS SUMMARY BAR */}
      <div className="flex flex-wrap items-center justify-between py-3 px-4 bg-gray-50/80 border-b border-gray-200 gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mr-1">LIVE STATUS</span>
          
          <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-full font-bold text-gray-600 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
            <span>{totalRoomsCount} Total Rooms</span>
          </span>

          <span className="px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full font-bold text-[#22C55E] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
            <span>{vacantCleanCount} Vacant Clean</span>
          </span>

          <span className="px-2.5 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full font-bold text-[#3B82F6] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></span>
            <span>{occupiedCount} Occupied</span>
          </span>

          <span className="px-2.5 py-1 bg-[#F97316]/10 border border-[#F97316]/20 rounded-full font-bold text-[#F97316] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full"></span>
            <span>{vacantDirtyCount} Vacant Dirty</span>
          </span>

          <span className="px-2.5 py-1 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-full font-bold text-[#EF4444] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
            <span>{maintenanceCount} Maintenance</span>
          </span>
        </div>

        <div className="flex items-center space-x-5 text-gray-500 font-semibold text-[11px]">
          <span>Occupancy <strong className="text-gray-800 font-bold">{occupancyRate}%</strong></span>
          <span>Check-ins Today <strong className="text-gray-800 font-bold">{checkinsToday}</strong></span>
          <span>Check-outs Today <strong className="text-gray-800 font-bold">{checkoutsToday}</strong></span>
          <span className="text-gray-300 font-normal">|</span>
          <span className="flex items-center text-[#22C55E] space-x-1 font-bold">
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-ping"></span>
            <span>Live - Updated {lastUpdated} ago</span>
          </span>
        </div>
      </div>

      {/* ROOMS GRID BY FLOOR */}
      <div className="mt-6 space-y-8">
        {floors
          .filter(floorNum => selectedFloor === 'All' ? true : floorNum.toString() === selectedFloor)
          .map(floorNum => {
            const floorRooms = filteredRooms.filter(r => r.floor === floorNum);
            
            // Skip displaying floor if no rooms match filters
            if (floorRooms.length === 0) return null;

            return (
              <div key={floorNum} className="space-y-3">
                {/* Floor Title and Separator */}
                <div className="flex items-center space-x-3">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest">
                    Lantai {floorNum}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Grid of rooms on this floor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {floorRooms.map(room => {
                    const isEditing = editingRoomId === room.id;
                    const isOccupied = room.status === 'occupied';

                    return (
                      <div key={room.id} className="relative">
                        {/* Room Card container */}
                        <div
                          onClick={() => setEditingRoomId(isEditing ? null : room.id)}
                          className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[105px] select-none text-left relative overflow-hidden group shadow-3xs ${getCardBorderClass(room.status, isEditing)}`}
                        >
                          {/* Card Top: Number and Status Icon */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold text-gray-800 tracking-wide">{room.id}</span>
                            <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                              {room.status === 'available' && <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]/80" />}
                              {room.status === 'occupied' && <User className="w-3.5 h-3.5 text-[#3B82F6]/80" />}
                              {room.status === 'dirty' && <Brush className="w-3.5 h-3.5 text-[#F97316]/80" />}
                              {room.status === 'maintenance' && <Wrench className="w-3.5 h-3.5 text-[#EF4444]/80" />}
                            </span>
                          </div>

                          {/* Card Middle: Type and Status Badge */}
                          <div className="mt-1">
                            <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wide leading-none">
                              {room.type}
                            </div>
                            <div className="mt-2.5">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider leading-none ${getStatusBadgeClass(room.status)}`}>
                                {getStatusText(room.status)}
                              </span>
                            </div>
                          </div>

                          {/* Card Bottom: Guest Name if occupied, else empty space */}
                          <div className="mt-1.5 h-3">
                            {isOccupied && room.guestName ? (
                              <p className="text-[9px] font-bold text-gray-700 truncate leading-none">
                                {room.guestName}
                              </p>
                            ) : (
                              <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest leading-none">
                                Vacant
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Inline Status Changer Popover */}
                        {isEditing && (
                          <div className="absolute top-[110px] left-0 right-0 bg-white border border-gray-200 p-2 rounded-xl shadow-xl z-30 space-y-1 text-xs text-left">
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100 text-center">
                              Ubah Status Kamar {room.id}
                            </div>
                            
                            <button
                              onClick={() => updateRoomStatus(room.id, 'available')}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-gray-700 hover:bg-[#22C55E]/10 hover:text-[#22C55E] font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                                <span>Set Available (Clean)</span>
                              </span>
                              {room.status === 'available' && <Check className="w-3 h-3 text-[#22C55E]" />}
                            </button>

                            <button
                              onClick={() => {
                                // For simulation, auto fill guest name if set to occupied
                                setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: 'occupied', guestName: r.guestName || 'Tamu Baru Simulasi' } : r));
                                setEditingRoomId(null);
                              }}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-gray-700 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full" />
                                <span>Set Occupied (Terisi)</span>
                              </span>
                              {room.status === 'occupied' && <Check className="w-3 h-3 text-[#3B82F6]" />}
                            </button>

                            <button
                              onClick={() => updateRoomStatus(room.id, 'dirty')}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-gray-700 hover:bg-[#F97316]/10 hover:text-[#F97316] font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full" />
                                <span>Set Dirty (Kotor)</span>
                              </span>
                              {room.status === 'dirty' && <Check className="w-3 h-3 text-[#F97316]" />}
                            </button>

                            <button
                              onClick={() => updateRoomStatus(room.id, 'maintenance')}
                              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-gray-700 hover:bg-[#EF4444]/10 hover:text-[#EF4444] font-semibold text-[10px] transition-colors cursor-pointer"
                            >
                              <span className="flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
                                <span>Set Maintenance (Rusak)</span>
                              </span>
                              {room.status === 'maintenance' && <Check className="w-3 h-3 text-[#EF4444]" />}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

    </div>
  );
}
