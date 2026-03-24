import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { MapPin, ArrowRight, CalendarIcon, Search, Tag, Copy, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useBookingStore,offers,getCities } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import heroBus from "@/assets/hero-bus.jpg";

const popularRoutes = [
  { from: "Mumbai", to: "Pune" },
  { from: "Delhi", to: "Jaipur" },
  { from: "Bangalore", to: "Chennai" },
  { from: "Hyderabad", to: "Goa" },
  { from: "Kolkata", to: "Lucknow" },
  { from: "Ahmedabad", to: "Indore" },
];

export default function Index() {
  const navigate = useNavigate();
  const setSearch = useBookingStore((s) => s.setSearch);
  const cities = getCities();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date>();
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleSearch = () => {
    if (!from || !to || !date) return;
    setSearch(from, to, format(date, "yyyy-MM-dd"));
    navigate(`/buses?from=${from}&to=${to}&date=${format(date, "yyyy-MM-dd")}`);
  };

  const handleQuickRoute = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);
    setSearch(f, t, format(tomorrow, "yyyy-MM-dd"));
    navigate(`/buses?from=${f}&to=${t}&date=${format(tomorrow, "yyyy-MM-dd")}`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CityDropdown = ({
    value,
    onChange,
    open,
    setOpen,
    placeholder,
    exclude,
  }: {
    value: string;
    onChange: (v: string) => void;
    open: boolean;
    setOpen: (o: boolean) => void;
    placeholder: string;
    exclude: string;
  }) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-left text-sm w-full hover:border-primary/40 transition-colors">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
            {value || placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="start">
        <div className="max-h-56 overflow-y-auto">
          {cities
            .filter((c) => c !== exclude)
            .map((city) => (
              <button
                key={city}
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  city === value ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"
                )}
              >
                {city}
              </button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBus} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="container relative z-10 py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance leading-[1.1]">
              Travel smarter,<br />book your bus today
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-lg">
              Search hundreds of routes across India. Compare prices, pick your seat, and ride in comfort.
            </p>
          </div>

          {/* Search card */}
          <div className="mt-8 max-w-3xl animate-fade-up stagger-1">
            <div className="rounded-2xl border bg-card/95 backdrop-blur p-4 md:p-6 shadow-xl shadow-black/5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From</label>
                  <CityDropdown
                    value={from}
                    onChange={setFrom}
                    open={fromOpen}
                    setOpen={setFromOpen}
                    placeholder="Departure city"
                    exclude={to}
                  />
                </div>

                <div className="relative">
                  <div className="hidden md:flex absolute -left-5 top-1/2 translate-y-1 z-10 h-8 w-8 items-center justify-center rounded-full border bg-card shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To</label>
                  <CityDropdown
                    value={to}
                    onChange={setTo}
                    open={toOpen}
                    setOpen={setToOpen}
                    placeholder="Arrival city"
                    exclude={from}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-left text-sm w-full hover:border-primary/40 transition-colors">
                        <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                        <span className={date ? "text-foreground font-medium" : "text-muted-foreground"}>
                          {date ? format(date, "EEE, dd MMM") : "Pick date"}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  size="lg"
                  onClick={handleSearch}
                  disabled={!from || !to || !date}
                  className="h-[46px] px-6 rounded-lg font-semibold"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="container py-12 animate-fade-up stagger-2">
        <h2 className="text-xl font-bold mb-5">Choose your Routes:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularRoutes.map((r) => (
            <button
              key={r.from + r.to}
              onClick={() => handleQuickRoute(r.from, r.to)}
              className="group rounded-xl border bg-card p-4 text-left hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 active:scale-[0.97]"
            >
              <div className="text-sm font-semibold">{r.from}</div>
              <ArrowRight className="h-3 w-3 text-muted-foreground my-1 group-hover:text-primary transition-colors" />
              <div className="text-sm font-semibold">{r.to}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="container pb-12 animate-fade-up stagger-3">
        <div className="flex items-center gap-2 mb-5">
          <Gift className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold">Offers & Discounts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {offer.discount}
                </span>
                <button
                  onClick={() => copyCode(offer.code)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedCode === offer.code ? (
                    <><Check className="h-3 w-3 text-success" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy</>
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
              <div className="flex items-center gap-1.5">
                <Tag className="h-3 w-3 text-primary" />
                <code className="text-xs font-bold text-primary">{offer.code}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
