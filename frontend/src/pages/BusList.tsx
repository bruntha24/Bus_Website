import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Star, MapPin, ArrowRight, ShieldCheck,
  Wifi, Coffee, Battery, Wind, Smartphone,
  Tv, Shield, GlassWater, Pill, Map, Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useBookingStore } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("charging") || lower.includes("battery")) return Battery;
  if (lower.includes("water") || lower.includes("beverage")) return GlassWater;
  if (lower.includes("snack") || lower.includes("coffee")) return Coffee;
  if (lower.includes("ac") || lower.includes("air")) return Wind;
  if (lower.includes("tv") || lower.includes("entertainment")) return Tv;
  if (lower.includes("emergency") || lower.includes("kit")) return Pill;
  if (lower.includes("track")) return Map;
  return Shield;
};

// 12 Premium Bus & Travel Images
const BUS_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1569448096483-1114dddb646d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1525962898597-a4ae6402826e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1770819254059-2dbfc22f99d6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1664302152991-d013ff125f3f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1708864141190-8a0d14610f80?q=80&w=1317&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1695218212443-d4aed85a1377?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1695218224009-818e9e6495f1?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1689392927771-4505c57e6d25?q=80&w=1334&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1723291076859-70730506c3b9?q=80&w=1296&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1756723701257-46513cd36fc1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const seatTypes = ["Normal", "Semi-Sleeper", "Sleeper"] as const;
const busTypes = ["AC", "NON-AC"] as const;

