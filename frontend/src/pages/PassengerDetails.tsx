import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, User, Mail, Phone, Info, CheckCircle2, ShieldCheck, Ticket, Building2, ChevronDown, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBookingStore, Passenger } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PassengerDetails() {
  const navigate = useNavigate();
  const { selectedBus: bus, selectedSeats, setPassengers } = useBookingStore();

  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [isGstEnabled, setIsGstEnabled] = useState(false);
  const [addInsurance, setAddInsurance] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [passengers, setLocalPassengers] = useState<Passenger[]>([]);

  // Fix: Move navigation logic to useEffect to prevent render-phase errors
  useEffect(() => {
    if (!bus || selectedSeats.length === 0) {
      navigate("/");
    } else {
      setLocalPassengers(
        selectedSeats.map((s) => ({ name: "", age: "", gender: "Male" as const, seatId: s.id }))
      );
    }
  }, [bus, selectedSeats, navigate]);

  if (!bus || selectedSeats.length === 0) return null;

  const updatePassenger = (i: number, field: keyof Passenger, value: string) => {
    setLocalPassengers((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const copyFirstPassenger = () => {
    if (passengers.length < 2) return;
    const first = passengers[0];
    setLocalPassengers(prev => prev.map((p, i) => i === 0 ? p : { ...p, name: first.name, age: first.age, gender: first.gender }));
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email);
  const isPhoneValid = contactInfo.phone.length === 10;
  const arePassengersValid = passengers.length > 0 && passengers.every((p) => p.name.trim().length > 2 && p.age && parseInt(p.age) > 0);
  const isValid = arePassengersValid && isEmailValid && isPhoneValid;

  const basePrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const serviceFee = 45;
  const insuranceFee = addInsurance ? selectedSeats.length * 15 : 0;
  const totalPrice = basePrice + serviceFee + insuranceFee;

  const handleSubmit = () => {
    if (!isValid) return;
    setPassengers(passengers);
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      
      <div className="container py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-7xl mx-auto">
          
          <div className="space-y-6">
            <header className="animate-fade-up border-b border-slate-200 pb-4">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Review & Pay</h1>
              <p className="text-slate-500 font-medium">Safe and secure booking via encrypted payment.</p>
            </header>

            {/* CONTACT INFO CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm animate-fade-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 rounded-2xl">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="font-black text-slate-800 tracking-tight uppercase text-sm">Contact Info</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Email Address</Label>
                  <Input 
                    placeholder="traveler@email.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    className="h-12 rounded-xl border-slate-200 focus:ring-orange-500 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase text-slate-400 ml-1">Mobile Number</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                    <Input 
                      placeholder="98765 43210"
                      value={contactInfo.phone}
                      maxLength={10}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value.replace(/\D/g, '')})}
                      className="h-12 rounded-xl border-slate-200 pl-12 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* UPSELL / INSURANCE */}
            <div className="bg-white rounded-[2rem] border-2 border-orange-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-up">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="p-3 bg-orange-100 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide">Secure your trip</h3>
                  <p className="text-xs text-slate-500 font-medium">₹15 per person for accident & baggage cover</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-xl">
                 <span className="text-xs font-black text-orange-700">Add Insurance</span>
                 <Switch checked={addInsurance} onCheckedChange={setAddInsurance} />
              </div>
            </div>

            {/* PASSENGER CARDS */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h2 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Passenger Details</h2>
                {passengers.length > 1 && (
                   <Button variant="ghost" onClick={copyFirstPassenger} className="h-8 text-[10px] font-black text-red-600 uppercase hover:bg-red-50">
                     Copy 1st Passenger
                   </Button>
                )}
              </div>

              {passengers.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-[2rem] border bg-white p-8 transition-all duration-300 animate-fade-up
                    ${p.name.length > 2 ? 'border-orange-500 ring-4 ring-orange-50' : 'border-slate-200 shadow-sm'}`}
                  style={{ animationDelay: `${(i + 1) * 80}ms` }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-black text-slate-900">Passenger {i + 1}</div>
                        <div className="text-[11px] font-black text-orange-600 uppercase">Seat {p.seatId} • {bus.seatType}</div>
                      </div>
                    </div>
                    {p.name.length > 2 && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                    <div className="sm:col-span-7 space-y-2">
                      <Label className="text-[11px] font-black uppercase text-slate-400">Full Name</Label>
                      <Input
                        value={p.name}
                        onChange={(e) => updatePassenger(i, "name", e.target.value)}
                        placeholder="John Doe"
                        className="h-12 rounded-xl border-slate-200 focus:ring-slate-900"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-[11px] font-black uppercase text-slate-400 text-center">Age</Label>
                      <Input
                        type="number"
                        value={p.age}
                        onChange={(e) => updatePassenger(i, "age", e.target.value)}
                        className="h-12 rounded-xl text-center font-bold"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-2">
                      <Label className="text-[11px] font-black uppercase text-slate-400">Gender</Label>
                      <div className="relative">
                        <select
                            value={p.gender}
                            onChange={(e) => updatePassenger(i, "gender", e.target.value as any)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 h-12 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
  <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl sticky top-24 overflow-hidden">
    {/* Soft Grey Header */}
    <div className="bg-slate-50 p-8 border-b border-slate-100">
      <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
        <Ticket className="w-5 h-5 text-orange-500" />
        PAYMENT REVIEW
      </h3>
      <div className="mt-1 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
        {bus.from} <span className="text-orange-400 mx-1">→</span> {bus.to}
      </div>
    </div>
    
    <div className="p-8 space-y-6">
      {/* Pricing Breakdown with Grey Text */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Base Price ({selectedSeats.length} Seats)</span>
          <span className="text-slate-900 font-bold">₹{basePrice}</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Service Fee</span>
          <span className="text-slate-900 font-bold">₹{serviceFee}</span>
        </div>
        {addInsurance && (
          <div className="flex justify-between text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1">
              Insurance <ShieldCheck className="w-3 h-3 text-orange-400" />
            </span>
            <span className="text-slate-900 font-bold">₹{insuranceFee}</span>
          </div>
        )}
      </div>

      {/* Coupon Section with Soft Red Accents */}
      <div className="py-5 border-y border-slate-50">
        <Label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">
          Have a Promo Code?
        </Label>
        <div className="flex gap-2">
          <Input 
            placeholder="ENTER CODE"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="h-11 rounded-xl border-slate-200 bg-slate-50/50 font-bold text-slate-700 placeholder:text-slate-300 focus:ring-orange-500"
          />
          <Button className="h-11 px-5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-black rounded-xl transition-colors">
            APPLY
          </Button>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Grand Total</span>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{totalPrice}</span>
        </div>
        {/* Soft Savings Tag */}
        <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
           <span className="text-[9px] font-black text-orange-600 uppercase">Saving ₹0</span>
        </div>
      </div>

      {/* Main Action - Soft Orange */}
      <div className="space-y-3">
        <Button 
          size="lg" 
          disabled={!isValid} 
          onClick={handleSubmit} 
          className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg transition-all shadow-lg shadow-orange-100 group"
        >
          PROCEED TO PAY
          <ArrowRight className="h-6 w-6 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>

        {!isValid && (
          <div className="flex items-center justify-center gap-2 text-red-400">
            <Info className="w-3 h-3" />
            <p className="text-[10px] font-black uppercase tracking-tighter">
              Please complete traveler details
            </p>
          </div>
        )}
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