import { useState, useEffect } from 'react';
import type { User, Room, CheckInGuest, CheckOutGuest, ServiceRequest, Housekeeper, CleaningHistoryItem, CSStaff } from './types';
import { 
  generateInitialRooms, 
  INITIAL_CHECKINS, 
  INITIAL_CHECKOUTS, 
  INITIAL_SERVICE_REQUESTS 
} from './data/mockData';
import Login from './modules/auth/Login';
import Sidebar from './components/layouts/Sidebar';
import Header from './components/layouts/Header';
import ProfileSlideOut from './components/layouts/ProfileSlideOut';
import Dashboard from './modules/dashboard/Dashboard';
import RoomConsole from './modules/room/RoomConsole';
import { GuestManagement } from './modules/guest/GuestManagement';
import { ReservationManagement } from './modules/reservation/ReservationManagement';
import HousekeepingManagement from './modules/housekeeping/HousekeepingManagement';
import CustomerServiceManagement from './modules/customer-service/CustomerServiceManagement';
import FoodBeverageManagement, { INITIAL_TRANSACTIONS } from './modules/food-beverage/FoodBeverageManagement';
import type { FBTransaction } from './modules/food-beverage/FoodBeverageManagement';
import ReportsManagement from './modules/reports/ReportsManagement';
import MasterDataManagement from './modules/master/MasterDataManagement';

