
export interface Flight {
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string;
  boardingTime: string;
  gate: string;
  status: 'On Time' | 'Delayed' | 'Boarding';
}

export interface Promotion {
  id: number;
  title: string;
  shop: string;
  category?: string;
  imageUrl?: string;
}

export interface Product {
  name: string;
  category: string;
  price?: number;
  imageUrl?: string;
  reason?: string;
}

export interface ContactEvent {
  id: number;
  name: string;
  type: 'Birthday' | 'Anniversary';
  date: string;
  daysUntil: number;
}

export interface Friend {
    id: number;
    name: string;
    relation: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    interests: string[];
}