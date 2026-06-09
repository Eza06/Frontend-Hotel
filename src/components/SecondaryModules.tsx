import { useState } from 'react';
import { 
  UserCheck, 
  UserX, 
  Sparkles, 
  Check, 
  Plus,
  Search,
  Download,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  ShieldCheck,
  Edit2,
  CalendarDays,
  X,
  UserPlus
} from 'lucide-react';
import type { 
  Room, 
  CheckInGuest, 
  CheckOutGuest, 
  ServiceRequest, 
  FBOrder 
} from '../types';

// ==========================================
// 1. GUEST MANAGEMENT
// ==========================================
interface StayHistoryItem {
  room: string;
  nights: string;
  dates: string;
}

interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  address: string;
  nik: string;
  nationality: string;
  visits: number;
  status: 'Online' | 'Offline' | 'Blacklisted';
  stays: StayHistoryItem[];
}

const INITIAL_GUEST_PROFILES: GuestProfile[] = [
  {
    id: 'GST-00142',
    name: 'James Whitmore',
    phone: '+1 (555) 201-4832',
    email: 'j.whitmore@email.com',
    dob: 'Apr 14, 1979',
    address: '142 Oak Ave, Boston, MA',
    nik: '3273051404790001',
    nationality: 'US',
    visits: 8,
    status: 'Online',
    stays: [
      { room: 'Room 101 - Standard', nights: '4N', dates: 'Jun 8, 2024 ➔ Jun 12, 2024' },
      { room: 'Room 204 - Deluxe', nights: '3N', dates: 'Jan 15, 2024 ➔ Jan 18, 2024' },
      { room: 'Room 302 - Deluxe', nights: '4N', dates: 'Sep 3, 2023 ➔ Sep 7, 2023' }
    ]
  },
  {
    id: 'GST-00084',
    name: 'Priya Sharma',
    phone: '+91 98000 55410',
    email: 'priya.sharma@email.co.in',
    dob: 'Aug 22, 1985',
    address: '45 Ring Road, New Delhi, India',
    nik: '3273052208850002',
    nationality: 'IN',
    visits: 3,
    status: 'Offline',
    stays: [
      { room: 'Room 102 - Standard', nights: '2N', dates: 'Mar 12, 2024 ➔ Mar 14, 2024' },
      { room: 'Room 205 - Deluxe', nights: '1N', dates: 'Dec 5, 2023 ➔ Dec 6, 2023' }
    ]
  },
  {
    id: 'GST-00216',
    name: 'Amara Osei',
    phone: '+233 24 456 7890',
    email: 'amara.osei@email.com',
    dob: 'Nov 10, 1991',
    address: '12 High Street, Accra, Ghana',
    nik: '3273051011910003',
    nationality: 'GH',
    visits: 12,
    status: 'Online',
    stays: [
      { room: 'Room 404 - Suite', nights: '5N', dates: 'May 1, 2024 ➔ May 6, 2024' }
    ]
  },
  {
    id: 'GST-00301',
    name: 'Carlos Mendez',
    phone: '+52 55 1234 5678',
    email: 'c.mendez@email.mx',
    dob: 'Dec 5, 1982',
    address: 'Av. Reforma 100, Mexico City',
    nik: '3273050512820004',
    nationality: 'MX',
    visits: 5,
    status: 'Online',
    stays: [
      { room: 'Room 201 - Deluxe', nights: '3N', dates: 'Apr 10, 2024 ➔ Apr 13, 2024' }
    ]
  },
  {
    id: 'GST-00052',
    name: 'Yuki Tanaka',
    phone: '+81 3 4567 8901',
    email: 'yuki.tanaka@email.jp',
    dob: 'Jul 15, 1988',
    address: '3-2-1 Shibuya, Tokyo, Japan',
    nik: '3273051507880005',
    nationality: 'JP',
    visits: 9,
    status: 'Online',
    stays: [
      { room: 'Room 502 - Suite', nights: '4N', dates: 'Feb 20, 2024 ➔ Feb 24, 2024' }
    ]
  },
  {
    id: 'GST-00119',
    name: 'Robert Bell',
    phone: '+44 20 7946 0192',
    email: 'r.bell@email.co.uk',
    dob: 'Jan 30, 1975',
    address: '12 Baker St, London, UK',
    nik: '3273053001750006',
    nationality: 'UK',
    visits: 2,
    status: 'Offline',
    stays: [
      { room: 'Room 105 - Standard', nights: '3N', dates: 'Jul 4, 2024 ➔ Jul 7, 2024' }
    ]
  },
  {
    id: 'GST-00223',
    name: 'Michael Chen',
    phone: '+65 9123 4567',
    email: 'm.chen@email.sg',
    dob: 'Sep 18, 1990',
    address: '88 Orchard Rd, Singapore',
    nik: '3273051809900007',
    nationality: 'SG',
    visits: 14,
    status: 'Blacklisted',
    stays: [
      { room: 'Room 301 - Deluxe', nights: '2N', dates: 'Oct 12, 2023 ➔ Oct 14, 2023' }
    ]
  },
  {
    id: 'GST-00431',
    name: 'Fatima Al-Rashid',
    phone: '+971 50 123 4567',
    email: 'fatima.ar@email.ae',
    dob: 'May 4, 1993',
    address: 'Marina Heights, Dubai, UAE',
    nik: '3273050405930008',
    nationality: 'AE',
    visits: 6,
    status: 'Online',
    stays: [
      { room: 'Room 1201 - Presidential Suite', nights: '3N', dates: 'Dec 28, 2023 ➔ Dec 31, 2023' }
    ]
  }
];

