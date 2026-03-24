import { create } from "zustand";

export interface Bus {
  id: string;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  from: string;
  to: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  seatType: "Normal" | "Semi-Sleeper" | "Sleeper";
  busType: "AC" | "NON-AC";
 type?: string;           // ADD THIS: Optional field to prevent TS errors
  rating: number;
  amenities: string[];
}

export interface Seat {
  id: string;
  row: number;
  col: number;
  type: "available" | "booked" | "selected";
  price: number;
  deck: "lower" | "upper";
}

export interface Passenger {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  seatId: string;
}

export interface Booking {
  id: string;
  bus: Bus;
  seats: Seat[];
  passengers: Passenger[];
  date: string;
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
  bookedAt: string;
  promoCode?: string;
  discount?: number;
}

interface BookingState {
  searchFrom: string;
  searchTo: string;
  searchDate: string;
  selectedBus: Bus | null;
  selectedSeats: Seat[];
  passengers: Passenger[];
  bookings: Booking[];
  promoCode: string;
  discount: number;
  setSearch: (from: string, to: string, date: string) => void;
  setSelectedBus: (bus: Bus) => void;
  setSelectedSeats: (seats: Seat[]) => void;
  setPassengers: (passengers: Passenger[]) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  setPromoCode: (code: string) => void;
  applyPromo: (code: string) => boolean;
  reset: () => void;
}

const PROMO_CODES: Record<string, number> = {
  FIRST50: 50,
  SAVE20: 20,
  TRAVEL10: 10,
  LUCKY30: 30,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  searchFrom: "",
  searchTo: "",
  searchDate: "",
  selectedBus: null,
  selectedSeats: [],
  passengers: [],
  bookings: JSON.parse(localStorage.getItem("bookings") || "[]"),
  promoCode: "",
  discount: 0,
  setSearch: (from, to, date) => set({ searchFrom: from, searchTo: to, searchDate: date }),
  setSelectedBus: (bus) => set({ selectedBus: bus }),
  setSelectedSeats: (seats) => set({ selectedSeats: seats }),
  setPassengers: (passengers) => set({ passengers }),
  addBooking: (booking) => {
    const bookings = [...get().bookings, booking];
    localStorage.setItem("bookings", JSON.stringify(bookings));
    set({ bookings });
  },
  cancelBooking: (id) => {
    const bookings = get().bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" as const } : b
    );
    localStorage.setItem("bookings", JSON.stringify(bookings));
    set({ bookings });
  },
  setPromoCode: (code) => set({ promoCode: code }),
  applyPromo: (code) => {
    const discount = PROMO_CODES[code.toUpperCase()];
    if (discount) {
      set({ promoCode: code.toUpperCase(), discount });
      return true;
    }
    return false;
  },
  reset: () => set({ selectedBus: null, selectedSeats: [], passengers: [], promoCode: "", discount: 0 }),
}));

// Mock data
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Goa", "Kochi", "Chandigarh", "Indore", "Nagpur"
];

export const getCities = () => cities;

const busNames = [
  "Royal Cruiser", "Green Line Express", "Shree Travels",
  "Neeta Volvo", "VRL Travels", "SRS Travels",
  "Kaveri Express", "Sharma Transport", "KPN Travels",
  "Orange Tours"
];

const amenities = ["WiFi", "Charging Point", "Water Bottle", "Blanket", "Reading Light", "GPS Tracking"];

export const generateBuses = (from: string, to: string): Bus[] => {
  const buses: Bus[] = [];
  const seatTypes: Bus["seatType"][] = ["Normal", "Semi-Sleeper", "Sleeper"];
  const busTypes: Bus["busType"][] = ["AC", "NON-AC"];
  const departures = ["06:00", "08:30", "10:15", "12:45", "14:30", "16:00", "18:30", "20:00", "21:30", "23:00"];
  const durations = ["6h 30m", "7h 15m", "8h 00m", "5h 45m", "9h 30m", "7h 00m", "6h 00m", "8h 45m"];

  for (let i = 0; i < 12; i++) {
    const dep = departures[i % departures.length];
    const dur = durations[i % durations.length];
    const depH = parseInt(dep.split(":")[0]);
    const durH = parseInt(dur.split("h")[0]);
    const arrH = (depH + durH) % 24;
    const arrM = parseInt(dur.split(" ")[1]?.replace("m", "") || "0");

    buses.push({
      id: `bus-${i}`,
      name: busNames[i % busNames.length],
      departureTime: dep,
      arrivalTime: `${String(arrH).padStart(2, "0")}:${String(arrM).padStart(2, "0")}`,
      duration: dur,
      from,
      to,
      price: 400 + Math.floor(Math.random() * 1200),
      availableSeats: 10 + Math.floor(Math.random() * 25),
      totalSeats: 36,
      seatType: seatTypes[i % 3],
      busType: busTypes[i % 2],
      rating: 3.5 + Math.round(Math.random() * 15) / 10,
      amenities: amenities.slice(0, 2 + Math.floor(Math.random() * 4)),
    });
  }
  return buses;
};

export const generateSeats = (bus: Bus): Seat[] => {
  const seats: Seat[] = [];
  const rows = bus.seatType === "Sleeper" ? 8 : bus.seatType === "Semi-Sleeper" ? 10 : 12;
  const cols = bus.seatType === "Sleeper" ? 3 : 4;

  for (let deck of ["lower", "upper"] as const) {
    if (deck === "upper" && bus.seatType === "Normal") continue;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (bus.seatType !== "Normal" && c === 1) continue; // aisle
        const isBooked = Math.random() < 0.3;
        seats.push({
          id: `${deck}-${r}-${c}`,
          row: r,
          col: c,
          type: isBooked ? "booked" : "available",
          price: bus.price + (deck === "upper" ? 100 : 0),
          deck,
        });
      }
    }
  }
  return seats;
};

export const offers = [
  { code: "FIRST50", description: "Get ₹50 off on your first booking!", discount: "₹50 OFF", color: "primary" },
  { code: "SAVE20", description: "Save ₹20 on all AC Sleeper buses", discount: "₹20 OFF", color: "info" },
  { code: "TRAVEL10", description: "Flat ₹10 off on bookings above ₹500", discount: "₹10 OFF", color: "success" },
  { code: "LUCKY30", description: "Lucky deal! ₹30 off this weekend", discount: "₹30 OFF", color: "warning" },
];