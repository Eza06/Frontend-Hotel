import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Settings as ConfigIcon, 
  ShieldCheck, 
  Coffee, 
  BedDouble, 
  List, 
  Check, 
  Power, 
  Trash2, 
  Save 
} from 'lucide-react';

// Interfaces for Master Data Records
interface BaseRecord {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface RoomTypeData extends BaseRecord {
  capacity: number;
  basePrice: number;
  description: string;
}

export interface MenuCategoryData extends BaseRecord {
  description: string;
}

export interface FBMenuData extends BaseRecord {
  category: string;
  price: number;
  description: string;
}

export interface RolePermissionData extends BaseRecord {
  permissions: string[];
  description: string;
}

export interface SystemConfigData {
  schoolName: string;
  schoolLogo: string;
  appName: string;
  contactNumber: string;
  address: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

// Initial datasets for master data
const INITIAL_ROOM_TYPES: RoomTypeData[] = [
  { id: 'RT-001', name: 'Standard Room', capacity: 2, basePrice: 500000, description: 'Kamar dasar dengan fasilitas standar hotel bintang 3.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'RT-002', name: 'Deluxe Room', capacity: 2, basePrice: 900000, description: 'Pemandangan kota dengan queen-size bed dan minibar.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'RT-003', name: 'Suite Room', capacity: 4, basePrice: 1800000, description: 'Ruang tamu terpisah, bathtub premium, sarapan gratis.', status: 'Active', createdAt: '2026-05-12', updatedAt: '2026-06-02' },
  { id: 'RT-004', name: 'Presidential Suite', capacity: 6, basePrice: 4500000, description: 'Fasilitas super mewah, jacuzzi pribadi, layanan butler 24 jam.', status: 'Active', createdAt: '2026-05-15', updatedAt: '2026-06-05' }
];

const INITIAL_MENU_CATEGORIES: MenuCategoryData[] = [
  { id: 'MC-001', name: 'Coffee', description: 'Minuman kopi espresso, manual brew, latte dingin/panas.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'MC-002', name: 'Non Coffee', description: 'Minuman non-kopi seperti taro, matcha, coklat premium.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'MC-003', name: 'Tea', description: 'Teh seduh premium, chamomile, lychee tea, lemon tea.', status: 'Active', createdAt: '2026-05-11', updatedAt: '2026-06-01' },
  { id: 'MC-004', name: 'Snack', description: 'Makanan ringan pendamping minuman seperti kentang goreng, nachos.', status: 'Active', createdAt: '2026-05-12', updatedAt: '2026-06-02' },
  { id: 'MC-005', name: 'Dessert', description: 'Kue manis, puding, waffle dengan es krim.', status: 'Active', createdAt: '2026-05-12', updatedAt: '2026-06-02' },
  { id: 'MC-006', name: 'Main Course', description: 'Makanan utama berat seperti nasi goreng, pasta, steak.', status: 'Active', createdAt: '2026-05-15', updatedAt: '2026-06-05' }
];

const INITIAL_FB_MENUS: FBMenuData[] = [
  { id: 'FM-001', name: 'Nasi Goreng Kampung', category: 'Main Course', price: 65000, description: 'Nasi goreng dengan bumbu terasi tradisional khas nusantara, telur, dan kerupuk.', status: 'Active', createdAt: '2026-05-16', updatedAt: '2026-06-01' },
  { id: 'FM-002', name: 'Ice Lychee Tea', category: 'Tea', price: 55000, description: 'Teh premium dingin rasa leci segar dengan buah leci utuh.', status: 'Active', createdAt: '2026-05-16', updatedAt: '2026-06-01' },
  { id: 'FM-003', name: 'Espresso Double', category: 'Coffee', price: 35000, description: 'Dua shot espresso pekat dari biji kopi arabika pilihan.', status: 'Active', createdAt: '2026-05-18', updatedAt: '2026-06-02' },
  { id: 'FM-004', name: 'Club Sandwich', category: 'Snack', price: 75000, description: 'Roti lapis panggang tiga tingkat dengan ayam fillet, telur dadar, keju lembaran.', status: 'Active', createdAt: '2026-05-20', updatedAt: '2026-06-04' }
];

const INITIAL_ROLES: RolePermissionData[] = [
  { id: 'R-001', name: 'Administrator', permissions: ['view_all', 'manage_rooms', 'manage_bookings', 'manage_housekeeping', 'manage_cs', 'manage_fb', 'view_reports', 'manage_master_data'], description: 'Akses penuh ke semua modul sistem dan konfigurasi global.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'R-002', name: 'Front Office', permissions: ['view_dashboard', 'manage_bookings'], description: 'Melakukan registrasi tamu, proses check-in, check-out, dan pemesanan kamar.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'R-003', name: 'Housekeeping', permissions: ['view_dashboard', 'manage_housekeeping'], description: 'Memantau dan memperbarui status kebersihan kamar hotel.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'R-004', name: 'Customer Service', permissions: ['view_dashboard', 'manage_cs'], description: 'Mengelola tiket keluhan tamu, penugasan staf, dan status penyelesaian.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' },
  { id: 'R-005', name: 'Food & Beverage', permissions: ['view_dashboard', 'manage_fb'], description: 'Monitoring transaksi kasir kafe hotel dan pesanan makanan kamar.', status: 'Active', createdAt: '2026-05-10', updatedAt: '2026-06-01' }
];

const INITIAL_CONFIG: SystemConfigData = {
  schoolName: 'SMK Negeri 5 Kota Perhotelan',
  schoolLogo: 'Hotel Academy Logo',
  appName: 'HMS SmartSchool v2',
  contactNumber: '+62 21 555 8899',
  address: 'Jl. Raya Pendidikan No. 45, Kompleks Akademis, Jakarta Selatan',
  timezone: 'WIB (UTC+7)',
  dateFormat: 'DD/MM/YYYY',
  currency: 'IDR (Rupiah)'
};

const ALL_SYSTEM_PERMISSIONS = [
  { code: 'view_dashboard', name: 'View Dashboard' },
  { code: 'manage_rooms', name: 'Manage Rooms & Status' },
  { code: 'manage_bookings', name: 'Manage Booking, Check-In & Check-Out' },
  { code: 'manage_housekeeping', name: 'Update Housekeeping Log' },
  { code: 'manage_cs', name: 'Manage Customer Service Tickets' },
  { code: 'manage_fb', name: 'Access F&B Cashier Monitoring' },
  { code: 'view_reports', name: 'Generate & View Audit Reports' },
  { code: 'manage_master_data', name: 'Modify System Master Data' }
];

export default function MasterDataManagement() {
  const [activeCategory, setActiveCategory] = useState<'rooms' | 'menu-cats' | 'menus' | 'roles' | 'config'>('rooms');
  
  // Data States
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>(INITIAL_ROOM_TYPES);
  const [menuCats, setMenuCats] = useState<MenuCategoryData[]>(INITIAL_MENU_CATEGORIES);
  const [fbMenus, setFbMenus] = useState<FBMenuData[]>(INITIAL_FB_MENUS);
  const [roles, setRoles] = useState<RolePermissionData[]>(INITIAL_ROLES);
  const [config, setConfig] = useState<SystemConfigData>(INITIAL_CONFIG);

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Selected Record track
  const [selectedRecordId, setSelectedRecordId] = useState<string>('RT-001');

  // Input modal states for adding new data
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newVal1, setNewVal1] = useState(''); // capacity, or category
  const [newVal2, setNewVal2] = useState(''); // basePrice, or price

  // Handle selected record
  const getSelectedRecord = () => {
    if (activeCategory === 'rooms') return roomTypes.find(r => r.id === selectedRecordId) || roomTypes[0] || null;
    if (activeCategory === 'menu-cats') return menuCats.find(c => c.id === selectedRecordId) || menuCats[0] || null;
    if (activeCategory === 'menus') return fbMenus.find(m => m.id === selectedRecordId) || fbMenus[0] || null;
    if (activeCategory === 'roles') return roles.find(r => r.id === selectedRecordId) || roles[0] || null;
    return null;
  };

  const activeRecord = getSelectedRecord();

  // Filters records dynamically
  const getFilteredRecords = () => {
    if (activeCategory === 'rooms') {
      return roomTypes.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' ? true : r.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
    if (activeCategory === 'menu-cats') {
      return menuCats.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
    if (activeCategory === 'menus') {
      return fbMenus.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' ? true : m.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    }
    return [];
  };

  const filteredRecords = getFilteredRecords();

  // Quick Action: Toggle Status (Activate / Deactivate)
  const handleToggleStatus = (id: string) => {
    if (activeCategory === 'rooms') {
      setRoomTypes(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date().toISOString().slice(0, 10) } : r));
    } else if (activeCategory === 'menu-cats') {
      setMenuCats(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date().toISOString().slice(0, 10) } : c));
    } else if (activeCategory === 'menus') {
      setFbMenus(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date().toISOString().slice(0, 10) } : m));
    }
  };

  // Quick Action: Delete Record
  const handleDeleteRecord = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data master ini? Tindakan ini tidak dapat dibatalkan.')) {
      if (activeCategory === 'rooms') {
        setRoomTypes(prev => prev.filter(r => r.id !== id));
      } else if (activeCategory === 'menu-cats') {
        setMenuCats(prev => prev.filter(c => c.id !== id));
      } else if (activeCategory === 'menus') {
        setFbMenus(prev => prev.filter(m => m.id !== id));
      }
      alert('Data berhasil dihapus dari Master Database.');
    }
  };

  // Create new master record
  const handleAddMasterRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${activeCategory === 'rooms' ? 'RT' : activeCategory === 'menu-cats' ? 'MC' : 'FM'}-00${Math.floor(Math.random() * 900) + 100}`;
    const today = new Date().toISOString().slice(0, 10);

    if (activeCategory === 'rooms') {
      const cap = parseInt(newVal1) || 2;
      const price = parseInt(newVal2) || 400000;
      const newRoomType: RoomTypeData = {
        id: newId,
        name: newName,
        capacity: cap,
        basePrice: price,
        description: newDesc || 'No description provided.',
        status: 'Active',
        createdAt: today,
        updatedAt: today
      };
      setRoomTypes(prev => [newRoomType, ...prev]);
      setSelectedRecordId(newId);
    } else if (activeCategory === 'menu-cats') {
      const newCat: MenuCategoryData = {
        id: newId,
        name: newName,
        description: newDesc || 'No description provided.',
        status: 'Active',
        createdAt: today,
        updatedAt: today
      };
      setMenuCats(prev => [newCat, ...prev]);
      setSelectedRecordId(newId);
    } else if (activeCategory === 'menus') {
      const price = parseInt(newVal2) || 25000;
      const newMenu: FBMenuData = {
        id: newId,
        name: newName,
        category: newVal1 || 'Coffee',
        price: price,
        description: newDesc || 'No description provided.',
        status: 'Active',
        createdAt: today,
        updatedAt: today
      };
      setFbMenus(prev => [newMenu, ...prev]);
      setSelectedRecordId(newId);
    }

    // Reset inputs
    setNewName('');
    setNewDesc('');
    setNewVal1('');
    setNewVal2('');
    setIsAddModalOpen(false);
  };

  // Roles & Permissions Handler
  const handleTogglePermission = (roleId: string, permCode: string) => {
    setRoles(prev => prev.map(r => {
      if (r.id === roleId) {
        const exists = r.permissions.includes(permCode);
        const newPerms = exists 
          ? r.permissions.filter(p => p !== permCode) 
          : [...r.permissions, permCode];
        return { ...r, permissions: newPerms };
      }
      return r;
    }));
  };

  // System Config handler
  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan System Configuration berhasil disimpan.');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1E3A5F]">Master Data Management</h2>
          <p className="text-xs text-gray-500 mt-1">SMA PERHOTELAN • Pusat Administrasi & Referensi Konfigurasi Sistem</p>
        </div>

        <div className="flex items-center gap-2">
          {activeCategory !== 'roles' && activeCategory !== 'config' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-extrabold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CATEGORY NAVIGATION (VERTICAL TABS) */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-4 space-y-2.5 shadow-3xs">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 pb-1.5 border-b">CATEGORIES</h3>
          
          <button
            onClick={() => { setActiveCategory('rooms'); setSelectedRecordId('RT-001'); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'rooms' ? 'bg-[#1E3A5F] text-white' : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Room Types</span>
          </button>

          <button
            onClick={() => { setActiveCategory('menu-cats'); setSelectedRecordId('MC-001'); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'menu-cats' ? 'bg-[#1E3A5F] text-white' : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Menu Categories</span>
          </button>

          <button
            onClick={() => { setActiveCategory('menus'); setSelectedRecordId('FM-001'); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'menus' ? 'bg-[#1E3A5F] text-white' : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Food & Beverage Menus</span>
          </button>

          <button
            onClick={() => { setActiveCategory('roles'); setSelectedRecordId('R-001'); }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'roles' ? 'bg-[#1E3A5F] text-white' : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Roles & Permissions</span>
          </button>

          <button
            onClick={() => setActiveCategory('config')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'config' ? 'bg-[#1E3A5F] text-white' : 'text-gray-650 hover:bg-gray-50'
            }`}
          >
            <ConfigIcon className="w-4 h-4" />
            <span>System Configuration</span>
          </button>
        </div>

        {/* CENTER COLUMN: MAIN WORKSPACE (TABLE OR FORM) */}
        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-3xs">
          
          {/* RENDER TABLE FOR ROOMS, CATEGORIES, MENUS */}
          {(activeCategory === 'rooms' || activeCategory === 'menu-cats' || activeCategory === 'menus') && (
            <div>
              {/* Header with Search and Status Filter */}
              <div className="px-5 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/20">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari data master..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 w-full bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase">
                  <span>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-extrabold focus:outline-none text-gray-700 cursor-pointer"
                  >
                    <option value="All">All Records</option>
                    <option value="Active">Active Records</option>
                    <option value="Inactive">Inactive Records</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                      <th className="px-5 py-3 text-[10px]">NAME & CODE</th>
                      <th className="px-5 py-3 text-[10px]">DETAILS / CATEGORY</th>
                      <th className="px-5 py-3 text-[10px]">STATUS</th>
                      <th className="px-5 py-3 text-[10px]">UPDATED AT</th>
                      <th className="px-5 py-3 text-[10px] text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {filteredRecords.map(item => {
                      const isSelected = item.id === selectedRecordId;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedRecordId(item.id)}
                          className={`cursor-pointer transition-all hover:bg-gray-50/75 ${
                            isSelected ? 'bg-blue-50/45 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="font-extrabold text-[#1E3A5F]">{item.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.id}</div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-gray-600">
                            {/* Rooms context detail */}
                            {activeCategory === 'rooms' && (
                              <span>Capacity: {(item as RoomTypeData).capacity} tamus • Rp {(item as RoomTypeData).basePrice.toLocaleString('id-ID')}</span>
                            )}
                            {/* Menu Categories context detail */}
                            {activeCategory === 'menu-cats' && (
                              <span className="truncate max-w-[200px] block">{(item as MenuCategoryData).description}</span>
                            )}
                            {/* F&B Menus context detail */}
                            {activeCategory === 'menus' && (
                              <span>{(item as FBMenuData).category} • Rp {(item as FBMenuData).price.toLocaleString('id-ID')}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black border ${
                              item.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 font-semibold">
                            {item.updatedAt}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(item.id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-500 cursor-pointer"
                                title="Toggle Status"
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRecord(item.id);
                                }}
                                className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-650 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400 font-bold">
                          Tidak ada data master yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RENDER ROLES & PERMISSIONS GRID */}
          {activeCategory === 'roles' && (
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Access Control Matrix</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Tentukan otorisasi akses modul operasional untuk setiap peran staf hotel</p>
              </div>

              {/* Roles Selector list */}
              <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-150">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRecordId(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      selectedRecordId === r.id ? 'bg-[#1E3A5F] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>

              {/* Permissions Checklist matrix for the selected role */}
              {activeRecord && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 uppercase">Peran: {activeRecord.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{(activeRecord as any).description}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-lg">
                      {(activeRecord as any).permissions.length} Hak Akses
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {ALL_SYSTEM_PERMISSIONS.map(perm => {
                      const hasPerm = (activeRecord as any).permissions.includes(perm.code) || (activeRecord as any).permissions.includes('view_all');
                      const isDisabled = activeRecord.name === 'Administrator'; // Admin has full power

                      return (
                        <div
                          key={perm.code}
                          onClick={() => !isDisabled && handleTogglePermission(activeRecord.id, perm.code)}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all text-xs font-semibold ${
                            isDisabled ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                          } ${hasPerm ? 'bg-blue-50/20 border-blue-200' : 'border-gray-200'}`}
                        >
                          <div>
                            <p className="text-gray-800 font-bold">{perm.name}</p>
                            <p className="text-[9px] text-gray-400 font-mono mt-0.5">{perm.code}</p>
                          </div>
                          
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            hasPerm ? 'bg-[#1E3A5F] border-[#1E3A5F] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {hasPerm && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RENDER SYSTEM CONFIGURATION FORM */}
          {activeCategory === 'config' && (
            <form onSubmit={handleUpdateConfig} className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">System Settings</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Atur detail identitas sekolah dan opsi lokalisasi HMS</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-black text-gray-450 uppercase mb-1">Nama Lembaga / Sekolah</label>
                  <input
                    type="text"
                    required
                    value={config.schoolName}
                    onChange={(e) => setConfig(prev => ({ ...prev, schoolName: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-850 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Nama Aplikasi</label>
                    <input
                      type="text"
                      required
                      value={config.appName}
                      onChange={(e) => setConfig(prev => ({ ...prev, appName: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-850 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Nomor Kontak Hubungi</label>
                    <input
                      type="text"
                      required
                      value={config.contactNumber}
                      onChange={(e) => setConfig(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-850 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Alamat Lembaga</label>
                  <textarea
                    required
                    rows={2}
                    value={config.address}
                    onChange={(e) => setConfig(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-850 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Timezone</label>
                    <select
                      value={config.timezone}
                      onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                    >
                      <option value="WIB (UTC+7)">WIB (UTC+7)</option>
                      <option value="WITA (UTC+8)">WITA (UTC+8)</option>
                      <option value="WIT (UTC+9)">WIT (UTC+9)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Format Tanggal</label>
                    <select
                      value={config.dateFormat}
                      onChange={(e) => setConfig(prev => ({ ...prev, dateFormat: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-455 uppercase mb-1">Mata Uang</label>
                    <select
                      value={config.currency}
                      onChange={(e) => setConfig(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                    >
                      <option value="IDR (Rupiah)">IDR (Rupiah)</option>
                      <option value="USD ($)">USD ($)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* RIGHT COLUMN: RIGHT DETAIL SIDEBAR */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-3xs text-left">
          
          <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-450 uppercase tracking-wider">SELECTED RECORD</h3>
            {activeRecord && activeCategory !== 'roles' && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                activeRecord.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {activeRecord.status}
              </span>
            )}
          </div>

          {activeRecord ? (
            <div className="space-y-4 text-xs">
              
              {/* Record Summary */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Record Name</span>
                  <p className="font-extrabold text-gray-800 text-sm mt-0.5">{activeRecord.name}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">ID Code</span>
                  <p className="font-mono font-bold text-[#1E3A5F]">{activeRecord.id}</p>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Deskripsi</span>
                  <p className="text-gray-500 font-semibold leading-relaxed mt-0.5">
                    {activeCategory === 'rooms' ? (activeRecord as RoomTypeData).description :
                     activeCategory === 'menu-cats' ? (activeRecord as MenuCategoryData).description :
                     activeCategory === 'menus' ? (activeRecord as FBMenuData).description :
                     (activeRecord as any).description}
                  </p>
                </div>
              </div>

              {/* Numeric Metadata Details */}
              {activeCategory === 'rooms' && (
                <div className="grid grid-cols-2 gap-2 text-center p-2.5 border border-gray-150 rounded-lg">
                  <div>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">CAPACITY</span>
                    <p className="font-black text-gray-800 text-sm mt-0.5">{(activeRecord as RoomTypeData).capacity} Pax</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">BASE PRICE</span>
                    <p className="font-black text-gray-800 text-xs mt-1">Rp {(activeRecord as RoomTypeData).basePrice.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )}

              {activeCategory === 'menus' && (
                <div className="grid grid-cols-2 gap-2 text-center p-2.5 border border-gray-150 rounded-lg">
                  <div>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">CATEGORY</span>
                    <p className="font-black text-gray-800 mt-0.5">{(activeRecord as FBMenuData).category}</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">PRICE</span>
                    <p className="font-black text-gray-800 text-xs mt-1">Rp {(activeRecord as FBMenuData).price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              )}

              {/* Dates context */}
              {activeCategory !== 'roles' && (
                <div className="text-[10px] space-y-1 text-gray-400 font-bold border-t border-gray-150 pt-3">
                  <div className="flex justify-between">
                    <span>Created Date</span>
                    <span className="text-gray-600 font-mono">{(activeRecord as any).createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="text-gray-600 font-mono">{(activeRecord as any).updatedAt}</span>
                  </div>
                </div>
              )}

              {/* Quick Actions Panel */}
              {activeCategory !== 'roles' && (
                <div className="pt-2 border-t border-gray-150 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      alert(`Fitur Edit cepat data ${activeRecord.name} siap! Masukkan formulir di modal.`);
                      setIsAddModalOpen(true);
                      setNewName(activeRecord.name);
                      setNewDesc(activeCategory === 'rooms' ? (activeRecord as RoomTypeData).description :
                                  activeCategory === 'menu-cats' ? (activeRecord as MenuCategoryData).description :
                                  (activeRecord as FBMenuData).description);
                    }}
                    className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-center cursor-pointer transition-colors"
                  >
                    Edit Record
                  </button>
                  <button
                    onClick={() => handleToggleStatus(activeRecord.id)}
                    className="w-full py-1.5 border border-gray-300 hover:bg-gray-50 text-gray-750 font-bold rounded-lg text-center cursor-pointer transition-colors"
                  >
                    {activeRecord.status === 'Active' ? 'Deactivate Record' : 'Activate Record'}
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(activeRecord.id)}
                    className="w-full py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold rounded-lg text-center cursor-pointer transition-colors"
                  >
                    Delete Record
                  </button>
                </div>
              )}

            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Pilih atau konfigurasi data untuk melihat detail.</p>
          )}
        </div>

      </div>

      {/* MASTER DATA ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="px-5 py-4 bg-[#1E3A5F] text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm uppercase tracking-wider">
                Tambah Master: {activeCategory === 'rooms' ? 'Room Type' : activeCategory === 'menu-cats' ? 'Menu Category' : 'F&B Menu'}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white hover:text-gray-250 cursor-pointer"
              >
                <Power className="w-4 h-4 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleAddMasterRecord} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Record</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Premium Deluxe, Coffee Latte, dll."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {activeCategory === 'rooms' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kapasitas (Orang)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="2"
                      value={newVal1}
                      onChange={(e) => setNewVal1(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Harga Dasar (IDR)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="900000"
                      value={newVal2}
                      onChange={(e) => setNewVal2(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {activeCategory === 'menus' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kategori Menu</label>
                    <select
                      value={newVal1}
                      onChange={(e) => setNewVal1(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 cursor-pointer"
                    >
                      <option value="Coffee">Coffee</option>
                      <option value="Non Coffee">Non Coffee</option>
                      <option value="Tea">Tea</option>
                      <option value="Snack">Snack</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Main Course">Main Course</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Harga Jual (IDR)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="35000"
                      value={newVal2}
                      onChange={(e) => setNewVal2(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Deskripsi Tambahan</label>
                <textarea
                  rows={3}
                  placeholder="Detail deskripsi data master..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152a45] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  Simpan Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
