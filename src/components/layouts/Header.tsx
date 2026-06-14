import { Search } from 'lucide-react';
import type { User } from '../../types';

interface HeaderProps {
  activeTab: string;
  loggedInUser: User;
  currentTime: string;
}

export default function Header({ activeTab, loggedInUser, currentTime }: HeaderProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Utama';
      case 'room':
        return 'Manajemen Kamar';
      case 'guest':
        return 'Guest Database';
      case 'reservation':
        return 'Booking & Reservation';
      case 'checkin':
        return 'Front Desk Check-In';
      case 'checkout':
        return 'Billing & Check-Out';
      case 'housekeeping':
        return 'Jadwal Housekeeping';
      case 'cs':
        return 'Customer Service Ticket';
      case 'fb':
        return 'Room Service F&B';
      case 'reports':
        return 'Laporan & Audit';
      case 'settings':
        return 'Pengaturan Sistem';
      default:
        return 'Sistem Informasi Hotel';
    }
  };

  return (
    <header className="bg-white h-16 border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-extrabold text-[#1E3A5F] tracking-wide uppercase">
          {getTabTitle()}
        </h1>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-wider">
          {loggedInUser.role} Mode
        </span>
      </div>

      <div className="flex items-center space-x-6">
        {/* Search bar inside header */}
        <div className="relative w-64 hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="cari kamar/nomor tamu"
            className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] focus:border-[#1E3A5F] bg-[#F5F7FA] text-gray-800"
          />
        </div>

        {/* Date time display */}
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Waktu Simulasi</p>
          <p className="text-xs font-extrabold text-[#1E3A5F] mt-1">{currentTime}</p>
        </div>
      </div>
    </header>
  );
}
