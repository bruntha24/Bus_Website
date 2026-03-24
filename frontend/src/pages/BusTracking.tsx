import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Clock, Bus, Radio, Zap, 
  ShieldCheck, Share2, Wifi, Wind, BatteryCharging, 
  PhoneCall, CheckCircle2, LocateFixed, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function BusTracking() {
  const [bookingId, setBookingId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(74);

  const handleTrack = () => {
    if (bookingId.trim()) {
      setLoading(true);
      setTimeout(() => {
        setTracking(true);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFF]">
      <Navbar />
      
      {/* --- SOFT HERO SECTION --- */}
      <section className="bg-white pt-20 pb-24 px-4 relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px]" />
          <div className="absolute top-40 -left-20 w-96 h-96 bg-indigo-50/40 rounded-full blur-[100px]" />
        </div>

        <div className="container max-w-3xl relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full mb-8 border border-orange-100/50"
          >
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Satellite Telemetry</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight mb-6"
          >
            Track Your <span className="text-orange-500">Fleet</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto p-2 bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100"
          >
            <div className="relative flex-1 group">
              <LocateFixed className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-400 transition-colors" />
              <Input
                placeholder="Booking PNR (e.g. BG1234)"
                className="h-14 pl-14 border-none bg-transparent focus-visible:ring-0 font-bold text-lg text-slate-700 placeholder:text-slate-300"
                value={bookingId}
                onChange={(e) => { setBookingId(e.target.value.toUpperCase()); setTracking(false); }}
              />
            </div>
            <Button 
              onClick={handleTrack} 
              disabled={!bookingId.trim() || loading}
              className="h-14 px-10 rounded-[1.8rem] bg-slate-800 hover:bg-orange-500 text-white font-bold transition-all duration-300 shadow-lg shadow-slate-200 uppercase tracking-widest text-xs"
            >
              {loading ? "Connecting..." : "Initialize"}
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="container py-16 flex-1 max-w-7xl px-4">
        <AnimatePresence mode="wait">
          {tracking ? (
            <motion.div 
              key="tracking-active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* LEFT COLUMN: MAP & LOGISTICS (8 COLS) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="relative h-[500px] rounded-[3.5rem] bg-white shadow-2xl shadow-indigo-100/40 overflow-hidden border border-slate-100">
                  {/* Soft Light Grid */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4F46E5 1px, transparent 1px), linear-gradient(90deg, #4F46E5 1px, transparent 1px)', backgroundSize: '45px 45px' }} />
                  
                  <div className="relative h-full w-full flex flex-col items-center justify-center px-12 md:px-24">
                    {/* Route Path */}
                    <div className="relative w-full h-2 bg-slate-100 rounded-full">
                      <div 
                        className="absolute left-0 h-full bg-orange-400 rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                      >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <motion.div 
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 3 }}
                              className="relative bg-white p-4 rounded-[2rem] shadow-xl border border-slate-100"
                            >
                              <Bus className="h-7 w-7 text-orange-500" />
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-500 text-[9px] px-3 py-1 rounded-full font-black border border-slate-100 shadow-sm whitespace-nowrap">
                                74 KM/H
                              </div>
                            </motion.div>
                         </div>
                      </div>

                      <MapMarker position="left-0" city="Mumbai" time="10:30 AM" icon={CheckCircle2} active />
                      <MapMarker position="left-1/2" city="Lonavala" time="01:15 PM" icon={Navigation} active={progress > 50} />
                      <MapMarker position="right-0" city="Pune" time="04:20 PM" icon={MapPin} />
                    </div>
                  </div>

                  <div className="absolute top-8 left-8">
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Connection</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Live Logistics</h4>
                      <div className="grid grid-cols-2 gap-8">
                        <AmenityItem icon={Wind} label="AC Status" status="22°C" color="text-cyan-500" />
                        <AmenityItem icon={BatteryCharging} label="Power" status="On" color="text-orange-500" />
                        <AmenityItem icon={Wifi} label="WiFi" status="Stable" color="text-indigo-500" />
                        <AmenityItem icon={ShieldCheck} label="Safety" status="Secure" color="text-emerald-500" />
                      </div>
                   </div>

                   <div className="bg-indigo-50 p-8 rounded-[3rem] border border-indigo-100 flex flex-col justify-between group overflow-hidden relative">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase text-indigo-400 mb-2">Arrival Expectancy</p>
                        <h3 className="text-5xl font-black text-indigo-900 tracking-tighter">24<span className="text-xl ml-2 text-indigo-400">MINS</span></h3>
                        <p className="text-sm font-bold mt-2 text-indigo-800 opacity-70">Passing Talegaon Toll</p>
                      </div>
                      <Button className="mt-8 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl h-14 font-black transition-all shadow-lg shadow-indigo-200">
                        TIMELINE VIEW
                      </Button>
                      <Navigation className="absolute -right-8 -bottom-8 w-40 h-40 text-indigo-100 -rotate-12" />
                   </div>
                </div>
              </div>

              {/* RIGHT COLUMN: STATUS CARDS (4 COLS) */}
              <div className="lg:col-span-4 space-y-4">
                <StatusCard 
                  icon={Navigation} 
                  label="Navigation" 
                  value="NH-48 Highway" 
                  sub="Expressway Route" 
                  iconColor="bg-blue-50 text-blue-500" 
                />
                <StatusCard 
                  icon={Clock} 
                  label="Arrival" 
                  value="04:20 PM" 
                  sub="Approx. 86m left" 
                  iconColor="bg-orange-50 text-orange-500" 
                />
                
                <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-100/30 space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      Operator Unit
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800 mt-4">Scania Multi-Axle</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase">Plate: MH-12-BQ-8821</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full h-14 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold transition-all gap-3 shadow-lg shadow-emerald-100 border-b-4 border-emerald-800/20 active:border-b-0 active:translate-y-1">
  <PhoneCall className="w-5 h-5" /> CONTACT DRIVER
</Button>
                    <Button 
  variant="ghost" 
  className="w-full h-12 rounded-2xl text-sky-600 font-bold gap-2 bg-sky-50/40 hover:bg-sky-100/60 hover:text-sky-700 border border-sky-100/50 hover:border-sky-200 transition-all duration-300 shadow-sm shadow-sky-100/20"
>
  <Share2 className="w-4 h-4" /> SHARE LIVE LINK
</Button>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-indigo-500 text-xs">DA</div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">David</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Verified Senior Driver</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div key="idle" className="text-center py-24">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100 mx-auto mb-8 flex items-center justify-center border border-slate-50">
                <Navigation className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Enter Your PNR</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
                Connect your booking to see your journey live.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}

// --- SOFT SUB-COMPONENTS ---

function MapMarker({ position, city, time, icon: Icon, active = false }: any) {
  return (
    <div className={`absolute ${position} flex flex-col items-center -translate-x-1/2`}>
      <div className={`w-3 h-3 rounded-full mb-3 transition-all ${active ? 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]' : 'bg-slate-200'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-slate-700' : 'text-slate-300'}`}>{city}</span>
      <span className="text-[8px] font-medium text-slate-400 mt-1">{time}</span>
    </div>
  );
}

function AmenityItem({ icon: Icon, label, status, color }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-2 group">
      <div className={`p-4 bg-slate-50 rounded-2xl transition-all group-hover:bg-white group-hover:shadow-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{label}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{status}</p>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, sub, iconColor }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-bold text-slate-700 tracking-tight leading-none">{value}</p>
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1 opacity-70">
            {sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}