import type { Room, CheckInGuest, CheckOutGuest, ServiceRequest, FBOrder } from '../types';

const MOCK_GUEST_NAMES = [
  'Margaret Holloway', 'Daniel Osei', 'Robert Kimani', 'Amara Diallo',
  'Yuki Tanaka', 'James Whitfield', 'Claire Dupont', 'Lena Hoffmann',
  'James Whitmore', 'Priya Sharma', 'Tom Nguyen', 'Lena Fischer',
  'Carlos Mendez', 'Fatima Al-Rashid', 'Pavel Novak', 'Hannah Moore',
  'Kwame Asante', 'Sophie Laurent', 'Michael Chen', 'Ines Rodrigues',
  'Omar Khalil', 'Natasha Ivanova', 'Elena & Marco Rossi', 'David Kim',
  'Kofi Diallo', 'Ben Hartley', 'Maria Santos', 'Chen Wei', 'Aisha Bello',
  'Sarah Jenkins', 'Liam Carter', 'Min-Ji Woo', 'Sofia Rodriguez',
  'Ahmed Mansour', 'Olga Smirnova', 'Hans Schmidt', 'Jean Dupont'
];

export function generateInitialRooms(): Room[] {
  const rooms: Room[] = [];
  
  // Target counts to distribute
  let occupiedLeft = 78;
  let availableLeft = 32;
  let dirtyLeft = 10;
  let maintenanceLeft = 2;

  let nameIndex = 0;

  // 12 floors, 10 rooms per floor = 120 rooms total
  for (let floor = 1; floor <= 12; floor++) {
    for (let rIndex = 1; rIndex <= 10; rIndex++) {
      const roomId = floor * 100 + rIndex;
      
      // Determine systematic room type
      let type: Room['type'] = 'Standard';
      if (rIndex === 9 || rIndex === 10) type = 'Presidential Suite';
      else if (rIndex === 7 || rIndex === 8) type = 'Suite';
      else if (rIndex === 4 || rIndex === 5 || rIndex === 6) type = 'Deluxe';
      else type = 'Standard';

      // Distribute statuses systematically
      let status: Room['status'] = 'available';
      if (occupiedLeft > 0 && (roomId % 3 !== 0 || availableLeft === 0)) {
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
        status = 'available';
      }

      // Assign guest name if occupied
      let guestName: string | undefined = undefined;
      if (status === 'occupied') {
        guestName = MOCK_GUEST_NAMES[nameIndex % MOCK_GUEST_NAMES.length];
        nameIndex++;
      }

      rooms.push({
        id: roomId,
        type,
        status,
        price: type === 'Standard' ? 350000 : type === 'Deluxe' ? 600000 : type === 'Suite' ? 1200000 : 2500000,
        floor,
        guestName
      });
    }
  }

  return rooms;
}

export const INITIAL_CHECKINS: CheckInGuest[] = [
  { id: 1, name: 'Margaret Holloway', roomType: 'Suite', roomNum: 108, time: '09:30 AM', status: 'Pending' },
  { id: 2, name: 'Daniel Osei', roomType: 'Standard', roomNum: 202, time: '02:00 PM', status: 'Pending' },
  { id: 3, name: 'Robert Kimani', roomType: 'Deluxe', roomNum: 104, time: '04:30 PM', status: 'Scheduled' },
  { id: 4, name: 'Amara Diallo', roomType: 'Standard', roomNum: 210, time: '07:45 AM', status: 'Checked In' },
];

export const INITIAL_CHECKOUTS: CheckOutGuest[] = [
  { id: 1, name: 'Yuki Tanaka', roomNum: 308, time: '10:00 AM', balance: 0, status: 'Pending' },
  { id: 2, name: 'James Whitfield', roomNum: 408, time: '11:00 AM', balance: 0, status: 'Pending' },
  { id: 3, name: 'Claire Dupont', roomNum: 508, time: '12:00 PM', balance: 1200000, status: 'Pending' },
  { id: 4, name: 'Lena Hoffmann', roomNum: 103, time: '07:20 AM', balance: 0, status: 'Checked Out' },
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  { id: 1, roomNum: 107, item: 'Handuk tambahan', status: 'Pending', priority: 'Medium', code: 'TKT-001', guestName: 'Alexander Pierce', createdTime: '09:45 AM' },
  { id: 2, roomNum: 606, item: 'AC kurang dingin (panggil teknisi)', status: 'On Progress', priority: 'Critical', code: 'TKT-002', guestName: 'Elena Rodriguez', createdTime: '10:45 AM', assigneeName: 'John Doe', assigneeNip: 'CS-01' },
  { id: 3, roomNum: 202, item: 'Sajadah & Mukena ekstra', status: 'Pending', priority: 'Low', code: 'TKT-003', guestName: 'Marcus Chen', createdTime: '11:45 AM' },
];

export const INITIAL_FB_ORDERS: FBOrder[] = [
  { id: 1, roomNum: 105, item: 'Nasi Goreng & Teh Manis', qty: 2, status: 'Pending', price: 90000 },
  { id: 2, roomNum: 204, item: 'Club Sandwich & Jus Jeruk', qty: 1, status: 'On Progress', price: 65000 },
];