export default function App() {
  // Authentication states (Defaults to Administrator for instant simulation load)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>({
    nip: 'NIP-ADMIN',
    name: 'Administrator Utama',
    role: 'Administrator',
    pass: 'admin123'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'room' | 'guest' | 'reservation' | 'housekeeping' | 'cs' | 'fb' | 'reports' | 'master'>('dashboard');
  const [showProfileSlideOut, setShowProfileSlideOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulation Databases States
  const [rooms, setRooms] = useState<Room[]>(() => generateInitialRooms());
  const [checkins, setCheckins] = useState<CheckInGuest[]>(INITIAL_CHECKINS);
  const [checkouts, setCheckouts] = useState<CheckOutGuest[]>(INITIAL_CHECKOUTS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);

  // Lifted Housekeeping States for synchronization
  const [staffList, setStaffList] = useState<Housekeeper[]>([
    { id: 'HK-01', name: 'Tom Reeves', status: 'Working', assignedRooms: ['101', '102'] },
    { id: 'HK-02', name: 'Sarah Connor', status: 'Working', assignedRooms: ['204'] },
    { id: 'HK-03', name: 'Mike Jenkins', status: 'Offline', assignedRooms: [] },
    { id: 'HK-04', name: 'Agus Saputra', status: 'Offline', assignedRooms: [] },
  ]);

  // Lifted Customer Service States for synchronization & session management
  const [csStaffList, setCsStaffList] = useState<CSStaff[]>([
    { id: 'CS-01', name: 'John Doe', status: 'Working', assignedTickets: [2] },
    { id: 'CS-02', name: 'Sara W.', status: 'Working', assignedTickets: [] },
    { id: 'NIP-CS', name: 'Rina Lestari', status: 'Offline', assignedTickets: [] },
  ]);

  const [cleaningHistory, setCleaningHistory] = useState<CleaningHistoryItem[]>([
    { id: 'CL-901', roomNum: '103', roomType: 'Standard Room', housekeeperName: 'Tom Reeves', startTime: '08:15', endTime: '08:35', duration: '20 menit', status: 'Completed' },
    { id: 'CL-902', roomNum: '202', roomType: 'Deluxe Room', housekeeperName: 'Sarah Connor', startTime: '09:00', endTime: '09:25', duration: '25 menit', status: 'Completed' },
    { id: 'CL-903', roomNum: '305', roomType: 'Suite Room', housekeeperName: 'Mike Jenkins', startTime: '10:10', endTime: '10:45', duration: '35 menit', status: 'Completed' },
  ]);

  const [fbTransactions, setFbTransactions] = useState<FBTransaction[]>(INITIAL_TRANSACTIONS);

  // Live Clock Tick hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect to dashboard if activeTab is not allowed for the logged in user's role
  useEffect(() => {
    const roleAllowedTabs: Record<string, string[]> = {
      'Administrator': ['dashboard', 'room', 'guest', 'reservation', 'housekeeping', 'cs', 'fb', 'reports', 'master'],
      'Hotel Manager': ['dashboard', 'room', 'guest', 'reservation', 'housekeeping', 'cs', 'fb', 'reports', 'master'],
      'Front Office': ['dashboard', 'room', 'guest', 'reservation'],
      'Front Office Supervisor': ['dashboard', 'room', 'guest', 'reservation'],
      'Housekeeping': ['dashboard'],
      'Housekeeping Supervisor': ['dashboard'],
      'Customer Service': ['dashboard', 'cs'],
      'Food & Beverage': ['dashboard', 'fb']
    };
    
    if (loggedInUser) {
      const allowed = roleAllowedTabs[loggedInUser.role] || ['dashboard'];
      if (!allowed.includes(activeTab)) {
        setActiveTab('dashboard');
      }
    }
  }, [loggedInUser, activeTab]);

  // Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    setLoggedInUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setShowProfileSlideOut(false);
  };

  // Interactive Operations Handlers
  const handleCheckInAction = (id: number, roomNum: number) => {
    setCheckins(prev => prev.map(c => c.id === id ? { ...c, status: 'Checked In' } : c));
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'occupied' } : r));
  };

  const handleCheckOutAction = (id: number, roomNum: number) => {
    setCheckouts(prev => prev.map(c => c.id === id ? { ...c, status: 'Checked Out' } : c));
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'dirty' } : r));
  };

  const handleCleanRoomAction = (roomNum: number) => {
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'available', guestName: undefined } : r));
  };

  const handleResolveCSRequest = (id: number) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  // Helper Stats Calculations
  const totalRoomsCount = rooms.length;
  const availableCount = rooms.filter(r => r.status === 'available').length;
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const dirtyCount = rooms.filter(r => r.status === 'dirty').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  
  const todayCheckInCount = checkins.length;
  const todayCheckOutCount = checkouts.filter(c => c.status !== 'Checked Out').length;

  // Render Login page if not authenticated
  if (!isLoggedIn || !loggedInUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Active user workspace layout
  return (
    <div className="flex bg-[#F5F7FA] text-gray-800 font-sans min-h-screen">
      
      {/* LEFT NAVIGATION SIDEBAR */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        loggedInUser={loggedInUser} 
        setShowProfileSlideOut={setShowProfileSlideOut} 
      />

      {/* WORKSPACE CONTENT SHELL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <Header 
          activeTab={activeTab} 
          loggedInUser={loggedInUser} 
          currentTime={currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'} 
        />

        {/* MAIN PANEL CONTENT */}
        <main className="p-6 flex-1 bg-[#F5F7FA]">
          {activeTab === 'dashboard' && (
            <Dashboard 
              rooms={rooms}
              availableCount={availableCount}
              occupiedCount={occupiedCount}
              dirtyCount={dirtyCount}
              maintenanceCount={maintenanceCount}
              totalRoomsCount={totalRoomsCount}
              todayCheckInCount={todayCheckInCount}
              todayCheckOutCount={todayCheckOutCount}
              checkins={checkins}
              checkouts={checkouts}
              serviceRequests={serviceRequests}
              handleCheckInAction={handleCheckInAction}
              handleCheckOutAction={handleCheckOutAction}
              setActiveTab={setActiveTab}
              userRole={loggedInUser?.role || 'Administrator'}
              loggedInUser={loggedInUser}
              handleCleanRoomAction={handleCleanRoomAction}
              handleResolveCSRequest={handleResolveCSRequest}
              setServiceRequests={setServiceRequests}
              staffList={staffList}
              setStaffList={setStaffList}
              cleaningHistory={cleaningHistory}
              setCleaningHistory={setCleaningHistory}
              csStaffList={csStaffList}
              setCsStaffList={setCsStaffList}
              transactions={fbTransactions}
              setTransactions={setFbTransactions}
            />
          )}

          {activeTab === 'room' && (
            <RoomConsole 
              rooms={rooms}
              setRooms={setRooms}
              checkins={checkins}
              checkouts={checkouts}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'guest' && (
            <GuestManagement userRole={loggedInUser?.role} />
          )}

          {activeTab === 'reservation' && (
            <ReservationManagement 
              setActiveTab={setActiveTab} 
              userRole={loggedInUser?.role} 
            />
          )}



          {activeTab === 'housekeeping' && (
            <HousekeepingManagement 
              rooms={rooms}
              handleCleanRoomAction={handleCleanRoomAction}
              loggedInUser={loggedInUser || undefined}
              staffList={staffList}
              setStaffList={setStaffList}
              historyList={cleaningHistory}
              setHistoryList={setCleaningHistory}
            />
          )}

          {activeTab === 'cs' && (
            <CustomerServiceManagement 
              serviceRequests={serviceRequests}
              setServiceRequests={setServiceRequests}
              handleResolveCSRequest={handleResolveCSRequest}
              csStaffList={csStaffList}
              setCsStaffList={setCsStaffList}
            />
          )}

          {activeTab === 'fb' && (
            <FoodBeverageManagement 
              transactions={fbTransactions}
              setTransactions={setFbTransactions}
              loggedInUser={loggedInUser}
              serviceRequests={serviceRequests}
              setServiceRequests={setServiceRequests}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsManagement 
              rooms={rooms}
              serviceRequests={serviceRequests}
            />
          )}

          {activeTab === 'master' && (
            <MasterDataManagement />
          )}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 py-3 text-center text-[10px] text-gray-400 shrink-0">
          © 2026 SMA PERHOTELAN. Platform Simulasi Operasional Hotel Terintegrasi.
        </footer>

      </div>

      {/* USER PROFILE DRAWER SLIDE-OUT */}
      <ProfileSlideOut 
        isOpen={showProfileSlideOut} 
        onClose={() => setShowProfileSlideOut(false)} 
        loggedInUser={loggedInUser} 
        onLogout={handleLogout} 
      />

    </div>
  );
}