export default function BusList() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setSelectedBus = useBookingStore((s) => s.setSelectedBus);

  // Get search criteria from URL
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const date = params.get("date") || "";

  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"price" | "departure" | "rating">("price");

  const [selSeatTypes, setSelSeatTypes] = useState<string[]>([]);
  const [selBusTypes, setSelBusTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        // FETCHING ALL BUSES (We will filter them in useMemo for better UX)
        const BASE_URL = "https://bus-website-na3y.onrender.com";
        const res = await fetch(`${BASE_URL}/api/buses`);
        const data = await res.json();
        setBuses(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const toggleFilter = (arr: string[], val: string, setter: (a: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const filteredBuses = useMemo(() => {
    let result = [...buses];

    // 1. FILTER BY ROUTE (CRITICAL for showing the right data)
    if (from && to) {
      result = result.filter(
        (b) => 
          b.from.toLowerCase() === from.toLowerCase() && 
          b.to.toLowerCase() === to.toLowerCase()
      );
    }

    // 2. FILTER BY SIDEBAR CATEGORIES
    if (selSeatTypes.length) result = result.filter((b) => selSeatTypes.includes(b.seatType));
    if (selBusTypes.length) result = result.filter((b) => selBusTypes.includes(b.busType));
    
    // 3. APPLY SORTING
    return result.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      // Simple time sort (assumes HH:MM AM/PM format)
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [buses, from, to, sortBy, selSeatTypes, selBusTypes]);
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      {/* SEARCH HEADER */}
      <div className="bg-red-600 py-4 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
        <div className="container px-4 relative z-10 mx-auto">
          <div className="bg-white p-1 rounded-xl shadow-2xl flex flex-col lg:flex-row items-center gap-1">
            <div className="flex flex-1 w-full items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <MapPin className="text-red-600 w-4 h-4" />
              <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black text-slate-400">Origin</span>
                <span className="font-bold text-xs text-slate-900 leading-none">{from}</span>
              </div>
            </div>
            <ArrowRight className="hidden lg:block text-slate-300 w-4 h-4" />
            <div className="flex flex-1 w-full items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg">
              <MapPin className="text-red-600 w-4 h-4" />
              <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black text-slate-400">Destination</span>
                <span className="font-bold text-xs text-slate-900 leading-none">{to}</span>
              </div>
            </div>
            <Button className="w-full lg:w-auto h-11 px-8 rounded-lg text-[10px] font-black bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest transition-all">
              MY TRIP
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-8 py-10 flex-1 px-4">
        
        {/* ENLARGED SIDEBAR FILTER */}
        <aside className="w-full md:w-72 shrink-0 space-y-6">
          <div className="bg-white p-7 rounded-3xl border border-orange-100 shadow-md sticky top-6">
            <h3 className="font-black text-xl tracking-tight text-slate-900 mb-8">Filters</h3>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.15em] mb-4">Seat Style</p>
                <div className="space-y-4">
                  {seatTypes.map((t) => (
                    <label key={t} className="flex items-center group cursor-pointer">
                      <Checkbox 
                        checked={selSeatTypes.includes(t)}
                        onCheckedChange={() => toggleFilter(selSeatTypes, t, setSelSeatTypes)}
                        className="w-5 h-5 rounded-md border-orange-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="ml-4 text-sm font-bold text-slate-600 group-hover:text-orange-500 transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Separator className="bg-orange-50" />
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.15em] mb-4">Bus Comfort</p>
                <div className="space-y-4">
                  {busTypes.map((t) => (
                    <label key={t} className="flex items-center group cursor-pointer">
                      <Checkbox 
                        checked={selBusTypes.includes(t)}
                        onCheckedChange={() => toggleFilter(selBusTypes, t, setSelBusTypes)}
                        className="w-5 h-5 rounded-md border-orange-200 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                      />
                      <span className="ml-4 text-sm font-bold text-slate-600 group-hover:text-orange-500 transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
    <div className="grid grid-cols-2 gap-2 mt-6">
  {/* Safety */}
  <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-100 rounded-xl">
    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
    <span className="text-[9px] font-black text-orange-600 uppercase leading-none">Secure Checkout</span>
  </div>

  {/* Flexibility */}
  <div className="flex items-center gap-2 p-2 bg-orange-500 rounded-xl shadow-sm shadow-orange-100">
    <svg className="w-2.5 h-2.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-[9px] font-black text-white uppercase leading-none">Free Cancel</span>
  </div>

  {/* Service */}
  <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-100 rounded-xl">
    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
    <span className="text-[9px] font-black text-orange-600 uppercase leading-none">Verified Fleet</span>
  </div>

  {/* Speed */}
  <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-100 rounded-xl">
    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
    <span className="text-[9px] font-black text-orange-600 uppercase leading-none">Instant SMS</span>
  </div>
</div>
        </aside>

        {/* MAIN BUS LIST */}
        <main className="flex-1 space-y-4">
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            filteredBuses.map((bus, index) => (
              <div key={bus._id} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-red-200 hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* LEFT: IMAGE COLUMN */}
                  <div className="relative w-full lg:w-48 h-32 lg:h-auto overflow-hidden shrink-0">
                    <img 
                      src={BUS_IMAGES[index % BUS_IMAGES.length]} 
                      alt="Luxury Travel" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                    <Badge className="absolute top-2 left-2 bg-white/90 text-slate-900 backdrop-blur-sm text-[7px] font-black border-none px-2 py-0.5 uppercase">
                      Premium
                    </Badge>
                  </div>

                  {/* MIDDLE: BUS INFO */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 group-hover:bg-red-600 transition-all duration-300">
                            <span className="text-lg font-black text-red-600 group-hover:text-white uppercase">{bus.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h2 className="font-black text-lg text-slate-900 uppercase tracking-tight leading-none">{bus.name}</h2>
                            <div className="flex gap-2 mt-2">
                              <Badge className="bg-orange-50 text-orange-600 border-none text-[8px] px-2 py-0.5 uppercase font-black">{bus.busType}</Badge>
                              <Badge className="bg-slate-50 text-slate-500 border-none text-[8px] px-2 py-0.5 uppercase font-black">{bus.seatType}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg border border-orange-100">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-black text-[11px]">{bus.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <TooltipProvider delayDuration={0}>
                          {bus.amenities?.map((amenity: string, idx: number) => {
                            const Icon = getAmenityIcon(amenity);
                            return (
                              <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-default">
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-900 text-white border-none text-[9px] font-black uppercase">
                                  {amenity}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <div className="w-24">
                        <p className="text-2xl font-black text-red-600 tracking-tighter leading-none">{bus.departureTime}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{from}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-300 uppercase mb-1">{bus.duration || "08h"}</span>
                        <div className="w-full h-[1px] bg-slate-100 relative overflow-hidden">
                           <div className="absolute inset-0 bg-red-400 w-0 group-hover:w-full transition-all duration-1000" />
                        </div>
                      </div>
                      <div className="w-24 text-right">
                        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{bus.arrivalTime}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{to}</p>
                      </div>
                    </div>
                  </div>

                  {/* SLIMMER RIGHT: BOOKING COLUMN */}
                  <div className="w-full lg:w-44 bg-slate-50/50 px-6 py-4 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 group-hover:bg-white transition-colors duration-500">
                    
                    {/* LIVE STATUS */}
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">Last booked 12m ago</span>
                    </div>

                    <div className="text-center mb-3">
                      <div className="flex items-baseline justify-center text-slate-950">
                        <span className="text-[10px] font-black text-red-600 mr-0.5">₹</span>
                        <span className="text-2xl font-black tracking-tighter leading-none">{bus.price}</span>
                      </div>
                      <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest leading-none mt-1">Per Ticket</p>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setSelectedBus(bus);
                        navigate(`/seats?busId=${bus._id}&date=${date}`);
                      }}
                      className="w-full h-9 rounded-xl text-[9px] font-black bg-red-600 hover:bg-red-700 text-white transition-all uppercase tracking-widest shadow-md shadow-red-100"
                    >
                      SELECT SEATS
                    </Button>
                    
                    {/* SEATS LEFT & POLICY */}
                    <div className="mt-3 flex flex-col gap-1 items-center">
                      <p className="text-[8px] font-bold text-red-500 uppercase tracking-tighter">
                        {bus.availableSeats} Seats Left
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest border-b border-dotted border-slate-300 pb-0.5 cursor-help">
                              Free Cancellation
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-900 text-white text-[8px] font-black uppercase">
                            Full refund if cancelled 24h before travel.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}