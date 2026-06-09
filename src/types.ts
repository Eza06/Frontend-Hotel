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
