import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Check, ChefHat, Clock, Image as ImageIcon, LayoutDashboard, Menu as MenuIcon, Package, Plus, Store, Timer, Trash, TrendingUp, Utensils, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../context/StoreContext";
import type { Order, Vendor, VendorMenuItem } from "../types";

const ACTION_BY_STAGE: Record<string, Array<{ to: Order["status"]; label: string; cls: string }>> = {
  PENDING: [{ to: "CONFIRMED", label: "Accept", cls: "bg-emerald-600 hover:bg-emerald-700" }, { to: "REJECTED", label: "Reject", cls: "bg-rose-500 hover:bg-rose-600" }],
  CONFIRMED: [{ to: "PREPARING", label: "Start preparing", cls: "bg-amber-600 hover:bg-amber-700" }],
  PREPARING: [{ to: "READY", label: "Ready for pickup", cls: "bg-orange-600 hover:bg-orange-700" }],
  READY: [{ to: "OUT_FOR_DELIVERY", label: "Dispatch", cls: "bg-zinc-900 hover:bg-zinc-700" }],
  OUT_FOR_DELIVERY: [{ to: "DELIVERED", label: "Mark delivered", cls: "bg-emerald-600 hover:bg-emerald-700" }],
  DELIVERED: [],
  REJECTED: [],
};

const TABS = ["Orders", "Menu", "Analytics", "Profile"] as const;

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Wallet; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-2xl font-extrabold text-zinc-900">{value}</div>
      <div className="text-xs font-medium text-zinc-500">{label}</div>
    </div>
  );
}

