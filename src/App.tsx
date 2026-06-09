import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  HelpCircle, 
  Smartphone, 
  ShieldAlert, 
  LogOut, 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  CalendarDays, 
  FileSpreadsheet, 
  UtensilsCrossed, 
  ConciergeBell, 
  Brush,
  ArrowRight,
  Settings,
  Search,
  Clock,
  Plus,
  UserCheck,
  UserX,
  Sparkles,
  Wrench,
  Check,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';

// Demo credentials list
const DEMO_ACCOUNTS = [
  { nip: 'NIP-ADMIN', name: 'Budi Santoso', role: 'Administrator', pass: 'admin123' },
  { nip: 'NIP-FO', name: 'Siti Rahma', role: 'Front Office Supervisor', pass: 'fo123' },
  { nip: 'NIP-MGR', name: 'Hendra Wijaya', role: 'Hotel Manager', pass: 'mgr123' }
];

// Helper to generate 120 rooms matching exact distribution: 78 occupied, 32 available, 10 dirty, 2 maintenance
function generateInitialRooms() {
  const rooms = [];
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential Suite'];
  
  // Set counts to distribute
  let occupiedLeft = 78;
  let availableLeft = 32;
  let dirtyLeft = 10;
  let maintenanceLeft = 2;

  // Let's create room numbers from 101 to 220 (120 rooms)
  for (let i = 101; i <= 220; i++) {
    let status: 'available' | 'occupied' | 'dirty' | 'maintenance' = 'available';
    let type = roomTypes[(i % roomTypes.length)];
    
    // Distribute statuses systematically
    if (occupiedLeft > 0 && (i % 5 !== 0 || availableLeft === 0)) {
      status = 'occupied';
      occupiedLeft--;
    } else if (availableLeft > 0) {
      status = 'available';
      availableLeft--;
    } else if (dirtyLeft > 0) {
      status = 'dirty';
      dirtyLeft--;
    } else if (maintenanceLeft > 0) {
      status = 'maintenance';
      maintenanceLeft--;
    } else {
      // Fallback
      status = 'available';
    }

    rooms.push({
      id: i,
      type,
      status,
      price: type === 'Standard' ? 350000 : type === 'Deluxe' ? 600000 : type === 'Suite' ? 1200000 : 2500000,
      floor: Math.floor((i - 100) / 40) + 1
    });
  }
  return rooms;
}

