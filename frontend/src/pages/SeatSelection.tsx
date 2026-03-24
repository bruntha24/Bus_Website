import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Clock, ArrowRight, ShieldCheck, User, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore, generateSeats, Seat } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const TIMER_SECONDS = 120;

export default function SeatSelection() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bus = useBookingStore((s) => s.selectedBus);
  const setSelectedSeats = useBookingStore((s) => s.setSelectedSeats);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [expired, setExpired] = useState(false);
  const [activeDeck, setActiveDeck] = useState<"lower" | "upper">("lower");

  useEffect(() => {
    if (!bus) {
      navigate("/");
      return;
    }
    setSeats(generateSeats(bus));
  }, [bus, navigate]);

  // Timer Logic
  useEffect(() => {
    if (selected.length === 0) {
      setTimer(0);
      setExpired(false);
      return;
    }
    setTimer(TIMER_SECONDS);
    setExpired(false);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setExpired(true);
          setSelected([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selected.length > 0]);

  const toggleSeat = useCallback((seatId: string) => {
    if (expired) setExpired(false);
    setSelected((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= 6) return prev;
      return [...prev, seatId];
    });
  }, [expired]);

  const decks = useMemo(() => {
    const lower = seats.filter((s) => s.deck === "lower");
    const upper = seats.filter((s) => s.deck === "upper");
    return { lower, upper };
  }, [seats]);

  const hasUpperDeck = decks.upper.length > 0;
  const selectedSeats = seats.filter((s) => selected.includes(s.id));
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0 || expired) return;
    setSelectedSeats(selectedSeats);
    navigate("/passenger-details");
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const renderDeck = (deckSeats: Seat[]) => {
    if (deckSeats.length === 0) return null;
    const maxRow = Math.max(...deckSeats.map((s) => s.row));
    const cols = [...new Set(deckSeats.map((s) => s.col))].sort((a, b) => a - b);

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          {/* BUS FRONT INDICATOR */}
          <div className="w-full flex justify-between items-center mb-8 px-4 border-b border-dashed border-slate-200 pb-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
               Front of Bus
             </div>
             <div className="relative w-10 h-10 rounded-full border-4 border-slate-100 flex items-center justify-center">
               <div className="w-1 h-5 bg-slate-200 rounded-full rotate-45" />
             </div>
          </div>

          {Array.from({ length: maxRow + 1 }, (_, r) => (
            <div key={r} className="flex gap-3">
              {cols.map((c) => {
                const seat = deckSeats.find((s) => s.row === r && s.col === c);
                if (!seat) return <div key={c} className="w-12 h-12" />; 
                
                const isSelected = selected.includes(seat.id);
                const isBooked = seat.type === "booked";
                const isSleeper = seat.price > 1200; // Visual logic for sleeper

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked}
                    onClick={() => toggleSeat(seat.id)}
                    className={`relative group transition-all duration-200 active:scale-90
                      ${isSleeper ? 'w-12 h-24' : 'w-12 h-12'} 
                      rounded-xl border-2 flex flex-col items-center justify-center gap-1
                      ${isBooked 
                        ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                        : isSelected 
                        ? "bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-200" 
                        : "bg-white border-slate-200 hover:border-orange-300 hover:bg-orange-50"
                      }`}
                  >
                    <span className="text-[10px] font-black">{seat.id}</span>
                    {isSleeper && <Zap className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-orange-400'}`} />}
                    
                    {/* Tooltip on Hover */}
                    {!isBooked && !isSelected && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-xl">
                        ₹{seat.price}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!bus) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <div className="container py-8 flex-1 max-w-6xl">
        {/* BUS HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{bus.name}</h1>
              <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wider">Top Rated</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
              <span>{bus.from}</span>
              <ArrowRight className="h-4 w-4 text-orange-500" />
              <span>{bus.to}</span>
              <span className="mx-2 text-slate-200">|</span>
              <span className="text-orange-600 uppercase text-[11px] tracking-widest">{bus.busType}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-l border-slate-100 pl-6 hidden md:flex">
             <div className="text-right">
               <p className="text-[10px] font-black text-slate-400 uppercase">Departure</p>
               <p className="font-black text-slate-900">{bus.departureTime}</p>
             </div>
             <div className="w-10 h-[1px] bg-slate-200" />
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase">Arrival</p>
               <p className="font-black text-slate-900">{bus.arrivalTime}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            {/* STATUS MESSAGES */}
            {selected.length > 0 && (
              <div className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${expired ? 'bg-red-50 border-red-200 animate-shake' : 'bg-orange-50 border-orange-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${expired ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {expired ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-black uppercase tracking-tight ${expired ? 'text-red-700' : 'text-orange-700'}`}>
                    {expired ? "Session Expired! Please re-select." : "Booking expires in:"}
                  </span>
                </div>
                {!expired && <span className="font-mono text-xl font-black text-orange-600">{formatTime(timer)}</span>}
              </div>
            )}

            {/* LEGEND */}
            <div className="flex flex-wrap items-center gap-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <LegendItem color="bg-white border-slate-200" label="Available" />
              <LegendItem color="bg-orange-500 border-orange-600" label="Selected" />
              <LegendItem color="bg-slate-100 border-slate-200" label="Booked" />
            </div>

            {/* DECK TABS */}
            {hasUpperDeck && (
              <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl gap-1">
                {(["lower", "upper"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDeck(d)}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeDeck === d ? "bg-white text-orange-600 shadow-md" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {d} Deck
                  </button>
                ))}
              </div>
            )}

            {renderDeck(hasUpperDeck ? decks[activeDeck] : decks.lower)}
          </div>

          {/* BOOKING SUMMARY SIDEBAR */}
<aside className="space-y-4">
    <div className="bg-white rounded-[2rem] border border-orange-100 shadow-xl overflow-hidden sticky top-24">
        <div className="bg-orange-50 p-6 text-orange-950 relative border-b border-orange-100">
            <div className="absolute top-0 right-0 p-4 opacity-15">
                <ShieldCheck className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="font-bold text-xl tracking-tight">Trip Summary</h3>
            <p className="text-orange-800 text-xs font-medium uppercase tracking-widest mt-1">Confirmed Pricing</p>
        </div>
        
        <div className="p-8 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Seats Selected</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.length > 0 ? (
                                selectedSeats.map(s => (
                                    <span key={s.id} className="px-2 py-1 bg-red-50 border border-red-100 rounded text-red-700 text-[10px] font-bold">
                                        #{s.id}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-sm font-medium italic">No selection</span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Max Seats</p>
                        <p className="text-xs font-bold text-slate-800">06</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <SummaryRow label="Base Fare" value={`₹${totalPrice}`} />
                    <SummaryRow label="Taxes (GST)" value="₹0" />
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-slate-800 text-lg">Total Amount</span>
                        <span className="text-2xl font-bold text-red-600">₹{totalPrice}</span>
                    </div>
                </div>
            </div>

            <Button 
                onClick={handleProceed}
                disabled={selected.length === 0 || expired}
                className="w-full h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg transition-all shadow-lg shadow-red-100 group"
            >
                Continue to Details
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* Micro-Trust Area */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-[9px] font-medium text-slate-500 uppercase">
                    <ShieldCheck className="w-3 h-3 text-red-400" /> Secure
                </div>
                <div className="flex items-center gap-2 text-[9px] font-medium text-slate-500 uppercase">
                    <Zap className="w-3 h-3 text-red-400" /> Instant
                </div>
            </div>
        </div>
    </div>
</aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Reusable UI Components
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-5 h-5 rounded-md ${color} border-2`} />
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{label}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500 font-bold">{label}</span>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}