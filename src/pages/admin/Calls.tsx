import { useState } from "react";
import { FileText, PhoneCall, PlayCircle } from "lucide-react";
import { bookings, calls, clinics, patients } from "@/mocks/data";
import type { Call, CallOutcome } from "@/types";

const styles: Record<CallOutcome, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  redirected_to_000: "bg-red-50 text-red-700",
  abandoned: "bg-amber-50 text-amber-700",
  failed: "bg-slate-100 text-slate-600",
};

const labels: Record<CallOutcome, string> = {
  completed: "Completed",
  redirected_to_000: "Sent to 000",
  abandoned: "Abandoned",
  failed: "Failed",
};

export default function Calls() {
  const [filter, setFilter] = useState<CallOutcome | "all">("all");
  const [selected, setSelected] = useState<Call | null>(null);

  const shown = filter === "all" ? calls : calls.filter((c) => c.outcome === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Call log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every inbound call is recorded, including those that never became a
          booking.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "completed", "redirected_to_000", "abandoned", "failed"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                filter === f
                  ? "border-accent-orange bg-accent-orange-soft text-brand"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {f === "all" ? "All calls" : labels[f]}
            </button>
          ),
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Caller</th>
              <th className="px-5 py-3 font-medium">Clinic</th>
              <th className="px-5 py-3 font-medium">Started</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Outcome</th>
              <th className="px-5 py-3 text-right font-medium">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((call) => (
              <tr key={call.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-900">
                    {patients.find((p) => p.id === call.patientId)?.fullName ??
                      "Details not collected"}
                  </p>
                  <p className="text-xs text-slate-400">{call.fromNumber}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {clinics.find((c) => c.id === call.clinicId)?.name}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {new Date(call.startedAt).toLocaleString("en-AU", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {Math.floor(call.durationSeconds / 60)}m{" "}
                  {call.durationSeconds % 60}s
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${styles[call.outcome]}`}
                  >
                    {labels[call.outcome]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => setSelected(call)}
                    className="text-xs font-medium text-accent-orange hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <PhoneCall className="h-4 w-4 text-accent-orange" />
                Call detail
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Twilio SID {selected.twilioCallSid}
              </p>
            </div>

            <div className="space-y-4 px-6 py-5 text-sm">
              <Row
                label="Caller"
                value={
                  patients.find((p) => p.id === selected.patientId)?.fullName ??
                  "Details not collected"
                }
              />
              <Row label="From" value={selected.fromNumber} />
              <Row
                label="Clinic"
                value={clinics.find((c) => c.id === selected.clinicId)?.name ?? "—"}
              />
              <Row
                label="Outcome"
                value={labels[selected.outcome]}
              />
              <Row
                label="Linked booking"
                value={
                  bookings.find((b) => b.callId === selected.id)?.status.replace(/_/g, " ") ??
                  "No booking created"
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  disabled={!selected.recordingUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
                >
                  <PlayCircle className="h-3.5 w-3.5" />
                  Play recording
                </button>
                <button
                  disabled={!selected.transcriptUrl}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 disabled:opacity-40"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View transcript
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Audio and transcripts are stored in S3 — the database holds only
                the links.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setSelected(null)}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-50 pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}