import { useState } from "react";
import { AlertTriangle, CalendarClock, Plus, Trash2 } from "lucide-react";
import { clinics, providers, rosterEntries as seed } from "@/mocks/data";
import type { RosterEntry } from "@/types";

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(18, 0, 0, 0);
    return d;
  });
}

export default function Roster() {
  const [entries, setEntries] = useState<RosterEntry[]>(seed);
  const [clinicId, setClinicId] = useState("c1");
  const [adding, setAdding] = useState<string | null>(null);
  const [form, setForm] = useState({ providerId: "p1", isBackup: false });

  const days = nextDays(7);
  const eligible = providers.filter(
    (p) => p.isActive && (p.clinicId === clinicId || p.isTelehealth),
  );

  function entriesFor(day: Date) {
    return entries.filter((e) => {
      const s = new Date(e.startsAt);
      return (
        e.clinicId === clinicId &&
        s.getDate() === day.getDate() &&
        s.getMonth() === day.getMonth()
      );
    });
  }

  function add(day: Date) {
    const end = new Date(day);
    end.setDate(end.getDate() + 1);
    end.setHours(8, 0, 0, 0);
    setEntries((p) => [
      ...p,
      {
        id: `r${Date.now()}`,
        clinicId,
        providerId: form.providerId,
        startsAt: day.toISOString(),
        endsAt: end.toISOString(),
        isBackup: form.isBackup,
      },
    ]);
    setAdding(null);
  }

  const uncovered = days.filter(
    (d) => !entriesFor(d).some((e) => !e.isBackup),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">On-call roster</h1>
          <p className="mt-1 text-sm text-slate-500">
            Who the system dials at 2am. Primary is tried first, then backup,
            then the practice manager.
          </p>
        </div>
        <select
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
          className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent-orange"
        >
          {clinics.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {uncovered > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              {uncovered} night{uncovered > 1 ? "s" : ""} without a primary doctor
            </p>
            <p className="mt-0.5 text-sm text-amber-700">
              Calls on these nights escalate straight to the practice manager.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {days.map((day) => {
          const list = entriesFor(day);
          const hasPrimary = list.some((e) => !e.isBackup);
          const key = day.toISOString();
          return (
            <div
              key={key}
              className={`rounded-lg border bg-white p-4 ${
                hasPrimary ? "border-slate-200" : "border-amber-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-32 shrink-0">
                  <p className="font-medium text-slate-900">
                    {day.toLocaleDateString("en-AU", { weekday: "long" })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {day.toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    • 18:00–08:00
                  </p>
                </div>

                <div className="flex flex-1 flex-wrap gap-2">
                  {list.length === 0 && (
                    <span className="text-sm text-slate-400">
                      Nobody rostered
                    </span>
                  )}
                  {list.map((e) => (
                    <span
                      key={e.id}
                      className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${
                        e.isBackup
                          ? "bg-slate-100 text-slate-600"
                          : "bg-accent-orange-soft text-accent-orange"
                      }`}
                    >
                      {providers.find((p) => p.id === e.providerId)?.fullName}
                      <span className="text-[10px] opacity-60">
                        {e.isBackup ? "BACKUP" : "PRIMARY"}
                      </span>
                      <button
                        onClick={() =>
                          setEntries((p) => p.filter((x) => x.id !== e.id))
                        }
                        className="hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setAdding(adding === key ? null : key)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-accent-orange hover:text-accent-orange"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Assign
                </button>
              </div>

              {adding === key && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md bg-slate-50 p-3">
                  <select
                    value={form.providerId}
                    onChange={(e) =>
                      setForm({ ...form, providerId: e.target.value })
                    }
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none"
                  >
                    {eligible.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName}
                        {p.isTelehealth ? " (telehealth)" : ""}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isBackup}
                      onChange={(e) =>
                        setForm({ ...form, isBackup: e.target.checked })
                      }
                      className="h-4 w-4 accent-[#ff6a13]"
                    />
                    Backup contact
                  </label>
                  <button
                    onClick={() => add(day)}
                    className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Add to roster
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <p className="text-sm text-slate-500">
          The roster is set by the practice. Doctors separately mark themselves
          unavailable in their own portal — the routing engine checks both before
          dialling.
        </p>
      </div>
    </div>
  );
}