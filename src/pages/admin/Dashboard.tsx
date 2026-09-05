import {
  AlertTriangle,
  ArrowUpRight,
  CircleDollarSign,
  PhoneCall,
  Siren,
  Stethoscope,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  bookings,
  calls,
  clinics,
  patients,
  payments,
  providers,
} from "@/mocks/data";
import type { BookingStatus, CallOutcome } from "@/types";

const outcomeStyles: Record<CallOutcome, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  redirected_to_000: "bg-red-50 text-red-700",
  abandoned: "bg-amber-50 text-amber-700",
  failed: "bg-slate-100 text-slate-600",
};

const outcomeLabels: Record<CallOutcome, string> = {
  completed: "Completed",
  redirected_to_000: "Sent to 000",
  abandoned: "Abandoned",
  failed: "Failed",
};

const statusStyles: Partial<Record<BookingStatus, string>> = {
  ESCALATED: "bg-red-50 text-red-700",
  AWAITING_PAYMENT: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-600",
};

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function AdminDashboard() {
  const { user } = useAuth();

  const activeClinics = clinics.filter((c) => c.isActive).length;
  const emergencies = calls.filter(
    (c) => c.outcome === "redirected_to_000",
  ).length;
  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const escalated = bookings.filter((b) => b.status === "ESCALATED");
  const unpaid = bookings.filter((b) => b.status === "AWAITING_PAYMENT");
  const activeDoctors = providers.filter((p) => p.isActive).length;

  const kpis = [
    {
      label: "Calls handled",
      value: calls.length,
      sub: `${activeClinics} clinics live`,
      icon: PhoneCall,
      accent: "border-t-brand",
    },
    {
      label: "Revenue collected",
      value: `$${revenue.toFixed(2)}`,
      sub: `${payments.filter((p) => p.status === "paid").length} payments cleared`,
      icon: CircleDollarSign,
      accent: "border-t-emerald-500",
    },
    {
      label: "Emergency redirects",
      value: emergencies,
      sub: "No payment taken",
      icon: Siren,
      accent: "border-t-red-500",
    },
    {
      label: "Doctors on platform",
      value: activeDoctors,
      sub: `${providers.filter((p) => p.isTelehealth).length} telehealth pool`,
      icon: Stethoscope,
      accent: "border-t-accent-orange",
    },
  ];

  const attention = [
    ...escalated.map((b) => ({
      id: b.id,
      title: "No doctor reachable",
      detail: `${patients.find((p) => p.id === b.patientId)?.fullName ?? "Unknown"} — paid $${b.feeAmount.toFixed(2)}, escalated to practice manager`,
      tag: "ESCALATED",
      tone: "border-l-red-500",
    })),
    ...unpaid.map((b) => ({
      id: b.id,
      title: "Payment link expired",
      detail: `${patients.find((p) => p.id === b.patientId)?.fullName ?? "Unknown"} — $${b.feeAmount.toFixed(2)} never cleared`,
      tag: "AWAITING PAYMENT",
      tone: "border-l-amber-500",
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-brand p-7 text-white">
        <h1 className="text-2xl font-semibold">
          {timeOfDay()}, {user?.name.split(" ")[0]}!
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>
            <strong>{activeClinics}</strong> Clinics live •{" "}
            <strong>{escalated.length}</strong> Escalations •{" "}
            <strong>{unpaid.length}</strong> Unpaid bookings
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-lg border border-slate-200 border-t-2 bg-white p-5 ${kpi.accent}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </p>
                <div className="rounded-md bg-slate-50 p-1.5">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
              <PhoneCall className="h-4 w-4 text-accent-orange" />
              Recent calls
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Every call is logged, including those that never became a booking.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {calls.map((call) => {
              const patient = patients.find((p) => p.id === call.patientId);
              return (
                <div
                  key={call.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {patient?.fullName ?? "Details not collected"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {call.fromNumber} • {formatTime(call.startedAt)} •{" "}
                      {formatDuration(call.durationSeconds)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${outcomeStyles[call.outcome]}`}
                  >
                    {outcomeLabels[call.outcome]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <AlertTriangle className="h-4 w-4 text-accent-orange" />
                Needs attention
              </h2>
            </div>
            <div className="space-y-3 p-4">
              {attention.length === 0 && (
                <p className="text-sm text-slate-400">Nothing outstanding.</p>
              )}
              {attention.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-md border-l-2 bg-slate-50 p-3 ${item.tone}`}
                >
                  <p className="text-sm font-medium text-slate-900">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Clinics</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {clinic.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      ${clinic.clinicDoctorFee} / ${clinic.telehealthFee}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${
                      clinic.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {clinic.isActive ? "LIVE" : "PAUSED"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Booking pipeline</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Status is stored in the database, not in the AI's memory — which is
            why a dropped call can resume.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-2.5 font-medium">Patient</th>
              <th className="px-5 py-2.5 font-medium">Service</th>
              <th className="px-5 py-2.5 font-medium">Fee</th>
              <th className="px-5 py-2.5 font-medium">Doctor</th>
              <th className="px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-5 py-3 font-medium text-slate-900">
                  {patients.find((p) => p.id === booking.patientId)?.fullName}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {booking.serviceType === "clinic_doctor"
                    ? "Clinic doctor"
                    : "Telehealth"}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  ${booking.feeAmount.toFixed(2)}
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {providers.find((p) => p.id === booking.providerId)
                    ?.fullName ?? "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      statusStyles[booking.status] ??
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {booking.status.replace(/_/g, " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-100 px-5 py-3">
          <button className="inline-flex items-center gap-1 text-xs font-medium text-accent-orange hover:underline">
            View all bookings <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}