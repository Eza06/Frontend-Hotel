export interface Room {
  id: number;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Presidential Suite';
  status: 'available' | 'occupied' | 'dirty' | 'maintenance';
  price: number;
  floor: number;
  guestName?: string;
}

export interface Guest {
  name: string;
  idCard: string;
  phone: string;
  status: string;
  pref: string;
}

export interface CheckInGuest {
  id: number;
  name: string;
  roomType: string;
  roomNum: number;
  time: string;
  status: string;
}

export interface CheckOutGuest {
  id: number;
  name: string;
  roomNum: number;
  time: string;
  balance: number;
  status: string;
}

export interface ServiceRequest {
  id: number;
  roomNum: number;
  item: string;
  status: 'Pending' | 'On Progress' | 'Resolved';
  assigneeNip?: string;
  assigneeName?: string;
  priority?: 'Critical' | 'Medium' | 'Low';
  code?: string;
  guestName?: string;
  createdTime?: string;
  assignedTime?: string;
  resolvedTime?: string;
}

export interface FBOrder {
  id: number;
  roomNum: number;
  item: string;
  qty: number;
  price: number;
  status: 'Pending' | 'On Progress' | 'Delivered';
}

export interface User {
  nip: string;
  name: string;
  role: string;
  pass: string;
}

export interface EnrichedTicket {
  id: number;
  code: string;
  type: string;
  guestName: string;
  roomNum: number;
  stayDay: string;
  assigneeName: string;
  priority: 'Critical' | 'Medium' | 'Low';
  status: 'Pending' | 'On Progress' | 'Resolved';
  createdTime: string;
  assignedTime?: string;
  resolvedTime?: string;
}

export interface OperationalReport {
  id: string;
  name: string;
  code: string;
  category: 'HOUSEKEEPING' | 'GUEST OPS' | 'RESERVATION' | 'SERVICE';
  generatedBy: string;
  dateRange: string;
  status: 'VERIFIED' | 'PROCESSING' | 'NEEDS REVIEW';
  totalItems: number;
  incidents: number;
}

export interface Housekeeper {
  id: string;
  name: string;
  status: 'Working' | 'Offline';
  assignedRooms: string[];
}

export interface CleaningHistoryItem {
  id: string;
  roomNum: string;
  roomType: string;
  housekeeperName: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'Completed';
}

export interface CSStaff {
  id: string;
  name: string;
  status: 'Working' | 'Offline';
  assignedTickets: number[]; // ticket IDs
}
