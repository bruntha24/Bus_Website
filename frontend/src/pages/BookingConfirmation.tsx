import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, Tag, ChevronRight, 
  AlertCircle, CreditCard, Clock, ShieldCheck, 
  ChevronDown, ChevronUp, Download, Ticket, Bus,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookingStore, Booking } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import confetti from "canvas-confetti";

// PDF Generation Libraries
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null); 
  
  const { 
    selectedBus: bus, 
    selectedSeats, 
    passengers, 
    searchDate, 
    addBooking, 
    applyPromo, 
    discount, 
    promoCode, 
    reset 
  } = useBookingStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized Booking ID
  const bookingId = useMemo(() => `BG${Date.now().toString(36).toUpperCase()}`, []);

  // Price Calculations
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = Math.min(discount, subtotal);
  const total = subtotal - discountAmount;

  // --- PDF Download Function ---
  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 180; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = (210 - imgWidth) / 2;
      
      pdf.addImage(imgData, "PNG", xOffset, 15, imgWidth, imgHeight);
      pdf.save(`Ticket_${bookingId}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Confetti Animation
  useEffect(() => {
    if (confirmed) {
      const end = Date.now() + 3000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FF6B00', '#000000'] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FF6B00', '#000000'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [confirmed]);

  // Expiry Timer
  useEffect(() => {
    if (timeLeft <= 0 || confirmed) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, confirmed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Guard: Redirect if store is empty
  if (!bus || selectedSeats.length === 0 || passengers.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <div className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="font-black text-slate-500 uppercase tracking-tighter">Session Expired</p>
            <Button onClick={() => navigate("/")} className="mt-4 bg-[#FF6B00] hover:bg-black rounded-xl">
                Return to Search
            </Button>
        </div>
      </div>
    );
  }

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const success = applyPromo(promoInput);
    if (!success) setPromoError("Invalid promo code");
    else setPromoError("");
  };

  // --- DATABASE INTEGRATION ---
  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    const bookingPayload = {
      bus: {
        name: bus.name,
        from: bus.from,
        to: bus.to,
        departureTime: bus.departureTime,
      },
      seats: selectedSeats.map(s => s.id),
      passengers: passengers.map(p => ({
        name: p.name,
        gender: p.gender,
      })),
      date: searchDate,
      totalPrice: total,
      status: "confirmed",
      bookedAt: new Date().toISOString(),
    };

    try {
      const BASE_URL = "https://bus-website-2-tg5n.onrender.com";
      const response = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const savedData = await response.json();
        // Update local store with the actual DB response (includes MongoDB _id)
        addBooking(savedData);
        setConfirmed(true);
        window.scrollTo(0, 0);
      } else {
        alert("Failed to save booking. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server connection failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VIEW 1: SUCCESS (E-TICKET) ---
  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative overflow-hidden">
          <div className="w-full max-w-lg z-10 animate-in zoom-in-95 duration-500">
            <div ref={ticketRef} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-8 text-center" style={{ backgroundColor: '#FF6B00', color: '#ffffff' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-widest uppercase">Official E-Ticket</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Confirmed</span>
                </div>
                <h1 className="text-3xl font-black tracking-tighter mb-1">{bus.name}</h1>
                <p className="text-xs font-bold uppercase opacity-80">{bus.busType || bus.type}</p>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Origin</p>
                    <p className="text-xl font-black">{bus.from}</p>
                    <p className="text-sm font-bold text-[#FF6B00]">{bus.departureTime}</p>
                  </div>
                  <Bus className="h-5 w-5 text-slate-300 mt-4 mx-4" />
                  <div className="flex-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Destination</p>
                    <p className="text-xl font-black">{bus.to}</p>
                    <p className="text-sm font-bold text-[#FF6B00]">{bus.arrivalTime}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 border-y border-slate-100 py-6 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date</p>
                    <p className="text-sm font-black text-black">{searchDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Seats</p>
                    <p className="text-sm font-black text-black">{selectedSeats.map(s => s.id).join(", ")}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Passenger Details</p>
                  {passengers.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-black uppercase text-black">{p.name}</p>
                        <p className="text-[9px] font-bold text-slate-500">{p.gender}, {p.age}Y</p>
                      </div>
                      <p className="text-xs font-black text-[#FF6B00]">Seat {selectedSeats[idx]?.id}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 text-center bg-slate-50 border-t-2 border-dashed border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2">PNR / Booking ID</p>
                <p className="text-2xl font-black tracking-widest text-black">{bookingId}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button 
                className="bg-black hover:bg-zinc-800 text-white font-black h-16 rounded-2xl shadow-xl transition-all"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-5 w-5 text-[#FF6B00]" />
                {isDownloading ? "GENERATING PDF..." : "DOWNLOAD PDF TICKET"}
              </Button>
              <Button variant="ghost" className="font-bold text-slate-50" onClick={() => { reset(); navigate("/"); }}>
                BOOK ANOTHER JOURNEY
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- VIEW 2: REVIEW & PAYMENT ---
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <div className="bg-orange-50 border-b border-orange-100 py-3 flex justify-center">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-orange-100">
          <Clock className="h-4 w-4 text-[#FF6B00] animate-pulse" />
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">
            Seats held for <span className="text-[#FF6B00] tabular-nums">{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>

      <div className="container py-10 flex-1 max-w-2xl px-4 mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Review Order</h1>
            <p className="text-slate-500 text-sm font-medium">Double check your journey details</p>
          </div>
          <span className="text-[10px] font-black bg-black px-3 py-1.5 rounded-full text-white uppercase tracking-widest">Step 3/3</span>
        </div>

        {/* Journey Card */}
        <div className="rounded-[2rem] border-2 border-slate-100 bg-white p-8 mb-6 group">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Ticket className="h-5 w-5 text-[#FF6B00]" />
              </div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">Journey Summary</h3>
            </div>
            <span className="text-[#FF6B00] text-[10px] font-black bg-orange-50 px-3 py-1 rounded-full uppercase">
              {bus.busType || bus.type}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-6 text-sm mb-6">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase font-black mb-1">Operator</span>
              <span className="font-black text-lg text-black">{bus.name}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 text-[10px] uppercase font-black mb-1">Selected Seats</span>
              <span className="font-black text-lg text-[#FF6B00]">{selectedSeats.map(s => s.id).join(", ")}</span>
            </div>
            
            <div className="col-span-2 flex items-center gap-6 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B00]" />
                <div className="flex-1">
                <p className="text-xl font-black text-black">{bus.departureTime}</p>
                <p className="text-xs text-slate-500 font-bold uppercase">{bus.from}</p>
              </div>
              <ChevronRight className="h-4 w-4 opacity-30" />
              <div className="flex-1 text-right">
                <p className="text-xl font-black text-black">{bus.arrivalTime}</p>
                <p className="text-xs text-slate-500 font-bold uppercase">{bus.to}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="rounded-[2rem] border-2 border-slate-100 bg-white p-8 mb-6">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" /> Passenger Information
          </h3>
          <div className="space-y-3">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black shadow-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-black text-black uppercase text-sm">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{p.gender} • {p.age} Years</p>
                  </div>
                </div>
                <p className="font-black text-black text-xs uppercase">Seat {p.seatId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promo */}
        <div className={`rounded-[2rem] border-2 p-8 mb-6 transition-all duration-300 ${promoCode ? 'border-[#FF6B00] bg-orange-50/30' : 'border-slate-100 bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-xs uppercase tracking-widest flex items-center gap-2 ${promoCode ? 'text-[#FF6B00]' : 'text-slate-400'}`}>
              <Tag className="h-4 w-4" /> Promo Code
            </h3>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="ENTER CODE"
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
              className="h-12 border-slate-200 rounded-xl font-black uppercase"
              disabled={!!promoCode}
            />
            <Button 
                className="bg-black hover:bg-slate-800 text-white font-black px-8 rounded-xl" 
                onClick={handleApplyPromo}
                disabled={!!promoCode}
            >
                {promoCode ? "APPLIED" : "APPLY"}
            </Button>
          </div>
          {promoError && <p className="mt-2 text-red-500 font-bold text-[10px] uppercase">{promoError}</p>}
        </div>

        {/* Final Payment Card */}
        <div className="rounded-[2.5rem] bg-black p-10 text-white shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00] opacity-20 blur-[80px]" />
          <div className="space-y-3 mb-8 relative z-10">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Subtotal</span><span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs font-bold text-[#FF6B00] uppercase">
                <span>Discount Applied</span><span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Amount to Pay</p>
                <p className="text-5xl font-black tracking-tighter">₹{total}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <CreditCard className="h-8 w-8 text-[#FF6B00]" />
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-16 text-lg font-black uppercase tracking-widest bg-[#FF6B00] hover:bg-white hover:text-black text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-1" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
            ) : (
              "Confirm & Pay"
            )}
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4 text-[#FF6B00]" /> Secure 256-bit Payment
          </div>
        </div>

        {/* Policy Toggle */}
        <div className="text-center">
          <button 
            onClick={() => setShowPolicy(!showPolicy)}
            className="text-[10px] font-black text-slate-400 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            Cancellation Policy {showPolicy ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showPolicy && (
            <div className="mt-4 p-6 bg-slate-50 rounded-2xl text-[11px] text-slate-500 font-medium text-left border border-slate-100 animate-in slide-in-from-top-2 duration-300">
              <p className="mb-1">• Cancellation within 12 hours: <span className="text-red-500 font-black uppercase">No Refund</span></p>
              <p className="mb-1">• Cancellation 12-24 hours: <span className="text-black font-black uppercase">50% Refund</span></p>
              <p>• Cancellation 24 hours+: <span className="text-green-600 font-black uppercase">90% Refund</span></p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}