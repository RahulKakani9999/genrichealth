import { useState } from "react";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { clinics as seedClinics } from "@/mocks/data";
import type { Clinic } from "@/types";

const emptyClinic: Omit<Clinic, "id" | "createdAt"> = {
  name: "",
  afterHoursNumber: "",
  clinicDoctorFee: 0,
  telehealthFee: 0,
  greetingScript: "",
  practiceManagerPhone: "",
  timezone: "Australia/Sydney",
  isActive: true,
};

export default function Clinics() {
  const [clinics, setClinics] = useState<Clinic[]>(seedClinics);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyClinic);

  function openCreate() {
    setForm(emptyClinic);
    setCreating(true);
    setEditing(null);
  }

  function openEdit(clinic: Clinic) {
    setForm({ ...clinic });
    setEditing(clinic);
    setCreating(false);
  }

  function close() {
    setEditing(null);
    setCreating(false);
  }

  function save() {
    if (!form.name.trim()) return;
    if (editing) {
      setClinics((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...form } : c)),
      );
    } else {
      setClinics((prev) => [
        ...prev,
        {
          ...form,
          id: `c${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
    close();
  }

  function remove(id: string) {
    setClinics((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleActive(id: string) {
    setClinics((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
    );
  }

  const open = creating || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clinics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Each clinic sets its own fees, greeting and escalation contact. The
            AI reads these at call time — nothing is hard-coded.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add clinic
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Clinic</th>
              <th className="px-5 py-3 font-medium">After-hours number</th>
              <th className="px-5 py-3 font-medium">Clinic fee</th>
              <th className="px-5 py-3 font-medium">Telehealth fee</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clinics.map((clinic) => (
              <tr key={clinic.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-orange-soft">
                      <Building2 className="h-4 w-4 text-accent-orange" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {clinic.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {clinic.timezone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {clinic.afterHoursNumber}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  ${clinic.clinicDoctorFee.toFixed(2)}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-900">
                  ${clinic.telehealthFee.toFixed(2)}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleActive(clinic.id)}
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      clinic.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {clinic.isActive ? "LIVE" : "PAUSED"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(clinic)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => remove(clinic.id)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                {editing ? "Edit clinic" : "Add clinic"}
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Changes take effect on the next incoming call.
              </p>
            </div>

            <div className="space-y-4 px-6 py-5">
              <Field
                label="Clinic name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                label="After-hours number"
                value={form.afterHoursNumber}
                placeholder="+61 2 8000 0000"
                onChange={(v) => setForm({ ...form, afterHoursNumber: v })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Clinic doctor fee (AUD)"
                  type="number"
                  value={String(form.clinicDoctorFee)}
                  onChange={(v) =>
                    setForm({ ...form, clinicDoctorFee: Number(v) || 0 })
                  }
                />
                <Field
                  label="Telehealth fee (AUD)"
                  type="number"
                  value={String(form.telehealthFee)}
                  onChange={(v) =>
                    setForm({ ...form, telehealthFee: Number(v) || 0 })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Greeting script
                </label>
                <textarea
                  rows={3}
                  value={form.greetingScript}
                  onChange={(e) =>
                    setForm({ ...form, greetingScript: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                />
                <p className="text-xs text-slate-400">
                  The exact words the AI speaks when it answers.
                </p>
              </div>

              <Field
                label="Practice manager phone"
                value={form.practiceManagerPhone}
                placeholder="+61 400 000 000"
                onChange={(v) =>
                  setForm({ ...form, practiceManagerPhone: v })
                }
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Timezone
                </label>
                <select
                  value={form.timezone}
                  onChange={(e) =>
                    setForm({ ...form, timezone: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                >
                  <option>Australia/Sydney</option>
                  <option>Australia/Melbourne</option>
                  <option>Australia/Brisbane</option>
                  <option>Australia/Perth</option>
                  <option>Australia/Adelaide</option>
                </select>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#ff6a13]"
                />
                Clinic is live and accepting after-hours calls
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                onClick={close}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                {editing ? "Save changes" : "Create clinic"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
      />
    </div>
  );
}