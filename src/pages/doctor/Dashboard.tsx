import { Clock, DollarSign, FileText, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { bookings, consultationNotes, patients } from "@/mocks/data";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const mine = bookings.filter((b) => b.providerId === user?.providerId);
  const upcoming = mine.filter((b) => b.status === "PAID");
  const completed = mine.filter((b) => b.status === "COMPLETED");
  const earned = completed.reduce((s, b) => s + b.feeAmount, 0);
  const followUps = consultationNotes.filter(
    (n) => n.providerId === user?.providerId && n.followUpRequired,
  );

  const kpis = [
    { label: "Upcoming", value: upcoming.length, icon: Clock, accent: "border-t-accent-orange" },
    { label: "Completed", value: completed.length, icon: Users, accent: "border-t-emerald-500" },
    { label: "Fees generated", value: `$${earned.toFixed(2)}`, icon: DollarSign, accent: "border-t-brand" },
    { label: "Follow-ups due", value: followUps.length, icon: FileText, accent: "border-t-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-brand p-7 text-white">
        <h1 className="text-2xl font-semibold">
          {greeting()}, {user?.name.replace("Dr. ", "").split(" ")[0]}!
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>
            <strong>{upcoming.length}</strong> consults waiting •{" "}
            <strong>{followUps.length}</strong> follow-ups due
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              className={`rounded-lg border border-slate-200 border-t-2 bg-white p-5 ${k.accent}`}
            >
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  {k.label}
                </p>
                <div className="rounded-md bg-slate-50 p-1.5">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{k.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Follow-ups outstanding</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Patients you flagged for review after their consultation.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {followUps.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              Nothing outstanding.
            </p>
          )}
          {followUps.map((n) => (
            <div key={n.id} className="px-5 py-4">
              <p className="font-medium text-slate-900">
                {patients.find((p) => p.id === n.patientId)?.fullName}
              </p>
              <p className="mt-1 text-sm text-slate-500">{n.followUpNotes}</p>
              <p className="mt-1 text-xs text-slate-400">{n.chiefComplaint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}