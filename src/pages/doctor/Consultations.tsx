import { useState } from "react";
import { Clock, FileText, Phone, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  bookings,
  consultationNotes as seedNotes,
  patients,
} from "@/mocks/data";
import type { ConsultationNote } from "@/types";

export default function Consultations() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ConsultationNote[]>(seedNotes);
  const [writing, setWriting] = useState<string | null>(null);
  const [form, setForm] = useState({
    chiefComplaint: "",
    assessment: "",
    prescription: "",
    followUpRequired: false,
    followUpNotes: "",
  });

  const mine = bookings.filter((b) => b.providerId === user?.providerId);
  const upcoming = mine.filter((b) => b.status === "PAID");
  const past = mine.filter((b) => b.status === "COMPLETED");

  function saveNote(bookingId: string) {
    const booking = mine.find((b) => b.id === bookingId)!;
    setNotes((p) => [
      ...p,
      {
        id: `n${Date.now()}`,
        bookingId,
        providerId: user!.providerId!,
        patientId: booking.patientId,
        ...form,
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({
      chiefComplaint: "",
      assessment: "",
      prescription: "",
      followUpRequired: false,
      followUpNotes: "",
    });
    setWriting(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Consultations</h1>
        <p className="mt-1 text-sm text-slate-500">
          Patients are only routed to you once payment has cleared.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <Clock className="h-4 w-4 text-accent-orange" />
            Upcoming
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {upcoming.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              No upcoming consultations.
            </p>
          )}
          {upcoming.map((b) => {
            const patient = patients.find((p) => p.id === b.patientId)!;
            return (
              <div key={b.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="font-medium text-slate-900">
                        {patient.fullName}
                      </p>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        PAID ${b.feeAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-500">
                      <p>
                        DOB {new Date(patient.dateOfBirth).toLocaleDateString("en-AU")}
                        {" • "}
                        {patient.phoneNumber}
                      </p>
                      <p>{patient.address}</p>
                      <p className="text-xs">
                        {b.serviceType === "clinic_doctor"
                          ? "Clinic doctor consult"
                          : "Telehealth consult"}
                        {b.scheduledFor &&
                          ` • booked ${new Date(b.scheduledFor).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}`}
                      </p>
                    </div>
                  </div>
                  <button className="inline-flex shrink-0 items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <Phone className="h-4 w-4" />
                    Accept call
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-accent-orange" />
            Consultation history
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Notes and prescriptions from calls you have taken.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {past.map((b) => {
            const patient = patients.find((p) => p.id === b.patientId)!;
            const note = notes.find((n) => n.bookingId === b.id);
            return (
              <div key={b.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {patient.fullName}
                      </p>
                      {note?.followUpRequired && (
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          FOLLOW-UP
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(b.updatedAt).toLocaleString("en-AU", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {note ? (
                      <div className="mt-3 space-y-2 rounded-md bg-slate-50 p-3 text-sm">
                        <NoteRow label="Complaint" value={note.chiefComplaint} />
                        <NoteRow label="Assessment" value={note.assessment} />
                        <NoteRow label="Prescription" value={note.prescription} />
                        {note.followUpRequired && (
                          <NoteRow label="Follow-up" value={note.followUpNotes} />
                        )}
                      </div>
                    ) : writing === b.id ? (
                      <div className="mt-3 space-y-3 rounded-md border border-slate-200 p-4">
                        <Textarea
                          label="Chief complaint"
                          value={form.chiefComplaint}
                          onChange={(v) => setForm({ ...form, chiefComplaint: v })}
                        />
                        <Textarea
                          label="Assessment"
                          value={form.assessment}
                          onChange={(v) => setForm({ ...form, assessment: v })}
                        />
                        <Textarea
                          label="Prescription"
                          value={form.prescription}
                          onChange={(v) => setForm({ ...form, prescription: v })}
                        />
                        <label className="flex items-center gap-2.5 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={form.followUpRequired}
                            onChange={(e) =>
                              setForm({ ...form, followUpRequired: e.target.checked })
                            }
                            className="h-4 w-4 accent-[#ff6a13]"
                          />
                          Follow-up required
                        </label>
                        {form.followUpRequired && (
                          <Textarea
                            label="Follow-up notes"
                            value={form.followUpNotes}
                            onChange={(v) => setForm({ ...form, followUpNotes: v })}
                          />
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveNote(b.id)}
                            className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white"
                          >
                            Save notes
                          </button>
                          <button
                            onClick={() => setWriting(null)}
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setWriting(b.id)}
                        className="mt-3 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-accent-orange hover:text-accent-orange"
                      >
                        Write consultation notes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NoteRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-slate-700">{value}</p>
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
      />
    </div>
  );
}