
import { Flight, Promotion, ContactEvent, Friend } from './types';

export const MOCK_FLIGHT: Flight = {
  flightNumber: 'AV725',
  origin: 'London',
  originCode: 'LHR',
  destination: 'Paris',
  destinationCode: 'CDG',
  departureTime: '18:45',
  boardingTime: '18:00',
  gate: 'B28',
  status: 'On Time',
};

export const MOCK_PROMOTIONS: Promotion[] = [
  { id: 1, title: '20% Off All Fragrances', shop: 'Dufry World', category: 'Beauty' },
  { id: 2, title: 'Buy One Get One Free on Chocolates', shop: 'Sweet Delights', category: 'Food & Drink' },
  { id: 3, title: 'Luxury Watches Tax-Free', shop: 'Timeless Treasures', category: 'Luxury' },
];

export const MOCK_PRODUCTS = [
    { name: 'Chanel No. 5 Perfume', category: 'Fragrance', price: 125 },
    { name: 'Lindt Swiss Chocolates Box', category: 'Confectionery', price: 25 },
    { name: 'Ray-Ban Aviator Sunglasses', category: 'Accessories', price: 150 },
    { name: 'Johnnie Walker Blue Label', category: 'Spirits', price: 220 },
    { name: 'Apple AirPods Pro', category: 'Electronics', price: 249 },
    { name: 'Lego Star Wars Set', category: 'Toys', price: 80 },
    { name: 'Estée Lauder Advanced Night Repair', category: 'Skincare', price: 105 },
    { name: 'Tag Heuer Carrera Watch', category: 'Watches', price: 4500 },
];

export const MOCK_CONTACT_EVENTS: ContactEvent[] = [
    { id: 1, name: 'Anna Smith', type: 'Birthday', date: 'October 28', daysUntil: 5 },
    { id: 2, name: 'Mom & Dad', type: 'Anniversary', date: 'November 12', daysUntil: 20 },
    { id: 3, name: 'John Doe', type: 'Birthday', date: 'November 15', daysUntil: 23 },
];

export const MOCK_FRIENDS: Friend[] = [
    { id: 1, name: 'David', relation: 'brother', age: 32, gender: 'male', interests: ['tech gadgets', 'whiskey', 'sci-fi movies'] },
    { id: 2, name: 'Sarah', relation: 'best friend', age: 28, gender: 'female', interests: ['skincare', 'fashion', 'yoga', 'artisan chocolates'] }
];

export const USER_PROFILE = {
    name: 'Alex',
    age: 34,
    gender: 'male',
    interests: ['travel', 'technology', 'fine spirits', 'reading'],
    shoppingHistory: ['Johnnie Walker Black Label', 'Bose QuietComfort Headphones', 'a mystery novel']
};

export const ICONS = {
    home: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    catalogue: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    gifts: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>,
    profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    plane: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>,
    close: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};