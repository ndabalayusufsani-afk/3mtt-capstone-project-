import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { CartItem, MenuCategory, Order, OrderStatus, PlatformMetrics, Review, UserRole, Vendor, VendorMenuItem } from "../types";
import { METRICS, PROMO_CODES, SEED_ORDERS, SEED_REVIEWS, VENDORS } from "../mockData";

const LS_ROLE = "cravery_role";
const LS_CART = "cravery_cart";
const LS_VENDORS = "cravery_vendors";
const LS_ORDERS = "cravery_orders";
const LS_REVIEWS = "cravery_reviews";

const STATUS_FLOW: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export interface StoreCtx {
  role: UserRole;
  setRole: (r: UserRole) => void;
  vendors: Vendor[];
  orders: Order[];
  reviews: Review[];
  metrics: PlatformMetrics;
  cart: Record<string, CartItem>;
  addToCart: (item: CartItem) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  placeOrder: (o: Omit<Order, "id" | "status" | "placedAt">) => Order;
  advanceOrder: (id: string, status: OrderStatus) => void;
  updateVendor: (v: Vendor) => void;
  toggleItemAvailability: (vendorId: string, itemId: string) => void;
  addMenuItem: (vendorId: string, categoryId: string, item: VendorMenuItem) => void;
  updateMenuItem: (vendorId: string, item: VendorMenuItem) => void;
  addCategory: (vendorId: string, name: string) => void;
  deleteMenuItem: (vendorId: string, itemId: string) => void;
  adjustVendorStatus: (vendorId: string, status: Vendor["status"]) => void;
  addReview: (r: Review) => void;
}

const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleRaw] = useState<UserRole>(() => load<UserRole>(LS_ROLE, "customer"));
  const [vendors, setVendors] = useState<Vendor[]>(() => load<Vendor[]>(LS_VENDORS, VENDORS));
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>(LS_ORDERS, SEED_ORDERS));
  const [reviews, setReviews] = useState<Review[]>(() => load<Review[]>(LS_REVIEWS, SEED_REVIEWS));
  const [cart, setCart] = useState<Record<string, CartItem>>(() => load<Record<string, CartItem>>(LS_CART, {}));

  useEffect(() => save(LS_ROLE, role), [role]);
  useEffect(() => save(LS_VENDORS, vendors), [vendors]);
  useEffect(() => save(LS_ORDERS, orders), [orders]);
  useEffect(() => save(LS_REVIEWS, reviews), [reviews]);
  useEffect(() => save(LS_CART, cart), [cart]);

  const setRole = (r: UserRole) => {
    setRoleRaw(r);
    toast.success(`Switched view to ${r === "customer" ? "Customer" : r === "vendor" ? "Vendor Portal" : "Admin Console"}`);
  };

  const addToCart = (item: CartItem) => {
    const key = `${item.menuItemId}-${item.size}-${item.spice}-${item.extras.join(",")}`;
    setCart((prev) => {
      const existing = prev[key];
      const next = { ...prev };
      next[key] = existing ? { ...existing, qty: existing.qty + 1 } : { ...item, qty: 1 };
      return next;
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const next = { ...prev };
      if (cur.qty + delta <= 0) delete next[id];
      else next[id] = { ...cur, qty: cur.qty + delta };
      return next;
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const clearCart = () => setCart({});

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cartItems.reduce((s, c) => s + c.price * c.qty, 0);

  const placeOrder: StoreCtx["placeOrder"] = (o) => {
    const id = `CRV-${Math.floor(10500 + Math.random() * 400)}`;
    const order: Order = { ...o, id, status: "PENDING", placedAt: Date.now() };
    setOrders((prev) => [order, ...prev]);
    setCart({});
    toast.success(`Order ${id} placed! Track it live.`);
    return order;
  };

  const advanceOrder = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        toast.info(`Order ${id} ${status === "OUT_FOR_DELIVERY" ? "is out for delivery 🛵" : `→ ${status.toLowerCase()}`}`);
        return { ...o, status };
      }),
    );
  };

  const updateVendor = (v: Vendor) => setVendors((prev) => prev.map((x) => (x.id === v.id ? v : x)));
  const adjustVendorStatus = (vendorId: string, status: Vendor["status"]) =>
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== vendorId) return v;
        toast.success(`${v.name} ${status === "SUSPENDED" ? "suspended" : status === "PENDING_REVIEW" ? "moved to review" : "approved"}`);
        return { ...v, status };
      }),
    );

  const toggleItemAvailability = (vendorId: string, itemId: string) =>
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              categories: v.categories.map((c) => ({
                ...c,
                items: c.items.map((i) => (i.id === itemId ? { ...i, available: !i.available } : i)),
              })),
            },
      ),
    );

  const addMenuItem: StoreCtx["addMenuItem"] = (vendorId, categoryId, item) =>
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              categories: v.categories.map((c) =>
                c.id === categoryId ? { ...c, items: [...c.items, { ...item, categoryId }] } : c,
              ),
            },
      ),
    );

  const updateMenuItem: StoreCtx["updateMenuItem"] = (vendorId, item) =>
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              categories: v.categories.map((c) => ({
                ...c,
                items: c.items.map((i) => (i.id === item.id ? item : i)),
              })),
            },
      ),
    );

  const deleteMenuItem = (vendorId: string, itemId: string) =>
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : {
              ...v,
              categories: v.categories.map((c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) })),
            },
      ),
    );

  const addCategory: StoreCtx["addCategory"] = (vendorId, name) =>
    setVendors((prev) =>
      prev.map((v) =>
        v.id !== vendorId
          ? v
          : { ...v, categories: [...v.categories, { id: `cat-${Date.now()}`, name, items: [] }] },
      ),
    );

  const addReview = (r: Review) => {
    setReviews((prev) => [r, ...prev]);
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== r.vendorId) return v;
        const newCount = v.reviewCount + 1;
        const newRating = (v.rating * v.reviewCount + r.rating) / newCount;
        return { ...v, rating: Math.round(newRating * 10) / 10, reviewCount: newCount };
      }),
    );
  };

  const metrics = useMemo<PlatformMetrics>(() => {
    const gmv = orders.reduce((s, o) => s + o.total, 0);
    return { ...METRICS, gmv: METRICS.gmv + gmv, totalOrders: METRICS.totalOrders + orders.length };
  }, [orders]);

  const value: StoreCtx = {
    role, setRole, vendors, orders, reviews, metrics, cart,
    addToCart, updateCartQty, removeFromCart, clearCart, cartCount, cartTotal,
    placeOrder, advanceOrder, updateVendor, toggleItemAvailability,
    addMenuItem, updateMenuItem, addCategory, deleteMenuItem, adjustVendorStatus, addReview,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export { STATUS_FLOW };
export type { MenuCategory };