export function GuestManagement() {
  const [guests, setGuests] = useState<GuestProfile[]>(INITIAL_GUEST_PROFILES);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('GST-00142');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Online' | 'Offline' | 'Blacklisted'>('All');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNik, setNewNik] = useState('');
  const [newNationality, setNewNationality] = useState('ID');

  const selectedGuest = guests.find(g => g.id === selectedGuestId) || guests[0];

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `GST-00${Math.floor(100 + Math.random() * 900)}`;
    const newProfile: GuestProfile = {
      id: newId,
      name: newName || 'Tamu Baru',
      phone: newPhone || '+62 812-3456-7890',
      email: newEmail || 'baru@email.com',
      dob: newDob || '1995-01-01',
      address: newAddress || 'Jl. Sudirman No. 1, Jakarta',
      nik: newNik || '3273050101950001',
      nationality: newNationality || 'ID',
      visits: 1,
      status: 'Online',
      stays: [{ room: 'Room 101 - Standard', nights: '1N', dates: 'Hari Ini' }]
    };
    setGuests(prev => [newProfile, ...prev]);
    setSelectedGuestId(newId);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    setGuests(prev => prev.map(g => {
      if (g.id === selectedGuestId) {
        return {
          ...g,
          name: newName || g.name,
          phone: newPhone || g.phone,
          email: newEmail || g.email,
          dob: newDob || g.dob,
          address: newAddress || g.address,
          nik: newNik || g.nik,
          nationality: newNationality || g.nationality
        };
      }
      return g;
    }));
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    if (!selectedGuest) return;
    setNewName(selectedGuest.name);
    setNewPhone(selectedGuest.phone);
    setNewEmail(selectedGuest.email);
    setNewDob(selectedGuest.dob);
    setNewAddress(selectedGuest.address);
    setNewNik(selectedGuest.nik);
    setNewNationality(selectedGuest.nationality);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewDob('');
    setNewAddress('');
    setNewNik('');
    setNewNationality('ID');
  };

  const handleExport = () => {
    alert('Database Profil Tamu berhasil diekspor ke CSV!');
  };

  const toggleBlacklist = (id: string) => {
    setGuests(prev => prev.map(g => {
      if (g.id === id) {
        const newStatus = g.status === 'Blacklisted' ? 'Online' : 'Blacklisted';
        return { ...g, status: newStatus };
      }
      return g;
    }));
  };

  // Filters logic
  const filteredGuests = guests.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery) ||
      g.nik.includes(searchQuery) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' ? true : g.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="guest-mgmt-wrapper bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Guest Management</h2>
          <p className="text-xs text-gray-500 mt-1">SMA PERHOTELAN • CRM Workspace • {guests.length} Profiles</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, ID, phone, email, NIK..."
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

          {/* Add Guest Button */}
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* 2. FILTERS ROW */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-blue-50 text-[#1E3A5F] border border-blue-200 shadow-3xs'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            All Guests <span className="ml-1 opacity-70">{guests.length}</span>
          </button>

          <button
            onClick={() => setStatusFilter('Online')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              statusFilter === 'Online'
                ? 'bg-green-50 text-green-700 border border-green-200 shadow-3xs'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span>
            <span>Online</span>
            <span className="opacity-70">{guests.filter(g => g.status === 'Online').length}</span>
          </button>

          <button
            onClick={() => setStatusFilter('Offline')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              statusFilter === 'Offline'
                ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-3xs'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full"></span>
            <span>Offline</span>
            <span className="opacity-70">{guests.filter(g => g.status === 'Offline').length}</span>
          </button>

          <button
            onClick={() => setStatusFilter('Blacklisted')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              statusFilter === 'Blacklisted'
                ? 'bg-red-50 text-red-700 border border-red-200 shadow-3xs'
                : 'text-gray-500 hover:bg-gray-50 border border-transparent'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></span>
            <span>Blacklisted</span>
            <span className="opacity-70">{guests.filter(g => g.status === 'Blacklisted').length}</span>
          </button>
        </div>
      </div>

      {/* 3. SPLIT PANE MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        
        {/* LEFT COLUMN: GUEST LIST TABLE */}
        <div className="lg:col-span-8 overflow-x-auto border border-gray-250 rounded-xl bg-white">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3 w-8">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-4 py-3">Guest ID</th>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">NIK (KTP)</th>
                <th className="px-4 py-3 text-center">Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-semibold text-gray-800">
              {filteredGuests.map(guest => {
                const isSelected = guest.id === selectedGuestId;
                return (
                  <tr 
                    key={guest.id} 
                    onClick={() => setSelectedGuestId(guest.id)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-550 text-[11px]">{guest.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2.5">
                        {/* Avatar */}
                        <div className="w-7 h-7 bg-[#1E3A5F] text-white font-extrabold rounded-full flex items-center justify-center text-[10px]">
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1E3A5F]">{guest.name}</p>
                          <span className="inline-flex items-center text-[9px] text-gray-400 font-bold">
                            🌐 {guest.nationality}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{guest.phone}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[140px]" title={guest.email}>
                      {guest.email}
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{guest.nik}</td>
                    <td className="px-4 py-3 text-center font-bold text-[#1E3A5F]">{guest.visits}</td>
                  </tr>
                );
              })}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400 font-bold">
                    Tidak ada data tamu yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT COLUMN: GUEST PROFILE DETAIL PANEL */}
        {selectedGuest && (
          <div className="lg:col-span-4 bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#1E3A5F] text-white text-base font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {selectedGuest.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1E3A5F]">{selectedGuest.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono tracking-wider">{selectedGuest.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuestId('')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                selectedGuest.status === 'Online' ? 'bg-green-50 text-green-700 border-green-200' :
                selectedGuest.status === 'Offline' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                <span className={`w-1 h-1 rounded-full mr-1 ${
                  selectedGuest.status === 'Online' ? 'bg-[#22C55E]' :
                  selectedGuest.status === 'Offline' ? 'bg-[#F97316]' :
                  'bg-[#EF4444]'
                }`} />
                {selectedGuest.status.toUpperCase()}
              </span>

              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-750 border border-blue-200">
                🌐 {selectedGuest.nationality}
              </span>

              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                👤 {selectedGuest.visits} visits
              </span>
            </div>

            {/* CONTACT INFORMATION */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CONTACT INFORMATION</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 text-gray-400" /> Phone
                  </span>
                  <span className="font-extrabold text-[#1E3A5F] truncate text-[10px]">{selectedGuest.phone}</span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5 text-gray-400" /> Email
                  </span>
                  <span className="font-extrabold text-[#1E3A5F] truncate text-[10px]" title={selectedGuest.email}>
                    {selectedGuest.email}
                  </span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-gray-400" /> Date of Birth
                  </span>
                  <span className="font-extrabold text-[#1E3A5F] text-[10px]">{selectedGuest.dob}</span>
                </div>

                <div className="p-2.5 bg-white border border-gray-200 rounded-lg flex flex-col justify-between h-[52px]">
                  <span className="text-[8px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-gray-400" /> Address
                  </span>
                  <span className="font-extrabold text-[#1E3A5F] truncate text-[10px]" title={selectedGuest.address}>
                    {selectedGuest.address}
                  </span>
                </div>

              </div>
            </div>

            {/* IDENTITY VERIFICATION -> NIK Pelanggan (KTP) */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">IDENTITY VERIFICATION</h4>
              
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#1E3A5F]/5 rounded-lg text-[#1E3A5F]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">NIK PELANGGAN (KTP)</span>
                    <span className="text-[11px] font-bold font-mono text-gray-800">{selectedGuest.nik}</span>
                  </div>
                </div>
                
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 border border-green-200 text-green-700 text-[8px] font-bold">
                  <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-green-600" /> Verified
                </span>
              </div>
            </div>

            {/* STAY HISTORY */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">STAY HISTORY</h4>
                <span className="text-[10px] font-extrabold text-[#1E3A5F]">{selectedGuest.stays.length} stays</span>
              </div>

              <div className="relative pl-4 space-y-4 border-l border-dashed border-gray-300 ml-2 text-xs">
                {selectedGuest.stays.map((stay, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle timeline point */}
                    <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[21.5px] border-2 border-white top-1"></div>
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-extrabold text-gray-800">{stay.room}</p>
                        <p className="text-[10px] text-gray-450 font-bold mt-0.5">{stay.dates}</p>
                      </div>
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 font-black rounded text-[9px]">
                        {stay.nights}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-2.5 border-t border-gray-200 pt-4">
              <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">QUICK ACTIONS</h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={openEditModal}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 border border-blue-200 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => alert(`Simulasi reservasi baru untuk ${selectedGuest.name}`)}
                  className="w-full py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>New Booking</span>
                </button>
              </div>

              <button
                onClick={() => toggleBlacklist(selectedGuest.id)}
                className={`w-full py-2 font-bold rounded-lg text-xs tracking-wide transition-all cursor-pointer border text-center ${
                  selectedGuest.status === 'Blacklisted'
                    ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                {selectedGuest.status === 'Blacklisted' ? '✓ Remove from Blacklist' : '⚠ Blacklist Guest'}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* 4. ADD GUEST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 text-left relative">
            <h3 className="text-base font-black text-[#1E3A5F] mb-4 flex items-center space-x-1.5">
              <UserPlus className="w-5 h-5" />
              <span>Tambah Profil Tamu Baru</span>
            </h3>
            
            <form onSubmit={handleAddGuest} className="space-y-3.5 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1 font-bold">NAMA LENGKAP</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masukkan nama lengkap tamu"
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">NOMOR HP</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+62 812..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">EMAIL</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@tamu.com"
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TANGGAL LAHIR</label>
                  <input
                    type="text"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    placeholder="Apr 14, 1979"
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">KEWARGANEGARAAN</label>
                  <input
                    type="text"
                    value={newNationality}
                    onChange={(e) => setNewNationality(e.target.value.toUpperCase())}
                    placeholder="US / ID / JP..."
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">NIK PELANGGAN (KTP)</label>
                <input
                  type="text"
                  value={newNik}
                  onChange={(e) => setNewNik(e.target.value)}
                  placeholder="327305..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">ALAMAT DOMISILI</label>
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Alamat lengkap tempat tinggal"
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer transition-colors text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/95 text-white font-bold rounded-lg cursor-pointer transition-colors text-center shadow-xs"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EDIT GUEST MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full p-6 text-left relative">
            <h3 className="text-base font-black text-[#1E3A5F] mb-4 flex items-center space-x-1.5">
              <Edit2 className="w-4 h-4" />
              <span>Edit Profil Tamu {selectedGuest?.id}</span>
            </h3>
            
            <form onSubmit={handleEditGuest} className="space-y-3.5 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1 font-bold">NAMA LENGKAP</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">NOMOR HP</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">EMAIL</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold">TANGGAL LAHIR</label>
                  <input
                    type="text"
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-bold">KEWARGANEGARAAN</label>
                  <input
                    type="text"
                    value={newNationality}
                    onChange={(e) => setNewNationality(e.target.value.toUpperCase())}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold">NIK PELANGGAN (KTP)</label>
                <input
                  type="text"
                  value={newNik}
                  onChange={(e) => setNewNik(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">ALAMAT DOMISILI</label>
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

// ==========================================
// 2. RESERVATION MANAGEMENT
// ==========================================
interface ReservationManagementProps {
  setActiveTab: (tab: any) => void;
}

interface ReservationItem {
  code: string;
  guestName: string;
  guestId: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  status: 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
  ratePerNight: number;
  totalCharge: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending';
  balanceStatus: 'Settled' | 'Due';
  createdDate: string;
  createdTime: string;
}

const INITIAL_RESERVATIONS: ReservationItem[] = [
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
    status: 'Cancelled',
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
  const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Pending'>('All');
  
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
  const [formStatus, setFormStatus] = useState<'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled'>('Pending');

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

    const matchesStatus = statusFilter === 'All' ? true : r.status === statusFilter;

    // Optional date filter matches
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
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Checked In':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Checked Out':
        return 'bg-gray-100 text-gray-750 border-gray-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
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
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="res-mgmt-wrapper bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Reservation Management</h2>
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
      <div className="flex flex-wrap items-center gap-1.5 py-3 border-b border-gray-200">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            statusFilter === 'All'
              ? 'bg-blue-50 text-[#1E3A5F] border border-blue-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          All Bookings <span className="ml-1 opacity-70">{reservations.length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Confirmed')}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
            statusFilter === 'Confirmed'
              ? 'bg-blue-50 text-blue-750 border border-blue-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          <span>Confirmed</span>
          <span className="opacity-70">{reservations.filter(r => r.status === 'Confirmed').length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Checked In')}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
            statusFilter === 'Checked In'
              ? 'bg-green-50 text-green-700 border border-green-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          <span>Checked In</span>
          <span className="opacity-70">{reservations.filter(r => r.status === 'Checked In').length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Checked Out')}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
            statusFilter === 'Checked Out'
              ? 'bg-gray-100 text-gray-750 border border-gray-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          <span>Checked Out</span>
          <span className="opacity-70">{reservations.filter(r => r.status === 'Checked Out').length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Pending')}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
            statusFilter === 'Pending'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
          <span>Pending</span>
          <span className="opacity-70">{reservations.filter(r => r.status === 'Pending').length}</span>
        </button>

        <button
          onClick={() => setStatusFilter('Cancelled')}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
            statusFilter === 'Cancelled'
              ? 'bg-red-50 text-red-700 border border-red-200 shadow-3xs'
              : 'text-gray-500 hover:bg-gray-50 border border-transparent'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          <span>Cancelled</span>
          <span className="opacity-70">{reservations.filter(r => r.status === 'Cancelled').length}</span>
        </button>
      </div>

      {/* SPLIT PANE MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        
        {/* LEFT COLUMN: RESERVATION DATA TABLE */}
        <div className="lg:col-span-8 overflow-x-auto border border-gray-250 rounded-xl bg-white">
          <table className="w-full text-xs text-left text-gray-500">
            <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 font-bold border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Res Code</th>
                <th className="px-4 py-3">Guest Name</th>
                <th className="px-4 py-3 text-center">Room</th>
                <th className="px-4 py-3">Room Type</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Check Out</th>
                <th className="px-4 py-3 text-center">Nights</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-semibold text-gray-800">
              {filteredReservations.map(res => {
                const isSelected = res.code === selectedResCode;
                return (
                  <tr 
                    key={res.code}
                    onClick={() => setSelectedResCode(res.code)}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-gray-550 text-[11px] font-bold">{res.code}</td>
                    <td className="px-4 py-3 text-[#1E3A5F] font-bold">{res.guestName}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-gray-700 bg-gray-50/50">{res.roomNumber}</td>
                    <td className="px-4 py-3 text-gray-600">{res.roomType}</td>
                    <td className="px-4 py-3 font-mono text-gray-650">{res.checkInDate}</td>
                    <td className="px-4 py-3 font-mono text-gray-650">{res.checkOutDate}</td>
                    <td className="px-4 py-3 text-center text-gray-600 font-bold">{res.nights}N</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeStyle(res.status)}`}>
                        <span className={`w-1 h-1 rounded-full mr-1 ${getStatusDotColor(res.status)}`} />
                        {res.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredReservations.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 font-bold">
                    Tidak ada reservasi ditemukan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

            {/* BOOKING TIMELINE (Vertical timeline, VIP Flag Removed) */}
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
                {/* Check Out / Check In contextual */}
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
                  className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

// ==========================================
// 3. CHECK-IN MANAGEMENT
// ==========================================
interface CheckInProps {
  checkins: CheckInGuest[];
  handleCheckInAction: (id: number, roomNum: number) => void;
}

export function CheckInManagement({ checkins, handleCheckInAction }: CheckInProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Daftar Tamu Masuk (Check-In Waiting List)</h2>
        <p className="text-xs text-gray-500">Daftar tamu terdaftar yang dijadwalkan masuk hari ini.</p>
      </div>
      <div className="space-y-4">
        {checkins.map(ci => (
          <div key={ci.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-[#1E3A5F]">{ci.name}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Kamar yang dialokasikan: <span className="font-bold text-[#1E3A5F]">Kamar {ci.roomNum}</span> ({ci.roomType})
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Jadwal Tiba: {ci.time} • Status: {ci.status}</p>
            </div>
            <div>
              {ci.status === 'Checked In' ? (
                <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 inline-block">
                  ✓ Selesai Check-In
                </span>
              ) : (
                <button
                  onClick={() => handleCheckInAction(ci.id, ci.roomNum)}
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#1E3A5F]/90 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Verifikasi & Check-In Tamu</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. CHECK-OUT MANAGEMENT
// ==========================================
interface CheckOutProps {
  checkouts: CheckOutGuest[];
  handleCheckOutAction: (id: number, roomNum: number) => void;
}

export function CheckOutManagement({ checkouts, handleCheckOutAction }: CheckOutProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Daftar Tamu Keluar (Check-Out List)</h2>
        <p className="text-xs text-gray-500">Kelola proses checkout, invoice, dan tagihan kamar tamu.</p>
      </div>
      <div className="space-y-4">
        {checkouts.map(co => (
          <div key={co.id} className="p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-[#1E3A5F]">{co.name}</p>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                Menempati: <span className="font-bold text-[#1E3A5F]">Kamar {co.roomNum}</span> • Total Tagihan: <span className="font-bold text-red-600">Rp {co.balance.toLocaleString('id-ID')}</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Rencana Keluar: {co.time}</p>
            </div>
            <div>
              {co.status === 'Checked Out' ? (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg border border-gray-200 inline-block">
                  ✓ Selesai Check-Out (Kamar Kotor)
                </span>
              ) : (
                <button
                  onClick={() => handleCheckOutAction(co.id, co.roomNum)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  <UserX className="w-4 h-4" />
                  <span>Proses Checkout & Bayar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. HOUSEKEEPING MANAGEMENT
// ==========================================
interface HousekeepingProps {
  rooms: Room[];
  handleCleanRoomAction: (roomNum: number) => void;
}

export function HousekeepingManagement({ rooms, handleCleanRoomAction }: HousekeepingProps) {
  const dirtyRooms = rooms.filter(r => r.status === 'dirty');

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Manajemen Pembersihan Kamar (Housekeeping)</h2>
        <p className="text-xs text-gray-500">Daftar kamar dengan status kotor (*Dirty*) yang harus dibersihkan oleh staf.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dirtyRooms.map(room => (
          <div key={room.id} className="p-4 rounded-xl border border-orange-200 bg-orange-50/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#1E3A5F]">Kamar {room.id}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{room.type} Room</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 border border-orange-200 text-orange-700 text-[9px] font-bold rounded">
                Status: Kotor
              </span>
            </div>
            <button
              onClick={() => handleCleanRoomAction(room.id)}
              className="p-2.5 bg-[#22C55E] hover:bg-green-600 text-white rounded-lg transition-all cursor-pointer shadow-sm"
              title="Tandai Kamar Selesai Dibersihkan"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {dirtyRooms.length === 0 && (
          <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Check className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-600">Semua Kamar Bersih!</p>
            <p className="text-xs text-gray-400">Tidak ada kamar kotor dalam antrean pembersihan saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. CUSTOMER SERVICE MANAGEMENT
// ==========================================
interface CSProps {
  serviceRequests: ServiceRequest[];
  setServiceRequests: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  handleResolveCSRequest: (id: number) => void;
}

export function CustomerServiceManagement({ 
  serviceRequests, 
  setServiceRequests, 
  handleResolveCSRequest 
}: CSProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-[#1E3A5F]">Layanan Staf & Keluhan (Customer Service)</h2>
          <p className="text-xs text-gray-500">Manajemen permintaan fasilitas ekstra atau laporan komplain tamu dari kamar.</p>
        </div>
        <button
          onClick={() => {
            const room = prompt('Masukkan Nomor Kamar:');
            const item = prompt('Masukkan Permintaan/Keluhan Staf:');
            if (room && item) {
              setServiceRequests(prev => [...prev, { id: prev.length + 1, roomNum: parseInt(room), item, status: 'Pending' }]);
            }
          }}
          className="px-3 py-1.5 bg-[#1E3A5F] text-white text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Tiket CS</span>
        </button>
      </div>

      <div className="space-y-3">
        {serviceRequests.map(req => (
          <div key={req.id} className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1E3A5F]">Kamar {req.roomNum}</p>
              <p className="text-xs text-gray-700 mt-1 font-semibold">Permintaan: {req.item}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold border ${
                req.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' : 
                req.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                'bg-gray-100 text-gray-400 border-gray-200'
              }`}>
                Status: {req.status}
              </span>
            </div>
            <div>
              {req.status !== 'Resolved' ? (
                <button
                  onClick={() => handleResolveCSRequest(req.id)}
                  className="px-3 py-1.5 bg-[#22C55E] text-white text-xs font-bold rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  Selesaikan Tiket
                </button>
              ) : (
                <span className="text-xs text-gray-400 font-bold">✓ Terselesaikan</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. FOOD & BEVERAGE MANAGEMENT
// ==========================================
interface FBProps {
  fbOrders: FBOrder[];
  setFbOrders: React.Dispatch<React.SetStateAction<FBOrder[]>>;
  handleDeliverFBOrder: (id: number) => void;
}

export function FoodBeverageManagement({ 
  fbOrders, 
  setFbOrders, 
  handleDeliverFBOrder 
}: FBProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-[#1E3A5F]">Layanan Makanan & Minuman Kamar (F&B Orders)</h2>
          <p className="text-xs text-gray-500">Mencatat dan mengonfirmasi pesanan room service makanan dari kamar tamu.</p>
        </div>
        <button
          onClick={() => {
            const room = prompt('Masukkan Nomor Kamar:');
            const item = prompt('Masukkan Nama Makanan/Minuman:');
            if (room && item) {
              setFbOrders(prev => [...prev, { id: prev.length + 1, roomNum: parseInt(room), item, qty: 1, price: 45000, status: 'Pending' }]);
            }
          }}
          className="px-3 py-1.5 bg-[#1E3A5F] text-white text-xs font-bold rounded-lg flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Order Makanan</span>
        </button>
      </div>

      <div className="space-y-3">
        {fbOrders.map(ord => (
          <div key={ord.id} className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1E3A5F]">Kamar {ord.roomNum}</p>
              <p className="text-xs text-gray-700 mt-1 font-semibold">{ord.item} (x{ord.qty})</p>
              <p className="text-[10px] text-gray-555 mt-0.5">Biaya: Rp {ord.price.toLocaleString('id-ID')} (Masuk tagihan akhir kamar)</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold border ${
                ord.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' : 
                ord.status === 'On Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                'bg-gray-100 text-gray-400 border-gray-200'
              }`}>
                Status: {ord.status}
              </span>
            </div>
            <div>
              {ord.status !== 'Delivered' ? (
                <button
                  onClick={() => handleDeliverFBOrder(ord.id)}
                  className="px-3 py-1.5 bg-[#22C55E] text-white text-xs font-bold rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  Tandai Dikirim
                </button>
              ) : (
                <span className="text-xs text-gray-400 font-bold">✓ Terkirim ke Kamar</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. REPORTS MANAGEMENT
// ==========================================
interface ReportsProps {
  rooms: Room[];
  serviceRequests: ServiceRequest[];
}

export function ReportsManagement({ rooms, serviceRequests }: ReportsProps) {
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const totalRoomsCount = rooms.length;
  const activeCSRequests = serviceRequests.filter(r => r.status !== 'Resolved').length;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Laporan & Audit Operasional</h2>
        <p className="text-xs text-gray-500">Ringkasan status harian dan log operasional simulasi HMS.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-gray-200 bg-[#F5F7FA]">
          <h4 className="text-xs font-bold text-[#1E3A5F] uppercase mb-2">Okupansi Kamar Hari Ini</h4>
          <div className="space-y-2 mt-4 text-xs font-semibold">
            <div className="flex justify-between"><span>Kamar Terisi</span><span>{occupiedCount}</span></div>
            <div className="flex justify-between border-b pb-1.5"><span>Kamar Kosong Bersih</span><span>{availableCount}</span></div>
            <div className="flex justify-between font-bold text-[#1E3A5F]"><span>Rasio Okupansi Kamar</span><span>{Math.round((occupiedCount / totalRoomsCount) * 100)}%</span></div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl border border-gray-200 bg-[#F5F7FA]">
          <h4 className="text-xs font-bold text-[#1E3A5F] uppercase mb-2">Status Audit Layanan Kamar</h4>
          <div className="space-y-2 mt-4 text-xs font-semibold">
            <div className="flex justify-between"><span>Keluhan CS Selesai</span><span>{serviceRequests.filter(s => s.status === 'Resolved').length}</span></div>
            <div className="flex justify-between border-b pb-1.5"><span>Keluhan CS Aktif</span><span>{activeCSRequests}</span></div>
            <div className="flex justify-between font-bold text-[#1E3A5F]"><span>Total Keluhan Tercatat</span><span>{serviceRequests.length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. SETTINGS MANAGEMENT
// ==========================================
interface SettingsProps {
  onReset: () => void;
}

export function SettingsManagement({ onReset }: SettingsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left max-w-lg mx-auto">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#1E3A5F]">Pengaturan Simulasi HMS</h2>
        <p className="text-xs text-gray-500">Kustomisasi parameter simulasi laboratorium sekolah.</p>
      </div>
      <div className="space-y-4 text-xs font-semibold text-[#1E3A5F]">
        <div>
          <label className="block mb-1 font-bold">MODE SIMULASI</label>
          <select className="w-full p-2.5 border border-gray-300 rounded-lg">
            <option>Mode Pembelajaran Mandiri (Default)</option>
            <option>Mode Ujian Praktik Sekolah</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-bold">RESET DATABASE SIMULASI</label>
          <button 
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menyetel ulang database simulasi ke pengaturan demo awal?')) {
                onReset();
                alert('Database berhasil di-reset!');
              }
            }}
            type="button"
            className="mt-1 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer transition-all"
          >
            KEMBALIKAN KE MOCK DEMO AWAL (78 TERISI, 32 KOSONG)
          </button>
        </div>
      </div>
    </div>
  );
}
