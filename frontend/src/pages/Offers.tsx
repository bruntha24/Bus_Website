import { Gift, Copy, Check, Timer, Zap, Info, Ticket, Sparkles } from "lucide-react";
import { useState } from "react";
import { offers } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOffers = filter === "All" 
    ? offers 
    : offers.filter(o => o.code.toLowerCase().includes(filter.toLowerCase().replace(" ", "")));

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <div className="container py-10 flex-1 max-w-5xl">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Gift className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Rewards</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Offers For You</h1>
          </div>

          {/* Mini Filter Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            {["All", "First", "Travel", "Save"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                  ${filter === tab 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* COMPACT TICKET GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOffers.map((offer, i) => (
            <div
              key={offer.code}
              className="group relative flex bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Left Side: Value */}
              <div className="relative w-28 flex flex-col items-center justify-center bg-slate-50 border-r border-dashed border-slate-200 shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="text-2xl font-black text-slate-900">{offer.discount}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Discount</span>
                
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FDFDFD] border border-slate-100 rounded-full" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#FDFDFD] border border-slate-100 rounded-full" />
              </div>

              {/* Right Side: Content */}
              <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded uppercase">Verified</span>
                       {offer.discount.includes('50') && <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />}
                    </div>
                    <p className="text-xs text-slate-500 font-bold truncate pr-2">
                      {offer.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0">
                    <div className="flex items-center gap-1 text-red-500">
                       <Timer className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase">Ending</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <button className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase hover:text-slate-500 transition-colors">
                    <Info className="w-3 h-3" /> T&C
                  </button>

                  {/* UPDATE: Amazing Copy Button with Icon */}
                  <Button
                    onClick={() => copyCode(offer.code)}
                    variant="ghost"
                    className={`h-9 px-3 rounded-xl font-black text-[11px] tracking-widest transition-all duration-300 border
                      ${copiedCode === offer.code 
                        ? "bg-green-50 text-green-600 border-green-100" 
                        : "bg-orange-50/50 text-slate-900 border-slate-100 hover:border-orange-200 hover:bg-orange-50"}`}
                  >
                    <span className="flex items-center gap-2">
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3px]" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <span className="text-orange-600">{offer.code}</span>
                          <Copy className="h-3.5 w-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between p-6 bg-slate-900 rounded-3xl overflow-hidden relative">
            <Ticket className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
            <div className="relative z-10 text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-white font-black text-lg">Never miss a price drop</h3>
                <p className="text-slate-400 text-xs font-medium">We'll send the best coupons directly to your inbox.</p>
            </div>
            <div className="relative z-10 flex gap-2 w-full md:w-auto">
                <input 
                    type="text" 
                    placeholder="Email Address" 
                    className="bg-white/10 border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-6 rounded-xl">
                    JOIN
                </Button>
            </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}