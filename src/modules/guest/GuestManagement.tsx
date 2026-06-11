import React, { useState } from 'react';
import { 
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
  UserPlus,
  Plus
} from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

interface StayHistoryItem {
  room: string;
  nights: string;
  dates: string;
}

export interface GuestProfile {
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

export const INITIAL_GUEST_PROFILES: GuestProfile[] = [
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

  const columns = [
    {
      header: 'Guest ID',
      accessor: (guest: GuestProfile) => <span className="font-mono text-gray-550 text-[11px]">{guest.id}</span>,
      sortKey: 'id'
    },
    {
      header: 'Full Name',
      accessor: (guest: GuestProfile) => (
        <div className="flex items-center space-x-2.5">
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
      ),
      sortKey: 'name'
    },
    {
      header: 'Phone',
      accessor: (guest: GuestProfile) => <span className="font-mono text-gray-600">{guest.phone}</span>,
      sortKey: 'phone'
    },
    {
      header: 'Email',
      accessor: (guest: GuestProfile) => <span className="text-gray-600 truncate max-w-[140px] block" title={guest.email}>{guest.email}</span>,
      sortKey: 'email'
    },
    {
      header: 'NIK (KTP)',
      accessor: (guest: GuestProfile) => <span className="font-mono text-gray-600">{guest.nik}</span>,
      sortKey: 'nik'
    },
    {
      header: 'Visits',
      accessor: (guest: GuestProfile) => <span className="font-bold text-[#1E3A5F]">{guest.visits}</span>,
      sortKey: 'visits'
    }
  ];

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
        <div className="lg:col-span-8">
          <DataTable
            data={filteredGuests}
            columns={columns}
            rowIdKey="id"
            selectedRowId={selectedGuestId}
            onRowClick={(row) => setSelectedGuestId(row.id)}
            pageSize={10}
          />
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
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">NIK NIK PELANGGAN (KTP)</span>
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
