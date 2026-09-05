import { RefreshCw, Send } from "lucide-react";
import { bookings, patients, payments } from "@/mocks/data";
import type { Payment } from "@/types";

const styles: Record<Payment["status"], string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  expired: "bg-amber-50 text-amber-700",
  failed: "bg-red-50 text-red-700",
  refunded: "bg-slate-100 text-slate-600",
};

export default function Payments() {
  const collected = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const outstanding = payments
    .filter((p) => p.status !== "paid" && p.status !== "refunded")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Payments</h1>
        <p className="mt-1 text-sm text-slate-500">
          Stripe session IDs are unique in the database, so the same payment can
          never be recorded twice.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Collected" value={`$${collected.toFixed(2)}`} accent="border-t-emerald-500" />
        <Kpi label="Outstanding" value={`$${outstanding.toFixed(2)}`} accent="border-t-amber-500" />
        <Kpi label="Transactions" value={String(payments.length)} accent="border-t-brand" />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Stripe session</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Link sent</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => {
              const booking = bookings.find((b) => b.id === p.bookingId);
              const patient = patients.find((x) => x.id === booking?.patientId);
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {patient?.fullName ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                    {p.stripeSessionId}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    ${p.amount.toFixed(2)} {p.currency}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {new Date(p.linkSentAt).toLocaleString("en-AU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${styles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      {p.status !== "paid" && (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-accent-orange hover:text-accent-orange"
                          title="Resend payment link"
                        >
                          <Send className="h-3 w-3" />
                          Resend
                        </button>
                      )}
                      {p.status === "paid" && (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
                          title="Refund"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-lg border border-slate-200 border-t-2 bg-white p-5 ${accent}`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}