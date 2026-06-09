import { useState, useEffect } from 'react';
import type { User, Room, CheckInGuest, CheckOutGuest, ServiceRequest, FBOrder } from './types';
import { 
  generateInitialRooms, 
  INITIAL_CHECKINS, 
  INITIAL_CHECKOUTS, 
  INITIAL_SERVICE_REQUESTS, 
  INITIAL_FB_ORDERS 
} from './data/mockData';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileSlideOut from './components/ProfileSlideOut';
import Dashboard from './components/Dashboard';
import RoomConsole from './components/RoomConsole';
import { 
  GuestManagement, 
  ReservationManagement, 
  CheckInManagement, 
  CheckOutManagement, 
  HousekeepingManagement, 
  CustomerServiceManagement, 
  FoodBeverageManagement, 
  ReportsManagement, 
  SettingsManagement 
} from './components/SecondaryModules';

export default function App() {
  // Authentication states (Defaults to Administrator for instant simulation load)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<User | null>({
    nip: 'NIP-ADMIN',
    name: 'Budi Santoso',
    role: 'Administrator',
    pass: 'admin123'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'room' | 'guest' | 'reservation' | 'checkin' | 'checkout' | 'housekeeping' | 'cs' | 'fb' | 'reports' | 'settings'>('dashboard');
  const [showProfileSlideOut, setShowProfileSlideOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulation Databases States
  const [rooms, setRooms] = useState<Room[]>(() => generateInitialRooms());
  const [checkins, setCheckins] = useState<CheckInGuest[]>(INITIAL_CHECKINS);
  const [checkouts, setCheckouts] = useState<CheckOutGuest[]>(INITIAL_CHECKOUTS);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [fbOrders, setFbOrders] = useState<FBOrder[]>(INITIAL_FB_ORDERS);

  // Live Clock Tick hook
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    setRooms(prev => prev.map(r => r.id === roomNum ? { ...r, status: 'available' } : r));
  };

  const handleResolveCSRequest = (id: number) => {
    setServiceRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  const handleDeliverFBOrder = (id: number) => {
    setFbOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Delivered' } : o));
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

          {activeTab === 'guest' && <GuestManagement />}

          {activeTab === 'reservation' && <ReservationManagement setActiveTab={setActiveTab} />}

          {activeTab === 'checkin' && (
            <CheckInManagement 
              checkins={checkins}
              handleCheckInAction={handleCheckInAction}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckOutManagement 
              checkouts={checkouts}
              handleCheckOutAction={handleCheckOutAction}
            />
          )}

          {activeTab === 'housekeeping' && (
            <HousekeepingManagement 
              rooms={rooms}
              handleCleanRoomAction={handleCleanRoomAction}
            />
          )}

          {activeTab === 'cs' && (
            <CustomerServiceManagement 
              serviceRequests={serviceRequests}
              setServiceRequests={setServiceRequests}
              handleResolveCSRequest={handleResolveCSRequest}
            />
          )}

          {activeTab === 'fb' && (
            <FoodBeverageManagement 
              fbOrders={fbOrders}
              setFbOrders={setFbOrders}
              handleDeliverFBOrder={handleDeliverFBOrder}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsManagement 
              rooms={rooms}
              serviceRequests={serviceRequests}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsManagement 
              onReset={() => setRooms(generateInitialRooms())}
            />
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