export default function App() {
  // Authentication states
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<typeof DEMO_ACCOUNTS[0] | null>(DEMO_ACCOUNTS[0]);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);

  // System Core State (Preserved and interactive in memory for live demo)
  const [rooms, setRooms] = useState(() => generateInitialRooms());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'room' | 'guest' | 'reservation' | 'checkin' | 'checkout' | 'housekeeping' | 'cs' | 'fb' | 'reports' | 'settings'>('dashboard');
  const [showProfileSlideOut, setShowProfileSlideOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Guest simulation lists
  const [checkins, setCheckins] = useState([
    { id: 1, name: 'Margaret Holloway', roomType: 'Suite', roomNum: 112, time: '09:30 AM', status: 'Pending' },
    { id: 2, name: 'Daniel Osei', roomType: 'Standard', roomNum: 121, time: '02:00 PM', status: 'Pending' },
    { id: 3, name: 'Robert Kimani', roomType: 'Deluxe', roomNum: 104, time: '04:30 PM', status: 'Scheduled' },
    { id: 4, name: 'Amara Diallo', roomType: 'Standard', roomNum: 210, time: '07:45 AM', status: 'Checked In' },
  ]);

  const [checkouts, setCheckouts] = useState([
    { id: 1, name: 'Yuki Tanaka', roomNum: 119, time: '10:00 AM', balance: 0, status: 'Pending' },
    { id: 2, name: 'James Whitfield', roomNum: 208, time: '11:00 AM', balance: 0, status: 'Pending' },
    { id: 3, name: 'Claire Dupont', roomNum: 207, time: '12:00 PM', balance: 1200000, status: 'Pending' },
    { id: 4, name: 'Lena Hoffmann', roomNum: 103, time: '07:20 AM', balance: 0, status: 'Checked Out' },
  ]);

  const [serviceRequests, setServiceRequests] = useState([
    { id: 1, roomNum: 107, item: 'Handuk tambahan', status: 'Pending' },
    { id: 2, roomNum: 115, item: 'AC kurang dingin (panggil teknisi)', status: 'On Progress' },
    { id: 3, roomNum: 202, item: 'Sajadah & Mukena ekstra', status: 'Pending' },
  ]);

  const [fbOrders, setFbOrders] = useState([
    { id: 1, roomNum: 105, item: 'Nasi Goreng & Teh Manis', qty: 2, status: 'Pending', price: 90000 },
    { id: 2, roomNum: 204, item: 'Club Sandwich & Jus Jeruk', qty: 1, status: 'On Progress', price: 65000 },
  ]);

  // Live clock hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handler for login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!nip || !password) {
      setErrorMessage('NIP dan Kata Sandi wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const match = DEMO_ACCOUNTS.find(
        acc => acc.nip.toUpperCase() === nip.toUpperCase().trim() && acc.pass === password
      );

      setIsSubmitting(false);

      if (match) {
        setLoggedInUser(match);
        setIsLoggedIn(true);
      } else {
        setErrorMessage('NIP atau Kata Sandi salah. Gunakan akun demo di sebelah kanan.');
      }
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setShowProfileSlideOut(false);
    setPassword('');
    setNip('');
  };

  // Helper to fill login credentials directly from simulation box
  const fillDemoAccount = (account: typeof DEMO_ACCOUNTS[0]) => {
    setNip(account.nip);
    setPassword(account.pass);
    setErrorMessage('');
  };

  // Helper calculations for dynamic KPI values
  const countRoomsByStatus = (status: 'available' | 'occupied' | 'dirty' | 'maintenance') => {
    return rooms.filter(r => r.status === status).length;
  };

  const availableCount = countRoomsByStatus('available');
  const occupiedCount = countRoomsByStatus('occupied');
  const dirtyCount = countRoomsByStatus('dirty');
  const maintenanceCount = countRoomsByStatus('maintenance');
  const totalRoomsCount = rooms.length;

  const activeCSRequests = serviceRequests.filter(r => r.status !== 'Resolved').length;
  const todayCheckInCount = checkins.length;
  const todayCheckOutCount = checkouts.filter(c => c.status !== 'Checked Out').length;

  // Interactive functions for live presentation
  const handleCheckInAction = (id: number, roomNum: number) => {
    // 1. Set checkin guest status to checked in
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'Checked In' } : c));
    // 2. Set room status to occupied
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'occupied' } : r));
  };

  const handleCheckOutAction = (id: number, roomNum: number) => {
    // 1. Set checkout guest status to Checked Out
    setCheckouts(prev => prev.map(c => c.id === id ? { ...c, status: 'Checked Out' } : c));
    // 2. Set room status to dirty (since guest just left)
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'dirty' } : r));
  };

  const handleCleanRoomAction = (roomNum: number) => {
    // Set room status to available clean
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'available' } : r));
  };

  const handleResolveCSRequest = (id: number) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  const handleDeliverFBOrder = (id: number) => {
    setFbOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o));
  };

  const handleRoomStatusChange = (roomId: number, newStatus: 'available' | 'occupied' | 'dirty' | 'maintenance') => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
  };

  // Render Login Page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white text-[#1E3A5F] flex flex-col md:flex-row font-sans overflow-x-hidden selection:bg-[#1E3A5F] selection:text-white">
        
        {/* Left Column: School branding & Info overlay */}
        <div className="md:w-1/2 bg-[#1E3A5F] text-white flex flex-col justify-between p-8 md:p-12 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-login" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-login)" />
            </svg>
          </div>
          
          {/* Top left branding */}
          <div className="flex items-center space-x-3 z-10">
            <div className="w-12 h-12 bg-white text-[#1E3A5F] rounded-xl flex items-center justify-center shadow-lg font-bold shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 14V17H15V14M12 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11V17H17V11H7Z" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold tracking-wide text-lg text-white leading-tight">SMA PERHOTELAN</div>
              <div className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest leading-none">Hotel Simulation System</div>
            </div>
          </div>

          {/* Center Info Text */}
          <div className="my-12 md:my-auto max-w-lg z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full mr-2 animate-pulse"></span>
              Sistem Simulasi Aktif
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Portal Operasional Staf
            </h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light">
              Platform simulasi operasional hotel yang dirancang untuk mendukung pembelajaran reservasi, layanan tamu, housekeeping, dan manajemen hotel secara terintegrasi.
            </p>
          </div>

          <div className="text-xs text-gray-400 font-light mt-8 md:mt-0 z-10">
            © 2026 SMA PERHOTELAN. Untuk Kebutuhan Pembelajaran Internal.
          </div>
        </div>

        {/* Right Column: Clean Login Form */}
        <div className="md:w-1/2 bg-white flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32 relative">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8 text-left">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Staff Authentication</div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#1E3A5F]">Selamat datang kembali</h3>
              <p className="text-gray-500 text-xs mt-1">Harap masuk untuk mengakses ruang kerja sesuai tugas Anda.</p>
            </div>

            {/* Login form code */}
            <form onSubmit={handleLogin} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-red-700 text-xs">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
                  <div>
                    <span className="font-bold">Masalah Masuk Sistem:</span>
                    <p className="mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="nip" className="block text-xs font-bold uppercase tracking-wider text-[#1E3A5F] mb-2">
                  NIP / ID Karyawan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="nip"
                    name="nip"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="Contoh: NIP-FO"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all bg-[#F5F7FA] text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-[#1E3A5F] mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi Anda"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all bg-[#F5F7FA] text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded-md border-gray-300 text-[#1E3A5F] focus:ring-[#1E3A5F]/30 focus:ring-offset-0 mr-2 bg-gray-50 cursor-pointer"
                  />
                  Tetap masuk untuk shift ini
                </label>
                <button 
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-bold text-[#1E3A5F] hover:underline focus:outline-none"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-[#1E3A5F] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#1E3A5F]/90 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>MENGHUBUNGKAN...</span>
                ) : (
                  <>
                    <span>MASUK KE WORKSPACE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Help Contact */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-left">
              <div className="flex items-start space-x-3 text-xs text-gray-500">
                <HelpCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-700">Butuh bantuan masuk?</span>
                  <p className="mt-0.5">Silakan hubungi Administrator simulasi.</p>
                  <div className="mt-2 flex items-center space-x-1.5 font-bold text-[#1E3A5F] hover:text-[#1E3A5F]/80">
                    <Smartphone className="w-3.5 h-3.5" />
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
                      WhatsApp: 0812-3456-7890
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-gray-400 flex items-center justify-center space-x-1">
              <span>🔒 Enkripsi 256-bit</span>
              <span>•</span>
              <span>Sesi berakhir dalam 8 jam</span>
              <span>•</span>
              <span>Akses terawasi</span>
            </div>
          </div>
        </div>

        {/* Demo Helper Box */}
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white border border-gray-200 p-4 rounded-xl shadow-xl z-50 text-left hidden lg:block">
          <div className="flex items-start space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#1E3A5F]">Papan Uji Akun Simulasi</h4>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Klik salah satu akun di bawah untuk mengisi form login secara instan:
              </p>
              <div className="mt-3 space-y-1.5">
                {DEMO_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillDemoAccount(acc)}
                    className="w-full text-left px-2 py-1 rounded bg-[#F5F7FA] hover:bg-[#1E3A5F]/5 border border-gray-200 hover:border-[#1E3A5F]/20 text-[10px] flex items-center justify-between transition-colors cursor-pointer group"
                  >
                    <span className="font-semibold text-[#1E3A5F] font-mono">{acc.nip}</span>
                    <span className="text-gray-400 group-hover:text-[#1E3A5F] transition-colors">{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-md w-full p-6 text-left relative">
              <h4 className="text-lg font-bold text-[#1E3A5F] mb-2">Lupa Kata Sandi?</h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Untuk alasan keamanan simulasi, silakan hubungi guru pendamping atau administrator laboratorium hotel.
              </p>
              <div className="bg-[#F5F7FA] p-3.5 rounded-lg mb-6 border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak Administrator</span>
                <p className="text-sm font-bold text-[#1E3A5F] mt-1 flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-[#1E3A5F]" />
                  <span>WhatsApp: 0812-3456-7890</span>
                </p>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-full py-2 bg-[#1E3A5F] text-white rounded-lg text-sm font-bold cursor-pointer"
              >
                Tutup Dialog
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-800 flex font-sans overflow-x-hidden selection:bg-[#1E3A5F] selection:text-white">
      
      {/* LEFT NAVIGATION SIDEBAR (Navy Background) */}
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

          {/* Sidebar Menu Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'room', label: 'Room', icon: BedDouble },
              { id: 'guest', label: 'Guest Management', icon: Users },
              { id: 'reservation', label: 'Reservation Management', icon: CalendarDays },
              { id: 'checkin', label: 'Check In', icon: UserCheck },
              { id: 'checkout', label: 'Check Out', icon: UserX },
              { id: 'housekeeping', label: 'Housekeeping', icon: Brush },
              { id: 'cs', label: 'Customer Service', icon: ConciergeBell },
              { id: 'fb', label: 'Food & Beverage', icon: UtensilsCrossed },
              { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all text-left cursor-pointer group ${
                    isActive 
                      ? 'bg-white/10 text-white font-bold border-l-4 border-green-400 pl-3' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile placed at the bottom of the sidebar */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setShowProfileSlideOut(true)}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-bold text-xs text-white border border-white/20">
              {loggedInUser?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">{loggedInUser?.name}</p>
              <p className="text-[9px] text-gray-400 truncate uppercase tracking-wider">{loggedInUser?.role}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER BAR */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
          
          {/* Page Title */}
          <div>
            <h1 className="text-lg font-bold text-[#1E3A5F] tracking-tight uppercase">
              {activeTab === 'dashboard' ? 'Overview Operasional Hotel' : `${activeTab.replace(/^\w/, c => c.toUpperCase())} Workspace`}
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Portal Simulasi Staff</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md w-full mx-6 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kamar, reservasi, nama tamu, atau layanan..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs placeholder-gray-400 bg-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] transition-all"
              />
            </div>
          </div>

          {/* Current Date & Time Ticking */}
          <div className="flex items-center space-x-2 text-[#1E3A5F]">
            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
            <div className="text-right">
              <p className="text-xs font-bold leading-tight">
                {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-semibold text-gray-500 font-mono tracking-wider">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>

        </header>

        {/* MAIN BODY SCROLLABLE */}
        <main className="flex-1 p-6">
          
          {/* TAB 1: MAIN OPERATIONS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* KPI CARDS (3x2 Grid Layout) */}
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Statistik Operasional Utama</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card 1: Available Rooms (Green style) */}
                  <div className="bg-white p-5 rounded-xl border border-green-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Kamar Tersedia (Available)</p>
                      <h3 className="text-3xl font-extrabold text-green-600 mt-1">{availableCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Siap untuk Tamu Baru</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: Occupied Rooms (Blue style) */}
                  <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Kamar Terisi (Occupied)</p>
                      <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{occupiedCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Okupansi: {Math.round((occupiedCount / totalRoomsCount) * 100)}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <BedDouble className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: Dirty Rooms (Orange style) */}
                  <div className="bg-white p-5 rounded-xl border border-orange-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Kamar Kotor (Dirty)</p>
                      <h3 className="text-3xl font-extrabold text-orange-600 mt-1">{dirtyCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Butuh Pembersihan Staf</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <Brush className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 4: Today's Check In */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kedatangan Hari Ini (Check-In)</p>
                      <h3 className="text-3xl font-extrabold text-[#1E3A5F] mt-1">{todayCheckInCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {checkins.filter(c => c.status === 'Checked In').length} Berhasil Masuk
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#1E3A5F] shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 5: Today's Check Out */}
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Keberangkatan Hari Ini (Check-Out)</p>
                      <h3 className="text-3xl font-extrabold text-[#1E3A5F] mt-1">{todayCheckOutCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {checkouts.filter(c => c.status === 'Checked Out').length} Berhasil Keluar
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[#1E3A5F] shrink-0">
                      <UserX className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 6: Maintenance Rooms (Red style) */}
                  <div className="bg-white p-5 rounded-xl border border-red-200 shadow-3xs flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Perbaikan (Maintenance)</p>
                      <h3 className="text-3xl font-extrabold text-red-600 mt-1">{maintenanceCount}</h3>
                      <p className="text-[10px] text-gray-500 mt-1">Kamar Sedang Diperbaiki</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                      <Wrench className="w-6 h-6" />
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 1: CHECK-IN & CHECK-OUT ACTIVITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Check-In Activity */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Aktivitas Kedatangan (Check-In)</h3>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded border border-green-200">
                      {checkins.filter(c => c.status === 'Pending').length} Antrean
                    </span>
                  </div>
                  <div className="space-y-3">
                    {checkins.map(ci => (
                      <div key={ci.id} className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-xs font-extrabold text-[#1E3A5F]">{ci.name}</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                            Kamar {ci.roomNum} ({ci.roomType}) • Kedatangan: {ci.time}
                          </p>
                        </div>
                        <div>
                          {ci.status === 'Checked In' ? (
                            <span className="px-2.5 py-1 bg-green-50 text-green-600 text-[9px] font-bold rounded-full border border-green-200 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span>Masuk</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCheckInAction(ci.id, ci.roomNum)}
                              className="px-3 py-1 bg-[#1E3A5F] text-white text-[9px] font-bold rounded-lg hover:bg-[#1E3A5F]/95 transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Check-In</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check-Out Activity */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Aktivitas Kepulangan (Check-Out)</h3>
                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded border border-orange-200">
                      {checkouts.filter(c => c.status === 'Pending').length} Pending
                    </span>
                  </div>
                  <div className="space-y-3">
                    {checkouts.map(co => (
                      <div key={co.id} className="p-3.5 rounded-lg border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-xs font-extrabold text-[#1E3A5F]">{co.name}</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                            Kamar {co.roomNum} • Jadwal: {co.time} • Tagihan: {co.balance === 0 ? 'Lunas' : `Rp ${co.balance.toLocaleString('id-ID')}`}
                          </p>
                        </div>
                        <div>
                          {co.status === 'Checked Out' ? (
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[9px] font-bold rounded-full border border-gray-200 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                              <span>Keluar</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleCheckOutAction(co.id, co.roomNum)}
                              className="px-3 py-1 bg-red-600 text-white text-[9px] font-bold rounded-lg hover:bg-red-700 transition-all flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Check-Out</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* SECTION 2: LIVE QUEUE & STAFF ON DUTY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Live Queue (Antrean Langsung) */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-[#1E3A5F] shrink-0" />
                      <span>Antrean Operasional Langsung (Live Queue)</span>
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Queue 1: Pending Check-In */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kedatangan Pending</p>
                      <div className="space-y-2">
                        {checkins.filter(c => c.status === 'Pending').map(c => (
                          <div key={c.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{c.name} (Kamar {c.roomNum})</span>
                            <span className="text-[9px] font-bold text-[#1E3A5F] uppercase tracking-wider bg-[#1E3A5F]/10 px-2 py-0.5 rounded">Menunggu FO</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Queue 2: Pending Check-Out */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Keberangkatan Pending</p>
                      <div className="space-y-2">
                        {checkouts.filter(c => c.status === 'Pending').map(c => (
                          <div key={c.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{c.name} (Kamar {c.roomNum})</span>
                            <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded border border-orange-200">Menunggu Billing</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Queue 3: Pending Service Requests */}
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Permintaan Layanan Tamu</p>
                      <div className="space-y-2">
                        {serviceRequests.filter(s => s.status !== 'Resolved').map(s => (
                          <div key={s.id} className="px-3 py-2 bg-[#F5F7FA] border border-gray-200 rounded-lg text-xs flex items-center justify-between">
                            <span className="font-semibold text-gray-700">Kamar {s.roomNum}: {s.item}</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              s.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff Duty */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xs font-extrabold text-[#1E3A5F] uppercase tracking-wider">Jadwal Tugas Staf Aktif (Staff Duty)</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { dept: 'Front Office', name: 'Ana Morales (FO Supervisor)', status: 'Online' },
                      { dept: 'Housekeeping', name: 'Tom Reeves (Pembersihan Kamar)', status: 'Online' },
                      { dept: 'Customer Service', name: 'Gao Achebe (Pelayanan Kamar)', status: 'Offline' },
                      { dept: 'Food & Beverage', name: 'Nina Sato (Room Service POS)', status: 'Online' },
                    ].map((stf, index) => {
                      const isOnline = stf.status === 'Online';
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#F5F7FA] border border-gray-200 rounded-lg">
                          <div>
                            <p className="text-[10px] font-bold text-[#1E3A5F] uppercase tracking-wider">{stf.dept}</p>
                            <p className="text-xs font-extrabold text-gray-800 mt-0.5">{stf.name}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded border ${
                              isOnline 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              {stf.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ROOM MANAGEMENT (PETA KAMAR DENGAN 120 KAMAR INTERAKTIF) */}
          {activeTab === 'room' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-[#1E3A5F]">Peta Kamar Simulasi (120 Kamar)</h2>
                <p className="text-xs text-gray-500">Klik salah satu kotak kamar untuk langsung mengubah status kamar secara interaktif.</p>
              </div>

              {/* Status Filters Info */}
              <div className="flex flex-wrap gap-4 mb-6 text-xs font-semibold">
                <span className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-[#22C55E] rounded"></span> <span>Tersedia/Clean ({availableCount})</span></span>
                <span className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-[#3B82F6] rounded"></span> <span>Terisi/Occupied ({occupiedCount})</span></span>
                <span className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-[#F97316] rounded"></span> <span>Kotor/Dirty ({dirtyCount})</span></span>
                <span className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-[#EF4444] rounded"></span> <span>Perbaikan/Maintenance ({maintenanceCount})</span></span>
              </div>

              {/* Room Map Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-[500px] overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-200">
                {rooms.map(room => {
                  let statusBg = 'bg-[#22C55E]'; // Available
                  if (room.status === 'occupied') statusBg = 'bg-[#3B82F6]';
                  else if (room.status === 'dirty') statusBg = 'bg-[#F97316]';
                  else if (room.status === 'maintenance') statusBg = 'bg-[#EF4444]';

                  return (
                    <div 
                      key={room.id}
                      className="relative group"
                    >
                      <button
                        className={`w-full py-3.5 rounded-lg text-white font-extrabold text-xs shadow-2xs hover:scale-105 hover:brightness-105 active:scale-95 transition-all text-center cursor-pointer ${statusBg}`}
                      >
                        {room.id}
                      </button>
                      
                      {/* Hover Popover to Change Status Instantly */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-3.5 hidden group-hover:block group-focus-within:block z-30 text-xs text-gray-800">
                        <p className="font-extrabold text-[#1E3A5F] mb-1">Kamar {room.id}</p>
                        <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">{room.type}</p>
                        
                        <div className="space-y-1.5">
                          <button 
                            onClick={() => handleRoomStatusChange(room.id, 'available')}
                            className="w-full text-left px-2 py-1 hover:bg-green-50 text-green-700 font-bold rounded flex items-center space-x-1"
                          >
                            <span className="w-2 h-2 bg-[#22C55E] rounded-full mr-1"></span> Set Tersedia
                          </button>
                          <button 
                            onClick={() => handleRoomStatusChange(room.id, 'occupied')}
                            className="w-full text-left px-2 py-1 hover:bg-blue-50 text-blue-700 font-bold rounded flex items-center space-x-1"
                          >
                            <span className="w-2 h-2 bg-[#3B82F6] rounded-full mr-1"></span> Set Terisi
                          </button>
                          <button 
                            onClick={() => handleRoomStatusChange(room.id, 'dirty')}
                            className="w-full text-left px-2 py-1 hover:bg-orange-50 text-orange-700 font-bold rounded flex items-center space-x-1"
                          >
                            <span className="w-2 h-2 bg-[#F97316] rounded-full mr-1"></span> Set Kotor
                          </button>
                          <button 
                            onClick={() => handleRoomStatusChange(room.id, 'maintenance')}
                            className="w-full text-left px-2 py-1 hover:bg-red-50 text-red-700 font-bold rounded flex items-center space-x-1"
                          >
                            <span className="w-2 h-2 bg-[#EF4444] rounded-full mr-1"></span> Set Perbaikan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: GUEST MANAGEMENT */}
          {activeTab === 'guest' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-[#1E3A5F]">Database Profil Tamu Hotel</h2>
                <p className="text-xs text-gray-500">Daftar riwayat tamu yang terdaftar di sistem simulasi.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-500">
                  <thead className="text-[10px] text-gray-700 uppercase bg-gray-50 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Nama Tamu</th>
                      <th className="px-4 py-3">No. Identitas (KTP/Paspor)</th>
                      <th className="px-4 py-3">Kontak Tamu</th>
                      <th className="px-4 py-3">Status Reservasi</th>
                      <th className="px-4 py-3">Preferensi Kamar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-semibold text-gray-800">
                    {[
                      { name: 'Margaret Holloway', idCard: '3273051234567890', phone: '0812-4456-7788', status: 'Checked In', pref: 'Bantal Tambahan, Non-Smoking' },
                      { name: 'Daniel Osei', idCard: '5171029876543210', phone: '0813-9988-1122', status: 'Pending Arrival', pref: 'Dekat Lift' },
                      { name: 'Yuki Tanaka', idCard: 'A12345678', phone: '0811-3344-5566', status: 'Checking Out', pref: 'Lantai Tinggi' },
                      { name: 'Claire Dupont', idCard: 'F9876543', phone: '0812-7788-9900', status: 'In House', pref: 'Double Bed, Pemandangan Kota' },
                    ].map((guest, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-extrabold text-[#1E3A5F]">{guest.name}</td>
                        <td className="px-4 py-3 font-mono">{guest.idCard}</td>
                        <td className="px-4 py-3">{guest.phone}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[9px] bg-blue-50 border border-blue-200 text-[#1E3A5F] uppercase font-bold">
                            {guest.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-light">{guest.pref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RESERVATION MANAGEMENT */}
          {activeTab === 'reservation' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left max-w-xl mx-auto">
              <div className="border-b pb-3 mb-5">
                <h2 className="text-lg font-bold text-[#1E3A5F]">Pencatatan Reservasi Baru (Advance Booking)</h2>
                <p className="text-xs text-gray-500">Gunakan form di bawah untuk mendaftarkan reservasi tamu masa mendatang.</p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Pencatatan Reservasi Simulasi Berhasil Ditambahkan!');
                setActiveTab('dashboard');
              }} className="space-y-4 text-xs font-semibold text-[#1E3A5F]">
                <div>
                  <label className="block mb-1 font-bold">NAMA TAMU</label>
                  <input type="text" placeholder="Masukkan nama lengkap tamu" className="w-full p-2.5 border rounded-lg" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold">TANGGAL CHECK-IN</label>
                    <input type="date" className="w-full p-2.5 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block mb-1 font-bold">TANGGAL CHECK-OUT</label>
                    <input type="date" className="w-full p-2.5 border rounded-lg" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-bold">TIPE KAMAR</label>
                    <select className="w-full p-2.5 border rounded-lg">
                      <option>Standard Room</option>
                      <option>Deluxe Room</option>
                      <option>Suite Room</option>
                      <option>Presidential Suite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-bold">DEPOSIT JAMINAN (RP)</label>
                    <input type="number" defaultValue="200000" className="w-full p-2.5 border rounded-lg" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#1E3A5F] text-white font-bold rounded-lg cursor-pointer hover:bg-[#1E3A5F]/90 transition-all">
                  SIMPAN RESERVASI KAMAR
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: CHECK IN */}
          {activeTab === 'checkin' && (
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
          )}

          {/* TAB 6: CHECK OUT */}
          {activeTab === 'checkout' && (
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
          )}

          {/* TAB 7: HOUSEKEEPING */}
          {activeTab === 'housekeeping' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-[#1E3A5F]">Manajemen Pembersihan Kamar (Housekeeping)</h2>
                <p className="text-xs text-gray-500">Daftar kamar dengan status kotor (*Dirty*) yang harus dibersihkan oleh staf.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {rooms.filter(r => r.status === 'dirty').map(room => (
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
                
                {rooms.filter(r => r.status === 'dirty').length === 0 && (
                  <div className="col-span-full py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Check className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-600">Semua Kamar Bersih!</p>
                    <p className="text-xs text-gray-400">Tidak ada kamar kotor dalam antrean pembersihan saat ini.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: CUSTOMER SERVICE */}
          {activeTab === 'cs' && (
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
          )}

          {/* TAB 9: FOOD & BEVERAGE */}
          {activeTab === 'fb' && (
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
                      <p className="text-[10px] text-gray-500 mt-0.5">Biaya: Rp {ord.price.toLocaleString('id-ID')} (Masuk tagihan akhir kamar)</p>
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
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
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
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-3xs text-left max-w-lg mx-auto">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-lg font-bold text-[#1E3A5F]">Pengaturan Simulasi HMS</h2>
                <p className="text-xs text-gray-500">Kustomisasi parameter simulasi laboratorium sekolah.</p>
              </div>
              <div className="space-y-4 text-xs font-semibold text-[#1E3A5F]">
                <div>
                  <label className="block mb-1 font-bold">MODE SIMULASI</label>
                  <select className="w-full p-2.5 border rounded-lg">
                    <option>Mode Pembelajaran Mandiri (Default)</option>
                    <option>Mode Ujian Praktik Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold">RESET DATABASE SIMULASI</label>
                  <button 
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menyetel ulang database simulasi ke pengaturan demo awal?')) {
                        setRooms(generateInitialRooms());
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
          )}

        </main>
        
        {/* Footnotes */}
        <footer className="bg-white border-t border-gray-200 py-3 text-center text-[10px] text-gray-400">
          © 2026 SMA PERHOTELAN. Platform Simulasi Operasional Hotel Terintegrasi.
        </footer>

      </div>

      {/* USER PROFILE SLIDE-OUT MENU (Right side) */}
      {showProfileSlideOut && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setShowProfileSlideOut(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Drawer Panel */}
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 transition-transform duration-300 text-left">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <h3 className="text-sm font-extrabold text-[#1E3A5F] uppercase tracking-wider">Profil Staf Aktif</h3>
                <button 
                  onClick={() => setShowProfileSlideOut(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity Profile Card */}
              <div className="flex flex-col items-center text-center p-4 bg-[#F5F7FA] rounded-xl border border-gray-200 mb-6">
                <div className="w-16 h-16 bg-[#1E3A5F] rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md mb-3">
                  {loggedInUser?.name.charAt(0)}
                </div>
                <h4 className="text-sm font-extrabold text-gray-800">{loggedInUser?.name}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">{loggedInUser?.role}</p>
                <span className="mt-3 px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[9px] font-bold rounded-full">
                  Status: Aktif Shift Pagi
                </span>
              </div>

              {/* Shift details */}
              <div className="space-y-3 text-xs font-semibold text-gray-600">
                <div className="flex justify-between border-b pb-2">
                  <span>NIP Karyawan:</span>
                  <span className="font-mono text-gray-800">{loggedInUser?.nip}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Waktu Masuk:</span>
                  <span className="text-gray-800">07:00 WIB</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Sisa Sesi Login:</span>
                  <span className="text-gray-800 font-mono">07 Jam 45 Menit</span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs tracking-wider transition-all cursor-pointer shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>KELUAR DARI WORKSPACE</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
