import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Banknote, Check, CircleAlert, Clock, LayoutDashboard, ShieldCheck, Store, Users, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../context/StoreContext";
import type { Order } from "../types";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-violet-100 text-violet-700",
  OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

export function AdminDashboard() {
  const { vendors, orders, metrics, adjustVendorStatus } = useStore();
  const [tab, setTab] = useState<"overview" | "vendors" | "orders">("overview");
  const commission = metrics.commissionRate * metrics.gmv;
  const approvedCount = vendors.filter((v) => v.status === "APPROVED").length;
  const pendingVendors = vendors.filter((v) => v.status === "PENDING_REVIEW");

  const revenueByDay = useMemo(() => {
    return [18, 22, 19, 27, 31, 24, 29].map((v, i) => ({ label: ["M", "T", "W", "T", "F", "S", "S"][i], value: v }));
  }, []);

  const maxDay = Math.max(...revenueByDay.map((d) => d.value));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
          {(["overview", "vendors", "orders"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${tab === t ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <ShieldCheck className="h-4 w-4" /> All systems operational
        </div>
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Banknote, label: "Platform GMV", value: `$${metrics.gmv.toLocaleString()}`, accent: "bg-orange-100 text-orange-600" },
              { icon: Wallet, label: "Commission revenue", value: `$${commission.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, accent: "bg-emerald-100 text-emerald-600" },
              { icon: Store, label: "Active vendors", value: String(approvedCount), accent: "bg-blue-100 text-blue-600" },
              { icon: Users, label: "Total orders", value: metrics.totalOrders.toLocaleString(), accent: "bg-amber-100 text-amber-600" },
            ].map(({ icon: Icon, label, value, accent }) => (
              <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}><Icon className="h-5 w-5" /></div>
                <div className="mt-3 text-2xl font-extrabold text-zinc-900">{value}</div>
                <div className="text-xs font-medium text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-zinc-900">Weekly gross volume</h3>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><Clock className="h-3 w-3" /> this week</span>
              </div>
              <div className="mt-6 flex h-40 items-end gap-3">
                {revenueByDay.map((d) => (
                  <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.value / maxDay) * 100}%` }}
                      transition={{ type: "spring", damping: 22, stiffness: 140 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-amber-400"
                      style={{ minHeight: 8 }}
                    />
                    <span className="text-xs font-semibold text-zinc-400">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-zinc-900">Platform health</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Delivery fleet online", pct: 94 },
                  { label: "Vendor satisfaction", pct: 96 },
                  { label: "On-time deliveries", pct: 89 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-medium text-zinc-500"><span>{label}</span><span>{pct}%</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                      <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {pendingVendors.length > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-700">
                  <CircleAlert className="h-4 w-4" /> {pendingVendors.length} vendor{pendingVendors.length > 1 ? "s" : ""} await{pendingVendors.length > 1 ? "" : "s"} approval
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* VENDORS */}
      {tab === "vendors" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-zinc-900">Vendor management</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <img src={v.image} alt={v.name} className="h-28 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-zinc-900">{v.name}</h3>
                      <p className="text-xs text-zinc-500">{v.cuisine} • {v.reviewCount} reviews</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      v.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : v.status === "SUSPENDED" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
                    }`}>
                      {v.status === "APPROVED" && <BadgeCheck className="h-3 w-3" />}
                      {v.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {v.status !== "APPROVED" && (
                      <button onClick={() => adjustVendorStatus(v.id, "APPROVED")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-emerald-600 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95">
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                    )}
                    {v.status !== "PENDING_REVIEW" && (
                      <button onClick={() => adjustVendorStatus(v.id, "PENDING_REVIEW")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-amber-500 py-2 text-xs font-bold text-white transition hover:bg-amber-600 active:scale-95">
                        Review
                      </button>
                    )}
                    {v.status !== "SUSPENDED" && (
                      <button onClick={() => adjustVendorStatus(v.id, "SUSPENDED")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-rose-500 py-2 text-xs font-bold text-white transition hover:bg-rose-600 active:scale-95">
                        <X className="h-3.5 w-3.5" /> Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-zinc-900">System-wide orders</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 12).map((o) => (
                  <tr key={o.id} className="border-b border-zinc-50 hover:bg-zinc-50/60">
                    <td className="px-4 py-3 font-semibold text-zinc-900">{o.id}</td>
                    <td className="px-4 py-3 text-zinc-600">{o.vendorName}</td>
                    <td className="px-4 py-3 text-zinc-600">{o.customerName}</td>
                    <td className="px-4 py-3 font-bold text-zinc-900">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-zinc-500">{o.payment}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_COLOR[o.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* make unused imports graceful */
export type { Order as _OrderAlias };