export function VendorDashboard() {
  const { vendors, orders, updateVendor, toggleItemAvailability, addMenuItem, updateMenuItem, deleteMenuItem, addCategory } = useStore();
  const [vendorId, setVendorId] = useState(vendors[0]?.id ?? "");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Orders");
  const vendor = vendors.find((v) => v.id === vendorId) ?? vendors[0];
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [form, setForm] = useState({ name: "", description: "", price: "10", categoryId: "", image: "" });

  const vendorOrders = useMemo(() => orders.filter((o) => o.vendorId === vendorId), [orders, vendorId]);
  const liveOrders = vendorOrders.filter((o) => o.status !== "DELIVERED" && o.status !== "REJECTED");
  const todayRevenue = vendorOrders.filter((o) => o.status === "DELIVERED").reduce((s, o) => s + o.total, 0);
  const avgOrder = vendorOrders.filter((o) => o.status === "DELIVERED").length
    ? todayRevenue / vendorOrders.filter((o) => o.status === "DELIVERED").length
    : 0;

  if (!vendor) return <div className="p-10 text-center text-zinc-500">No vendor data available.</div>;

  const saveForm = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const item: VendorMenuItem = {
      id: `m-${Date.now()}`,
      name: form.name,
      description: form.description || "Delicious new item",
      price: parseFloat(form.price),
      image: form.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      categoryId: form.categoryId || vendor.categories[0]?.id || "cat",
      dietary: [],
      available: true,
    };
    addMenuItem(vendor.id, item.categoryId, item);
    toast.success(`Added "${item.name}" to menu`);
    setShowAdd(false);
    setForm({ name: "", description: "", price: "10", categoryId: "", image: "" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      {/* Store switcher */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
          <Store className="ml-2 h-4 w-4 text-orange-600" />
          <select value={vendorId} onChange={(e) => setVendorId(e.target.value)} className="bg-transparent py-1.5 pr-4 text-sm font-semibold outline-none">
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-1 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === t ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${vendor.isOpen ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
            <span className={`h-2 w-2 rounded-full ${vendor.isOpen ? "bg-emerald-500" : "bg-zinc-400"}`} />
            {vendor.isOpen ? "Open" : "Closed"}
          </span>
          <button onClick={() => { updateVendor({ ...vendor, isOpen: !vendor.isOpen }); toast.success(vendor.isOpen ? "Store is now closed" : "Store is now open"); }} className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700">
            Toggle status
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Live orders" value={String(liveOrders.length)} accent="bg-orange-100 text-orange-600" />
        <StatCard icon={Banknote} label="Today's revenue" value={`$${todayRevenue.toFixed(2)}`} accent="bg-emerald-100 text-emerald-600" />
        <StatCard icon={TrendingUp} label="Avg order value" value={`$${avgOrder.toFixed(2)}`} accent="bg-blue-100 text-blue-600" />
        <StatCard icon={ChefHat} label="Menu items" value={String(vendor.categories.reduce((s, c) => s + c.items.length, 0))} accent="bg-amber-100 text-amber-600" />
      </div>

      {/* ORDERS TAB */}
      {tab === "Orders" && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900"><LayoutDashboard className="h-5 w-5 text-orange-600" /> Live order queue</h2>
          {liveOrders.length === 0 ? (
            <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <Utensils className="mb-2 h-8 w-8 text-zinc-300" />
              <p className="font-semibold text-zinc-700">No live orders</p>
              <p className="text-sm text-zinc-500">New orders will appear here instantly.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {liveOrders.map((o) => {
                const actions = ACTION_BY_STAGE[o.status] ?? [];
                return (
                  <motion.div key={o.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 p-4">
                      <div>
                        <div className="font-bold text-zinc-900">{o.id}</div>
                        <div className="text-xs text-zinc-500">{o.customerName} • {o.customerAddress}</div>
                      </div>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{o.status.replace(/_/g, " ")}</span>
                    </div>
                    <div className="space-y-2 p-4">
                      {o.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-zinc-700">{it.qty} × {it.name} {it.options && <span className="text-zinc-400">({it.options})</span>}</span>
                          <span className="font-semibold">${(it.qty * it.price).toFixed(2)}</span>
                        </div>
                      ))}
                      {o.note && <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700">Note: {o.note}</div>}
                      <div className="flex justify-between border-t border-zinc-100 pt-2 text-sm font-bold">
                        <span>{o.payment === "CASH" ? "Cash on delivery" : o.payment === "MOBILE" ? "Mobile pay" : "Card"}</span>
                        <span>${o.total.toFixed(2)}</span>
                      </div>
                    </div>
                    {actions.length > 0 && (
                      <div className="flex gap-2 border-t border-zinc-100 p-3">
                        {actions.map((a) => (
                          <button key={a.label} onClick={() => { /* advance from dashboard */ }} className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition active:scale-95 ${a.cls}`}>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MENU TAB */}
      {tab === "Menu" && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900"><MenuIcon className="h-5 w-5 text-orange-600" /> Menu manager</h2>
            <button onClick={() => setShowAdd((v) => !v)} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-orange-700 active:scale-95">
              <Plus className="h-4 w-4" /> Add item
            </button>
            <div className="flex gap-2">
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-orange-400" />
              <button onClick={() => { if (newCat.trim()) { addCategory(vendor.id, newCat.trim()); setNewCat(""); toast.success("Category added"); } }} className="rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white">Add</button>
            </div>
          </div>

          {vendor.categories.map((cat) => (
            <div key={cat.id} className="mt-5">
              <h3 className="flex items-center gap-2 font-bold text-zinc-800"><Store className="h-4 w-4 text-orange-500" /> {cat.name} <span className="text-xs font-normal text-zinc-400">({cat.items.length})</span></h3>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => (
                  <div key={item.id} className="group flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
                    <img src={item.image} alt={item.name} className={`h-16 w-16 rounded-xl object-cover ${!item.available ? "opacity-40" : ""}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`truncate font-semibold text-zinc-900 ${!item.available ? "line-through" : ""}`}>{item.name}</span>
                        <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="line-clamp-1 text-xs text-zinc-500">{item.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleItemAvailability(vendor.id, item.id)}
                          className={`rounded-full px-3 py-1 text-[11px] font-bold transition ${item.available ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}
                        >
                          {item.available ? "In stock" : "Sold out"}
                        </button>
                        <button onClick={() => deleteMenuItem(vendor.id, item.id)} className="ml-auto grid h-6 w-6 place-items-center rounded-full text-zinc-400 hover:bg-rose-50 hover:text-rose-500">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {cat.items.length === 0 && <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400">No items yet</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {tab === "Analytics" && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900"><TrendingUp className="h-5 w-5 text-orange-600" /> Performance</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold text-zinc-700">Orders by status</h4>
              {(["DELIVERED", "OUT_FOR_DELIVERY", "PREPARING", "PENDING", "REJECTED"] as const).map((s) => {
                const count = vendorOrders.filter((o) => o.status === s).length;
                const pct = vendorOrders.length ? (count / vendorOrders.length) * 100 : 0;
                return (
                  <div key={s} className="mt-3">
                    <div className="flex justify-between text-xs font-medium text-zinc-500">
                      <span>{s.replace(/_/g, " ")}</span><span>{count}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                      <motion.div className="h-full bg-orange-500" animate={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold text-zinc-700">Top items</h4>
              {vendor.categories
                .flatMap((c) => c.items)
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="mt-3 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-9 w-9 rounded-lg object-cover" />
                    <span className="flex-1 text-sm text-zinc-700">{item.name}</span>
                    <span className="text-xs font-bold text-emerald-600">${item.price.toFixed(2)}</span>
                  </div>
                ))}
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-orange-600 to-amber-500 p-5 text-white shadow-sm">
              <Wallet className="h-6 w-6 text-white/80" />
              <div className="mt-3 text-3xl font-extrabold">${(todayRevenue * 0.88).toFixed(2)}</div>
              <div className="text-sm text-orange-100">Estimated payout (after 12% platform fee)</div>
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold"><Clock className="h-3 w-3" /> Payouts every Mon & Thu</div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {tab === "Profile" && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900"><Store className="h-5 w-5 text-orange-600" /> Store profile</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <img src={vendor.cover} alt={vendor.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-zinc-900">{vendor.name}</h3>
                <p className="text-sm text-zinc-500">{vendor.tagline}</p>
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              {[
                ["Email", vendor.email],
                ["Phone", vendor.phone],
                ["Address", vendor.address],
                ["Cuisine", vendor.cuisine],
                ["Delivery fee", `$${vendor.deliveryFee.toFixed(2)}`],
                ["Free delivery over", `$${vendor.freeDeliveryAbove.toFixed(0)}`],
                ["Status", vendor.status.replace(/_/g, " ")],
              ].map(([k, val]) => (
                <div key={k} className="flex justify-between border-b border-zinc-50 pb-2 text-sm">
                  <span className="text-zinc-500">{k}</span>
                  <span className="font-semibold text-zinc-800">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add item modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setShowAdd(false)}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900">Add menu item</h3>
              <button onClick={() => setShowAdd(false)} className="rounded-full bg-zinc-100 p-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name *" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400" />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price *" type="number" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400" />
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none" >
                  {vendor.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm outline-none focus:border-orange-400" />
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-2 text-xs text-zinc-500">
                <ImageIcon className="h-4 w-4 text-orange-500" /> Image optional - a default is used.
              </div>
              <button onClick={saveForm} className="w-full rounded-2xl bg-orange-600 py-3.5 font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 active:scale-[0.98]">
                Save item
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* Re-export Timer so it is not unused at module scope warnings */
export type { Timer as _TimerAlias };