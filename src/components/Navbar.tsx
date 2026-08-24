import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, MapPin, Search, ShoppingCart, Store, UserRound } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CITIES } from "../mockData";
import type { UserRole } from "../types";

interface NavbarProps {
  query: string;
  setQuery: (q: string) => void;
  onOpenCart: () => void;
  onOpenTracker: () => void;
}

export function Navbar({ query, setQuery, onOpenCart, onOpenTracker }: NavbarProps) {
  const { role, setRole, cartCount, orders } = useStore();
  const [city, setCity] = useState(CITIES[0]);
  const [roleOpen, setRoleOpen] = useState(false);
  const activeLive = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "REJECTED").length;

  const roles: Array<{ key: UserRole; label: string; icon: typeof UserRound }> = [
    { key: "customer", label: "Customer", icon: UserRound },
    { key: "vendor", label: "Vendor", icon: Store },
    { key: "admin", label: "Admin", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => setRole("customer")}
          className="flex shrink-0 items-center gap-2 text-left"
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-600 text-white shadow-sm shadow-orange-600/30">
            <span className="text-lg leading-none">🍔</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-extrabold tracking-tight text-zinc-900">Cravery</div>
            <div className="-mt-1 text-[10px] font-medium uppercase tracking-widest text-orange-600">food, delivered</div>
          </div>
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, cuisines, vendors..."
            className="h-10 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        {/* City */}
        <div className="hidden items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-600 md:flex">
          <MapPin className="h-4 w-4 text-orange-600" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent outline-none"
            aria-label="Delivery city"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </div>

        {/* Live orders */}
        {activeLive > 0 && (
          <button
            onClick={onOpenTracker}
            className="relative hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            {activeLive} live
          </button>
        )}

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-700 active:scale-95"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          {cartCount > 0 && (
            <motion.span
              key={cartCount}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow"
            >
              {cartCount}
            </motion.span>
          )}
        </button>

        {/* Role switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-orange-400 active:scale-95"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-orange-100 text-orange-600">
              {(() => {
                const Icon = roles.find((r) => r.key === role)?.icon ?? UserRound;
                return <Icon className="h-3.5 w-3.5" />;
              })()}
            </span>
            <span className="hidden sm:block">{role === "customer" ? "Foodie" : role === "vendor" ? "Store Manager" : "Admin"}</span>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </button>
          {roleOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setRoleOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-zinc-200 bg-white py-1.5 shadow-xl"
              >
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      setRole(r.key);
                      setRoleOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-zinc-50 ${
                      role === r.key ? "font-semibold text-orange-600" : "text-zinc-700"
                    }`}
                  >
                    <r.icon className="h-4 w-4" />
                    {r.label}
                    {role === r.key && <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}