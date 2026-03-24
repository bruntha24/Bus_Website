import { HelpCircle, Search, MessageCircle, Phone, Mail, ChevronRight, Clock, CreditCard, ShieldCheck, Tag } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "Booking",
    icon: <Clock className="w-4 h-4 text-orange-500" />,
    items: [
      { q: "How do I book a bus ticket?", a: "Search for your route on the home page, select a bus, pick your seats, fill in passenger details, and confirm your booking. It's that simple!" },
      { q: "Can I book multiple seats at once?", a: "Yes, you can select up to 6 seats in a single booking. Each seat requires passenger details." },
      { q: "What happens if I don't complete booking in time?", a: "Selected seats are held for 2 minutes. If you don't complete the booking within that time, the seats are released." },
    ],
  },
  {
    category: "Cancellation & Refunds",
    icon: <ShieldCheck className="w-4 h-4 text-red-500" />,
    items: [
      { q: "How do I cancel my booking?", a: "Go to 'My Bookings', find your booking, and click the 'Cancel' button. Cancellation is available for upcoming confirmed bookings only." },
      { q: "What is the refund policy?", a: "Refunds are processed within 5-7 business days. Cancellations made 24+ hours before departure get a full refund." },
    ],
  },
  {
    category: "Travel Policies",
    icon: <CreditCard className="w-4 h-4 text-blue-500" />,
    items: [
      { q: "What should I carry for boarding?", a: "Carry a valid photo ID (Aadhaar, PAN, Passport, or Driving License) and your digital booking confirmation." },
      { q: "Is there a luggage limit?", a: "Each passenger can carry up to 15 kg of luggage. Additional luggage may incur charges." },
    ],
  },
  {
    category: "Promo Codes",
    icon: <Tag className="w-4 h-4 text-green-500" />,
    items: [
      { q: "How do I use a promo code?", a: "Enter your promo code on the booking confirmation page before completing payment. The discount applies automatically." },
      { q: "Where can I find promo codes?", a: "Check our Offers page for the latest deals and promo codes." },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  // Simple search filter logic
  const filteredFaqs = faqs.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      {/* --- SOFT HERO SEARCH SECTION --- */}
      <section className="bg-[#FCFBFA] pt-20 pb-28 px-4 overflow-hidden relative border-b border-slate-100">
        {/* Soft Mesh Gradient Blobs */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100/50 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-10 right-0 w-80 h-80 bg-slate-100/60 rounded-full blur-[80px]" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-orange-50/40 rounded-[100%] blur-[60px]" />
        </div>

        <div className="container max-w-3xl relative z-10 text-center space-y-6">
          {/* Soft Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200/60 shadow-sm rounded-full">
            <HelpCircle className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Support Center</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            How can we <span className="text-orange-500 underline decoration-orange-200 decoration-4 underline-offset-4">help?</span>
          </h1>
          
          <p className="text-slate-500 font-medium max-w-lg mx-auto text-sm">
            Search our knowledge base for instant answers to your booking and travel queries.
          </p>
          
          {/* Refined Search Bar */}
          <div className="relative max-w-xl mx-auto group mt-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
            <Input 
              placeholder="Search for topics, keywords, or questions..."
              className="h-16 pl-14 pr-6 rounded-3xl bg-white border-slate-200/80 text-slate-900 shadow-xl shadow-slate-200/40 placeholder:text-slate-400 font-medium transition-all focus-visible:ring-4 focus-visible:ring-orange-500/10 focus-visible:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* --- FAQ CONTENT --- */}
      <div className="container -mt-10 pb-20 flex-1 max-w-3xl relative z-20">
        <div className="space-y-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((section, si) => (
              <div
                key={section.category}
                className="animate-fade-up"
                style={{ animationDelay: `${si * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4 ml-1">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    {section.icon}
                  </div>
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    {section.category}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {section.items.map((item, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`${si}-${i}`} 
                      className="border border-slate-100 bg-white rounded-2xl overflow-hidden px-2 transition-all hover:border-orange-200 hover:shadow-md"
                    >
                      <AccordionTrigger className="px-4 py-4 text-sm font-bold text-slate-700 text-left hover:no-underline hover:text-orange-600 group">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-3">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic">No results found for "{searchQuery}"</p>
                <button onClick={() => setSearchQuery("")} className="mt-2 text-orange-500 font-black text-xs uppercase tracking-widest underline">Clear Search</button>
            </div>
          )}
        </div>

        {/* --- CONTACT GRID --- */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up stagger-4">
           <ContactCard 
            icon={<MessageCircle className="w-5 h-5" />} 
            title="Chat Support" 
            sub="Avg. response: 2 mins"
            color="bg-orange-500"
           />
           <ContactCard 
            icon={<Phone className="w-5 h-5" />} 
            title="1800-123-4567" 
            sub="Available 24/7"
            color="bg-slate-900"
           />
           <ContactCard 
            icon={<Mail className="w-5 h-5" />} 
            title="support@busgo.in" 
            sub="Email us anytime"
            color="bg-slate-900"
           />
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Sub-component for contact cards
function ContactCard({ icon, title, sub, color }: { icon: any, title: string, sub: string, color: string }) {
    return (
        <div className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
            <div className={`w-10 h-10 ${color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <h3 className="font-black text-slate-800 text-sm mb-1">{title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </div>
    )
}