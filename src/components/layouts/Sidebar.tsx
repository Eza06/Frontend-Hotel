import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  Calendar, 
  Brush, 
  ConciergeBell, 
  UtensilsCrossed, 
  BarChart3, 
  ChevronRight,
  Database
} from 'lucide-react';
import type { User } from '../../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'room' | 'guest' | 'reservation' | 'housekeeping' | 'cs' | 'fb' | 'reports' | 'master';
  setActiveTab: (tab: any) => void;
  loggedInUser: User;
  setShowProfileSlideOut: (show: boolean) => void;
}

const ROLE_ALLOWED_TABS: Record<string, string[]> = {
  'Administrator': ['dashboard', 'room', 'guest', 'reservation', 'housekeeping', 'cs', 'fb', 'reports', 'master'],
  'Hotel Manager': ['dashboard', 'room', 'guest', 'reservation', 'housekeeping', 'cs', 'fb', 'reports', 'master'],
  'Front Office': ['dashboard', 'room', 'guest', 'reservation'],
  'Front Office Supervisor': ['dashboard', 'room', 'guest', 'reservation'],
  'Housekeeping': ['dashboard'],
  'Housekeeping Supervisor': ['dashboard'],
  'Customer Service': ['dashboard', 'cs'],
  'Food & Beverage': ['dashboard', 'fb']
};

export default function Sidebar({ activeTab, setActiveTab, loggedInUser, setShowProfileSlideOut }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'room', label: 'Room & Floor Map', icon: BedDouble },
    { id: 'guest', label: 'Guest Management', icon: Users },
    { id: 'reservation', label: 'Booking & Reservation', icon: Calendar },
    { id: 'housekeeping', label: 'Housekeeping', icon: Brush },
    { id: 'cs', label: 'Customer Service', icon: ConciergeBell },
    { id: 'fb', label: 'Food & Beverage', icon: UtensilsCrossed },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'master', label: 'Master Data', icon: Database },
  ];

  const allowedTabs = ROLE_ALLOWED_TABS[loggedInUser.role] || ['dashboard'];
  const filteredNavItems = navItems.filter(item => allowedTabs.includes(item.id));

  return (
    <aside className="w-64 bg-[#1E3A5F] text-white flex flex-col justify-between shrink-0 z-20 shadow-lg border-r border-white/5 min-h-screen">
      <div>
        {/* School logo branding */}
        <div className="p-5 border-b border-white/10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-[#1E3A5F] rounded-lg flex items-center justify-center font-bold shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 20 5 20 12V19L12 22L4 19V12C4 5 12 2 12 2Z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 11V17H17V11H7Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <div className="font-extrabold tracking-wide text-sm leading-tight text-white">SMA PERHOTELAN</div>
            <div className="text-[9px] font-semibold text-gray-300 uppercase tracking-wider">Simulation System</div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-white text-[#1E3A5F] shadow-sm font-bold' 
                    : 'text-gray-200 hover:bg-white/5'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1E3A5F]' : 'text-gray-300'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile section at the bottom */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <button
          onClick={() => setShowProfileSlideOut(true)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shrink-0 group-hover:bg-white/30 transition-colors">
              {loggedInUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{loggedInUser.name}</p>
              <p className="text-[9px] text-gray-300 truncate mt-0.5 font-medium">{loggedInUser.role}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-white transition-colors" />
        </button>
      </div>
    </aside>
  );
}
