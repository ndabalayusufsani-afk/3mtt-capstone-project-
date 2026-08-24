import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote, Bike, Check, ChevronRight, Clock, CreditCard, Flame, Leaf, MapPin,
  Minus, Package, Phone, Plus, ShoppingCart, Star, Store, Timer, Trash, Truck, Wallet, X,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../context/StoreContext";
import { CATEGORY_TAGS, PROMO_CODES } from "../mockData";
import type { CartItem, DietaryTag, Order, PaymentMethod, Vendor, VendorMenuItem } from "../types";

const DIET_ICONS: Record<DietaryTag, typeof Leaf> = {
  Vegan: Leaf,
  Vegetarian: Leaf,
  "Gluten-Free": Leaf,
  Spicy: Flame,
  Halal: Leaf,
  "Kid-Friendly": Clock,
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3.5 w-3.5 ${n <= Math.round(rating) ? "fill-current" : "text-zinc-300"}`} />
      ))}
    </span>
  );
}

function DietaryBadges({ tags }: { tags: DietaryTag[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => {
        const Icon = DIET_ICONS[t];
        return (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
            <Icon className="h-3 w-3" /> {t}
          </span>
        );
      })}
    </div>
  );
}

/* ---------- Vendor detail / menu modal ---------- */
function VendorModal({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const { addToCart, reviews } = useStore();
  const [activeCat, setActiveCat] = useState(vendor.categories[0]?.id ?? "");
  const [itemModal, setItemModal] = useState<VendorMenuItem | null>(null);
  const [size, setSize] = useState("Regular");
  const [spice, setSpice] = useState("Mild");
  const [extras, setExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [qty, setQty] = useState(1);

  const vendorReviews = reviews.filter((r) => r.vendorId === vendor.id);

  const openItem = (item: VendorMenuItem) => {
    setItemModal(item);
    setSize("Regular");
    setSpice("Mild");
    setExtras([]);
    setNotes("");
    setQty(1);
  };

  const confirmAdd = () => {
    if (!itemModal) return;
    const cartItem: CartItem = {
      menuItemId: itemModal.id,
      vendorId: vendor.id,
      name: itemModal.name,
      price: itemModal.price + extras.length,
      image: itemModal.image,
      qty,
      size,
      spice,
      extras,
      notes,
    };
    addToCart(cartItem);
    setItemModal(null);
  };

  return (
    <motion.div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="mx-auto max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative h-52 sm:h-64">
          <img src={vendor.cover} alt={vendor.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">{vendor.name}</div>
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Stars rating={vendor.rating} />
                <span className="text-amber-300">{vendor.rating}</span>
                <span className="text-white/70">({vendor.reviewCount})</span>
                <span className="text-white/50">•</span>
                <span>{vendor.deliveryTime} min</span>
                <span className="text-white/50">•</span>
                <span>{vendor.cuisine}</span>
              </div>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">Open now</span>
          </div>
        </div>

        {/* Menu tabs */}
        <div className="sticky top-16 z-10 flex gap-2 overflow-x-auto border-b border-zinc-100 bg-white px-5 py-3">
          {vendor.categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                activeCat === c.id ? "bg-orange-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="space-y-6 p-5">
          {vendor.categories
            .filter((c) => c.id === activeCat)
            .map((cat) => (
              <div key={cat.id}>
                <h3 className="mb-3 text-lg font-bold text-zinc-900">{cat.name}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => item.available && openItem(item)}
                      className={`group flex gap-3 rounded-2xl border border-zinc-100 p-3 text-left transition hover:border-orange-300 hover:shadow-md active:scale-[0.98] ${
                        !item.available ? "opacity-50" : ""
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold leading-snug text-zinc-900">{item.name}</div>
                          <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{item.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <DietaryBadges tags={item.dietary} />
                          {item.popular && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Popular</span>}
                          {!item.available && <span className="text-[10px] font-bold uppercase text-rose-500">Sold out</span>}
                          {item.available && (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-600 text-white shadow-sm transition group-hover:scale-110">
                              <Plus className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50 p-5">
          <h4 className="mb-3 font-bold text-zinc-900">Recent reviews</h4>
          {vendorReviews.length === 0 ? (
            <p className="text-sm text-zinc-500">No reviews yet. Be the first to review after ordering!</p>
          ) : (
            <div className="space-y-3">
              {vendorReviews.slice(0, 3).map((r) => (
                <div key={r.id} className="rounded-2xl bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-800">{r.customerName}</span>
                    <Stars rating={r.rating} />
                    <span className="ml-auto text-[10px] text-zinc-400">{r.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Item customization modal */}
      {itemModal && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setItemModal(null)}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <img src={itemModal.image} alt={itemModal.name} className="h-44 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{itemModal.name}</h3>
                  <p className="mt-0.5 text-sm text-zinc-500">{itemModal.description}</p>
                </div>
                <button onClick={() => setItemModal(null)} className="rounded-full bg-zinc-100 p-1.5">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Size</label>
                <div className="mt-1.5 flex gap-2">
                  {["Regular", "Large", "Family"].map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${size === s ? "bg-orange-600 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Spice level</label>
                <div className="mt-1.5 flex gap-2">
                  {["Mild", "Medium", "Hot", "Extra Hot"].map((s) => (
                    <button key={s} onClick={() => setSpice(s)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${spice === s ? "bg-orange-600 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Extras (+$1 each)</label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {["Extra Cheese", "Extra Sauce", "Bacon", "Avocado"].map((e, i) => (
                    <button
                      key={e}
                      onClick={() => setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${extras.includes(e) ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Special instructions</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="e.g. no onions, well done..." className="mt-1 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 rounded-full border border-zinc-200 p-1">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-zinc-100">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-zinc-100">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={confirmAdd} className="flex-1 rounded-full bg-orange-600 py-3 font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 active:scale-[0.98]">
                  Add {qty} × ${(itemModal.price + extras.length).toFixed(2)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ---------- Cart drawer ---------- */
export function CartDrawer({ onClose }: { onClose: () => void }) {
  const { cart, updateCartQty, removeFromCart, cartTotal, placeOrder, vendors } = useStore();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tip, setTip] = useState(2.5);
  const [payment, setPayment] = useState<PaymentMethod>("CARD");
  const [address, setAddress] = useState("221 Baker Street, Apt 4B");
  const [placing, setPlacing] = useState(false);
  const cartItems = Object.values(cart);

  const firstVendor = cartItems[0];
  const vendor = vendors.find((v) => v.id === firstVendor?.vendorId);
  const deliveryFee = vendor && cartTotal >= vendor.freeDeliveryAbove ? 0 : vendor?.deliveryFee ?? 2;
  const subtotal = cartTotal;
  const freeProgress = vendor ? Math.min(1, cartTotal / vendor.freeDeliveryAbove) : 0;
  const total = subtotal - discount + deliveryFee + tip;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!PROMO_CODES[code]) {
      toast.error("Invalid promo code");
      return;
    }
    const d = PROMO_CODES[code] === 0 ? deliveryFee : subtotal * PROMO_CODES[code];
    setDiscount(d);
    toast.success(`Promo ${code} applied!`);
  };

  const checkout = () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    setTimeout(() => {
      placeOrder({
        vendorId: firstVendor.vendorId,
        vendorName: vendor?.name ?? "",
        customerName: "Alex Morgan",
        customerAddress: address,
        items: cartItems.map((c) => ({
          name: c.name,
          qty: c.qty,
          price: c.price,
          options: [c.size, c.spice, ...c.extras].filter(Boolean).join(", "),
        })),
        subtotal,
        deliveryFee,
        tip,
        discount,
        total: Math.round(total * 100) / 100,
        payment,
        etaMinutes: vendor ? parseInt(vendor.deliveryTime.split("-")[0]) + 5 : 35,
        note: "",
      });
      setPlacing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <motion.div onClick={(e) => e.stopPropagation()} initial={{ x: 340, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 340, opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 p-5">
          <h2 className="text-lg font-bold text-zinc-900">Your cart <span className="text-orange-600">({cartItems.length})</span></h2>
          <button onClick={onClose} className="rounded-full bg-zinc-100 p-2 hover:bg-zinc-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-orange-50 text-orange-500">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <p className="font-semibold text-zinc-800">Your cart is empty</p>
            <p className="text-sm text-zinc-500">Browse vendors and add something delicious.</p>
            <button onClick={onClose} className="mt-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white">Browse now</button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {vendor && vendor.deliveryFee > 0 && (
                <div className="rounded-xl bg-emerald-50 p-3">
                  <div className="flex justify-between text-xs font-semibold text-emerald-700">
                    <span>Free delivery at ${vendor.freeDeliveryAbove.toFixed(0)}</span>
                    <span>{Math.max(0, vendor.freeDeliveryAbove - cartTotal).toFixed(0)} to go</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-100">
                    <motion.div className="h-full bg-emerald-500" animate={{ width: `${freeProgress * 100}%` }} />
                  </div>
                </div>
              )}
              {cartItems.map((c) => {
                const key = `${c.menuItemId}-${c.size}-${c.spice}-${c.extras.join(",")}`;
                return (
                  <div key={key} className="flex gap-3 rounded-2xl border border-zinc-100 p-3">
                    <img src={c.image} alt={c.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-zinc-900">{c.name}</span>
                        <button onClick={() => removeFromCart(key)}><Trash className="h-4 w-4 text-zinc-400 hover:text-rose-500" /></button>
                      </div>
                      <p className="text-xs text-zinc-500">{c.size} • {c.spice}{c.extras.length ? ` • +${c.extras.join(", +")}` : ""}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full border border-zinc-200 p-0.5">
                          <button onClick={() => updateCartQty(key, -1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-zinc-100"><Minus className="h-3 w-3" /></button>
                          <span className="w-5 text-center text-sm font-bold">{c.qty}</span>
                          <button onClick={() => updateCartQty(key, 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-zinc-100"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="font-bold text-zinc-900">${(c.price * c.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-zinc-100 p-5">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400"
              />
              <div className="flex gap-2">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code (e.g. SAVE20)" className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400" />
                <button onClick={applyPromo} className="rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-700">Apply</button>
              </div>

              <div className="flex gap-2">
                {([["CARD", CreditCard], ["MOBILE", Wallet], ["CASH", Banknote]] as const).map(([m, Icon]) => (
                  <button key={m} onClick={() => setPayment(m)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 p-2.5 text-xs font-semibold transition ${payment === m ? "border-orange-500 bg-orange-50 text-orange-700" : "border-zinc-200 text-zinc-500"}`}>
                    <Icon className="h-4 w-4" /> {m === "CARD" ? "Card" : m === "MOBILE" ? "Mobile" : "Cash"}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 rounded-xl bg-zinc-50 p-3 text-sm">
                <div className="flex justify-between text-zinc-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-zinc-600"><span>Delivery</span><span className={deliveryFee === 0 ? "font-semibold text-emerald-600" : ""}>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span></div>
                {discount > 0 && <div className="flex justify-between font-semibold text-emerald-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex items-center justify-between text-zinc-600"><span>Tip</span>
                  <select value={tip} onChange={(e) => setTip(parseFloat(e.target.value))} className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs">
                    <option value={0}>No tip</option>
                    <option value={2.5}>$2.50</option>
                    <option value={5}>$5.00</option>
                    <option value={8}>$8.00</option>
                  </select>
                </div>
                <div className="border-t border-zinc-200 pt-1.5 text-base font-extrabold text-zinc-900"><span className="flex justify-between"><span>Total</span><span>${total.toFixed(2)}</span></span></div>
              </div>

              <button onClick={checkout} disabled={placing} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 active:scale-[0.98] disabled:opacity-60">
                {placing ? <Timer className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                {placing ? "Processing payment..." : `Place order • $${total.toFixed(2)}`}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

const STATUS_STEPS: Array<{ key: string; label: string; icon: typeof Package }> = [
  { key: "PENDING", label: "Placed", icon: Package },
  { key: "CONFIRMED", label: "Confirmed", icon: Check },
  { key: "PREPARING", label: "Preparing", icon: Store },
  { key: "READY", label: "Ready", icon: Timer },
  { key: "OUT_FOR_DELIVERY", label: "On the way", icon: Bike },
  { key: "DELIVERED", label: "Delivered", icon: Check },
];

/* ---------- Order tracker modal (embedded) ---------- */
export function OrderTrackerModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { advanceOrder, addReview, vendors } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const currentIdx = order ? STATUS_STEPS.findIndex((s) => s.key === order.status) : -1;
  const done = order?.status === "DELIVERED";
  const rejected = order?.status === "REJECTED";
  const vendor = order ? vendors.find((v) => v.id === order.vendorId) : undefined;

  const simAdvance = () => {
    if (!order || done || rejected) return;
    const next = STATUS_STEPS[currentIdx + 1];
    if (next) {
      advanceOrder(order.id, next.key as Order["status"]);
      toast.success(`Order ${order.id} moved to ${next.label}`);
    }
  };

  const days = Math.floor(Math.random() * 3) + " days ago";

  const submitReview = () => {
    if (!order) return;
    addReview({ id: `r-${Date.now()}`, vendorId: order.vendorId, customerName: "Alex Morgan", rating, comment: comment || "Great order!", date: "Just now" });
    toast.success("Review submitted, thanks!");
    onClose();
  };

  return (
    <AnimatePresence>
      {order && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="relative bg-gradient-to-br from-orange-600 to-amber-500 p-6 text-white">
              <button onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30"><X className="h-4 w-4" /></button>
              <div className="text-xs font-semibold uppercase tracking-widest text-orange-100">Live order</div>
              <div className="mt-1 text-2xl font-extrabold tracking-tight">{order.id}</div>
              <div className="mt-1 text-sm text-white/90">{order.vendorName} • ETA {order.etaMinutes} min</div>
              {done && <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold">Delivered 🎉</span>}
              {rejected && <span className="mt-3 inline-block rounded-full bg-rose-500/30 px-3 py-1 text-xs font-bold">Rejected by vendor</span>}
              {!done && !rejected && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-75" /><span className="relative h-2 w-2 rounded-full bg-white" /></span>
                  {STATUS_STEPS[currentIdx]?.label}
                </span>
              )}
            </div>

            {rejected ? (
              <div className="p-6 text-center">
                <p className="text-zinc-700">This order could not be fulfilled. No charge was made.</p>
              </div>
            ) : (
              <>
                <div className="p-6">
                  {/* Progress stepper */}
                  <div className="relative">
                    <div className="absolute left-0 right-0 top-5 h-1 bg-zinc-200" />
                    <motion.div
                      className="absolute left-0 top-5 h-1 bg-orange-500"
                      animate={{ width: `${done ? 100 : (currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                      transition={{ type: "spring", damping: 22, stiffness: 120 }}
                    />
                    <div className="relative flex justify-between">
                      {STATUS_STEPS.map((s, i) => {
                        const isCurrent = i === currentIdx;
                        const isDone = i <= currentIdx || done;
                        return (
                          <div key={s.key} className="flex w-10 flex-col items-center gap-1.5">
                            <motion.div
                              animate={{ scale: isCurrent ? 1.2 : 1 }}
                              className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${
                                isDone ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-300"
                              }`}
                            >
                              <s.icon className="h-5 w-5" />
                            </motion.div>
                            <span className={`text-center text-[10px] font-semibold leading-tight ${isDone ? "text-orange-600" : "text-zinc-400"}`}>{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Courier map simulation */}
                  <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-500">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-orange-500" /> Kitchen</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-500" /> {order.customerAddress}</span>
                    </div>
                    <div className="relative h-32 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200">
                      {/* route */}
                      <div className="absolute left-[10%] top-6 right-[10%] h-0.5 rounded bg-zinc-300" />
                      <motion.div
                        className="absolute top-[22px] h-4 w-4 rounded-full bg-emerald-500 shadow"
                        animate={{ left: [`${8 + currentIdx * 15}%`, `${8 + (currentIdx + 1) * 15}%`] }}
                        transition={{ duration: 1.5, repeat: done ? 0 : Infinity }}
                        style={{ display: "grid", placeItems: "center" }}
                      >
                        <Bike className="h-3 w-3 text-white" />
                      </motion.div>
                      <div className="absolute left-[8%] top-4 text-2xl">🏪</div>
                      <div className="absolute right-[8%] top-4 text-2xl">🏠</div>
                    </div>
                    {!done && (
                      <button onClick={simAdvance} className="mt-4 w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 active:scale-[0.98]">
                        Simulate next stage →
                      </button>
                    )}
                  </div>
                </div>

                {done && (
                  <div className="border-t border-zinc-100 bg-zinc-50 p-6">
                    <h4 className="font-bold text-zinc-900">How was your order?</h4>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setRating(n)} className={`text-2xl transition hover:scale-110 ${n <= rating ? "text-amber-400" : "text-zinc-300"}`}>★</button>
                      ))}
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a review..." rows={2} className="mt-3 w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-orange-400" />
                    <button onClick={submitReview} className="mt-2 w-full rounded-xl bg-orange-600 py-3 font-bold text-white transition hover:bg-orange-700 active:scale-[0.98]">Submit review</button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Main customer view ---------- */
interface CustomerViewProps {
  onOpenCart: () => void;
  setTrackerOrder: (o: Order | null) => void;
}

export function CustomerView({ onOpenCart, setTrackerOrder }: CustomerViewProps) {
  const { vendors, orders, cartCount } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(30);
  const [vegOnly, setVegOnly] = useState(false);
  const [selected, setSelected] = useState<Vendor | null>(null);
  const feature = vendors[0];

  const filtered = useMemo(() => {
    return vendors
      .filter((v) => v.status === "APPROVED")
      .filter((v) => category === "All" || v.cuisine.includes(category) || v.categories.some((c) => c.name === category))
      .filter((v) => !query || v.name.toLowerCase().includes(query.toLowerCase()) || v.cuisine.toLowerCase().includes(query.toLowerCase()) || v.categories.some((c) => c.items.some((i) => i.name.toLowerCase().includes(query.toLowerCase()))))
      .filter((v) => v.categories.some((c) => c.items.some((i) => i.price <= maxPrice)))
      .filter((v) => (vegOnly ? v.categories.some((c) => c.items.some((i) => i.dietary.includes("Vegan") || i.dietary.includes("Vegetarian"))) : true));
  }, [vendors, category, query, maxPrice, vegOnly]);

  const liveOrder = orders.find((o) => o.status !== "DELIVERED" && o.status !== "REJECTED");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      {/* Live order banner */}
      {liveOrder && (
        <button onClick={() => setTrackerOrder(liveOrder)} className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-left shadow-sm transition hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3"><span className="absolute h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" /><span className="relative h-3 w-3 rounded-full bg-orange-600" /></span>
            <div>
              <div className="font-bold text-zinc-900">Order {liveOrder.id} is {liveOrder.status.replace(/_/g, " ").toLowerCase()}</div>
              <div className="text-xs text-zinc-500">{liveOrder.vendorName} • ETA {liveOrder.etaMinutes} min</div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-orange-500" />
        </button>
      )}

      {/* Hero */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-8 text-white shadow-xl shadow-orange-600/20 lg:py-14">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Store className="h-3.5 w-3.5" /> 6 featured kitchens
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">Good food, delivered fast.</h1>
          <p className="mt-3 max-w-md text-orange-50">Discover artisan kitchens near you. Order, track live, and eat happy.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-orange-700">
              <Clock className="h-4 w-4" /> 25 min avg delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Truck className="h-4 w-4" /> Free delivery over $25
            </span>
          </div>
        </div>

        <div className="relative min-h-[260px] overflow-hidden rounded-3xl">
          {feature ? (
            <button onClick={() => setSelected(feature)} className="group relative block h-full w-full text-left">
              <img src={feature.cover} alt={feature.name} className={`h-full w-full object-cover ${!feature.isOpen ? "grayscale" : ""}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">Featured</span>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xl font-extrabold">{feature.name}</div>
                    <div className="flex items-center gap-2 text-sm text-white/85">
                      <Stars rating={feature.rating} /><span className="text-amber-300">{feature.rating}</span>({feature.reviewCount}) • {feature.deliveryTime} min
                    </div>
                  </div>
                  <span className={`grid h-10 w-10 place-items-center rounded-full bg-white text-zinc-900 transition group-hover:scale-110 ${!feature.isOpen ? "opacity-60" : ""}`}>
                    <ChevronRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </button>
          ) : (
            <div className="grid h-full w-full place-items-center bg-zinc-100 text-zinc-400">Loading...</div>
          )}
        </div>
      </section>

      {/* Category pills */}
      <section className="mt-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORY_TAGS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-95 ${
                category === c ? "bg-zinc-900 text-white shadow" : "bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 hover:ring-orange-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Filters + grid */}
      <section className="mt-4 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <aside className="hidden rounded-2xl border border-zinc-200 bg-white p-5 lg:block">
          <h3 className="font-bold text-zinc-900">Filters</h3>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Max price</label>
            <div className="mt-2 flex items-center gap-2">
              <input type="range" min={10} max={40} value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} className="w-full accent-orange-600" />
              <span className="w-12 text-right font-bold text-orange-600">${maxPrice}</span>
            </div>
          </div>
          <div className="mt-5">
            <button onClick={() => setVegOnly((v) => !v)} className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition ${vegOnly ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-zinc-200 text-zinc-600"}`}>
              <span className={`grid h-5 w-5 place-items-center rounded-md ${vegOnly ? "bg-emerald-500 text-white" : "border-2 border-zinc-300"}`}>{vegOnly && <Check className="h-3.5 w-3.5" />}</span>
              <Leaf className="h-4 w-4" /> Vegan & veggie friendly
            </button>
          </div>
          <div className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
            {filtered.length} kitchens match your filters
          </div>
        </aside>

        {/* Vendor grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <p className="font-semibold text-zinc-700">No kitchens found</p>
              <p className="mt-1 text-sm text-zinc-500">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v, i) => (
                <motion.button
                  key={v.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(v)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={v.image} alt={v.name} className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${!v.isOpen ? "grayscale" : ""}`} />
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${v.isOpen ? "bg-emerald-500 text-white" : "bg-zinc-800/80 text-white"}`}>
                      {v.isOpen ? "Open now" : "Closed"}
                    </span>
                    <span className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {v.deliveryTime} min
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-zinc-900">{v.name}</h3>
                      <span className="text-sm font-bold text-zinc-900">${v.deliveryFee.toFixed(2)}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{v.cuisine}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" />{v.rating}</span>
                      <span className="text-zinc-400">({v.reviewCount})</span>
                      <span className="ml-auto inline-flex items-center gap-0.5 text-zinc-400"><MapPin className="h-3.5 w-3.5" />{v.distanceKm} km</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
                      <span className="text-xs text-zinc-500">{v.tagline}</span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-zinc-700 transition group-hover:bg-orange-600 group-hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating add-to-cart on mobile + cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 lg:hidden">
          <button onClick={onOpenCart} className="flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3.5 text-sm font-bold text-white shadow-2xl active:scale-95">
            <ShoppingCart className="h-4 w-4" /> View cart • {cartCount}
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && <VendorModal vendor={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}