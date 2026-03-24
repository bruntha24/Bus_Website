import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MapPin, Bus, XCircle, Clock, 
  Trash2, AlertCircle, ArrowRight, CheckCircle2, HelpCircle 
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/bookings";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);

  // 1. READ: Fetch bookings from MongoDB
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. UPDATE: Confirm and execute Cancellation
  const confirmCancel = async () => {
    if (!cancelId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${cancelId}`, {
        method: "PATCH",
      });
      if (response.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === cancelId ? { ...b, status: "cancelled" } : b))
        );
        setCancelId(null);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  // 3. DELETE: Permanent removal after confirmation
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${deleteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const sorted = [...bookings].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());
  const upcoming = sorted.filter((b) => b.status === "confirmed" && new Date(b.date) >= new Date());
  const past = sorted.filter((b) => b.status !== "confirmed" || new Date(b.date) < new Date());

  const BookingCard = ({ booking, isPast }: { booking: any, isPast?: boolean }) => (
    <div className={`group relative rounded-[2rem] border bg-white p-6 transition-all duration-300 ${
      isPast ? "opacity-75 grayscale-[0.2] hover:grayscale-0" : "shadow-sm hover:shadow-xl border-slate-100"
    }`}>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isPast ? "bg-slate-100" : "bg-orange-50"}`}>
              <Bus className={`h-5 w-5 ${isPast ? "text-slate-400" : "text-orange-500"}`} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 tracking-tight">{booking.bus.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {booking._id.slice(-8)}</p>
            </div>
            <span className={`ml-auto md:ml-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-tighter ${
              booking.status === "confirmed" ? "bg-green-100 text-green-700" :
              booking.status === "cancelled" ? "bg-red-50 text-red-600" :
              "bg-slate-100 text-slate-600"
            }`}>
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <span>{booking.bus.from}</span>
            <ArrowRight className="h-3 w-3 text-slate-300" />
            <span>{booking.bus.to}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-orange-400" />{booking.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-400" />{booking.bus.departureTime}</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-orange-400" />{booking.seats.length} Seats</span>
          </div>
        </div>

        <div className="flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">₹{booking.totalPrice}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Paid</p>
          </div>
          
          <div className="flex gap-2">
            {booking.status === "confirmed" ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 font-bold text-xs"
                onClick={() => setCancelId(booking._id)}
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Cancel Journey
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => setDeleteId(booking._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {booking.passengers?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-slate-50 flex flex-wrap gap-2">
          {booking.passengers.map((p: any, i: number) => (
            <span key={i} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-100">
              {p.name} • {p.gender[0]}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Navbar />
      
      <section className="bg-[#FCFBFA] pt-12 pb-12 px-4 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="container max-w-4xl relative z-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Bookings</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage your tickets and travel history.</p>
        </div>
      </section>

      <div className="container py-12 flex-1 max-w-4xl relative">
        {loading ? (
           <div className="text-center py-20 font-bold text-slate-400">Loading your journeys...</div>
        ) : sorted.length === 0 ? (
          <div className="rounded-[3rem] border border-dashed border-slate-200 p-20 text-center bg-white">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bus className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No journeys found</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Book your next trip to see it here.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-slate-100" />
                    <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Upcoming Trips</h2>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="space-y-4">
                  {upcoming.map((b) => <BookingCard key={b._id} booking={b} />)}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-slate-100" />
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Past History</h2>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="space-y-4">
                  {past.map((b) => <BookingCard key={b._id} booking={b} isPast />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- CANCELLATION DIALOG --- */}
        {cancelId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                 <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                    <HelpCircle className="h-8 w-8 text-orange-500" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Cancel Journey?</h3>
                 <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                   Are you sure you want to cancel your journey? This will free up your seats for other travelers.
                 </p>
                 <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-2xl font-black text-slate-500"
                      onClick={() => setCancelId(null)}
                    >
                      Keep It
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black"
                      onClick={confirmCancel}
                    >
                      Yes, Cancel
                    </Button>
                 </div>
              </div>
          </div>
        )}

        {/* --- DELETE DIALOG --- */}
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                 <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Delete History?</h3>
                 <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                   This record will be permanently removed from your dashboard.
                 </p>
                 <div className="flex gap-3">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-2xl font-black text-slate-500"
                      onClick={() => setDeleteId(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black"
                      onClick={confirmDelete}
                    >
                      Yes, Delete
                    </Button>
                 </div>
              </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}