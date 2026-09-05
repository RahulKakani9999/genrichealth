import { useState } from "react";
import { CalendarOff, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { availability as seed, rosterEntries } from "@/mocks/data";
import type { Availability } from "@/types";

export default function DoctorAvailability() {
  const { user } = useAuth();
  const [onDuty, setOnDuty] = useState(true);
  const [blocks, setBlocks] = useState<Availability[]>(
    seed.filter((a) => a.providerId === user?.providerId),
  );
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: "", reason: "" });

  const myShifts = rosterEntries.filter((r) => r.providerId === user?.providerId);

  function addBlock() {
    if (!form.date) return;
    setBlocks((p) => [
      ...p,
      {
        id: `av${Date.now()}`,
        providerId: user!.providerId!,
        startsAt: `${form.date}T18:00:00Z`,
        endsAt: `${form.date}T08:00:00Z`,
        isAvailable: false,
        reason: form.reason || "Unavailable",
      },
    ]);
    setForm({ date: "", reason: "" });
    setAdding(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Availability</h1>
        <p className="mt-1 text-sm text-slate-500">
          The routing engine checks this before dialling. If you're off duty,
          calls skip straight to the next doctor.
        </p>
      </div>

      <div
        className={`rounded-xl border-2 p-6 transition ${
          onDuty
            ? "border-emerald-200 bg-emerald-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                onDuty ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              {onDuty ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : (
                <CalendarOff className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {onDuty ? "Available for calls" : "Off duty"}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {onDuty
                  ? "You are in tonight's dial list and may receive after-hours calls."
                  : "You have been removed from the dial list. No calls will reach you."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOnDuty(!onDuty)}
            className={`relative h-7 w-13 shrink-0 rounded-full transition ${
              onDuty ? "bg-emerald-500" : "bg-slate-300"
            }`}
            style={{ width: 52 }}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                onDuty ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Unavailable dates</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Leave, conferences, anything that takes you off the roster.
              </p>
            </div>
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          {adding && (
            <div className="space-y-3 border-b border-slate-100 bg-slate-50 p-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
              />
              <input
                placeholder="Reason (e.g. annual leave)"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
              />
              <div className="flex gap-2">
                <button
                  onClick={addBlock}
                  className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            {blocks.filter((b) => !b.isAvailable).length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-slate-400">
                No blocked dates.
              </p>
            )}
            {blocks
              .filter((b) => !b.isAvailable)
              .map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(b.startsAt).toLocaleDateString("en-AU", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-slate-400">{b.reason}</p>
                  </div>
                  <button
                    onClick={() =>
                      setBlocks((p) => p.filter((x) => x.id !== b.id))
                    }
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">My roster</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Shifts assigned by the practice manager. Read-only.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {myShifts.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(s.startsAt).toLocaleDateString("en-AU", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(s.startsAt).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    –{" "}
                    {new Date(s.endsAt).toLocaleTimeString("en-AU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                    s.isBackup
                      ? "bg-slate-100 text-slate-600"
                      : "bg-accent-orange-soft text-accent-orange"
                  }`}
                >
                  {s.isBackup ? "BACKUP" : "PRIMARY"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}