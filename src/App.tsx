import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { CartDrawer, CustomerView, OrderTrackerModal } from "./components/CustomerView";
import { VendorDashboard } from "./components/VendorDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import type { Order } from "./types";

function Shell() {
  const { role, setRole, cart } = useStore();
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [trackerOrder, setTrackerOrder] = useState<Order | null>(null);
  const cartCount = Object.keys(cart).length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar query={query} setQuery={setQuery} onOpenCart={() => setCartOpen(true)} onOpenTracker={() => setRole("customer")} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div key={role} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {role === "customer" && <CustomerView onOpenCart={() => setCartOpen(true)} setTrackerOrder={setTrackerOrder} />}
            {role === "vendor" && <VendorDashboard />}
            {role === "admin" && <AdminDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <span className="font-bold text-zinc-700">Cravery</span>
          <span>Craving something good? Order it fresh.</span>
          <span>Multi-vendor demo</span>
        </div>
      </footer>

      <AnimatePresence>{cartCount > 0 && cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}</AnimatePresence>
      <OrderTrackerModal order={trackerOrder} onClose={() => setTrackerOrder(null)} />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}