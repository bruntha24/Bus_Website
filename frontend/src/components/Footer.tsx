import { Bus } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Bus className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              BusGo
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Book bus tickets across India with ease. Safe, reliable, and affordable travel at your fingertips.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: "/bookings", label: "My Bookings" },
                { to: "/offers", label: "Offers" },
                { to: "/faq", label: "Help & FAQ" },
                { to: "/tracking", label: "Track Bus" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>support@busgo.in</p>
              <p>1800-123-4567 (Toll Free)</p>
              <p>Mon – Sat, 8AM – 10PM</p>
            </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BusGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
