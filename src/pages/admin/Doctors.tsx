import { useState } from "react";
import { Pencil, Plus, Search, Stethoscope, Trash2 } from "lucide-react";
import { clinics, providers as seed, rosterEntries } from "@/mocks/data";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import { useFilters } from "@/lib/useFilters";
import type { Provider } from "@/types";

const empty: Omit<Provider, "id"> = {
  clinicId: "c1",
  fullName: "",
  phoneNumber: "",
  isTelehealth: false,
  isActive: true,
  specialty: "General Practice",
};

export default function Doctors() {
  const [list, setList] = useState<Provider[]>(seed);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [q, setQ] = useState("");
  const { active, set, clear } = useFilters(["type", "status", "clinic", "duty"]);

  const open = creating || editing !== null;

  const onDutyIds = new Set(
    rosterEntries
      .filter((r) => new Date(r.endsAt) > new Date())
      .map((r) => r.providerId),
  );

  const filtered = list.filter((d) => {
    if (q && !d.fullName.toLowerCase().includes(q.toLowerCase())) return false;
    if (active.type === "telehealth" && !d.isTelehealth) return false;
    if (active.type === "clinic" && d.isTelehealth) return false;
    if (active.status === "active" && !d.isActive) return false;
    if (active.status === "inactive" && d.isActive) return false;
    if (active.clinic !== "all" && d.clinicId !== active.clinic) return false;
    if (active.duty === "on" && !onDutyIds.has(d.id)) return false;
    if (active.duty === "off" && onDutyIds.has(d.id)) return false;
    return true;
  });

  const filterGroups = [
    {
      key: "type",
      label: "Type",
      options: [
        { value: "all", label: "All types" },
        { value: "clinic", label: "Clinic doctor" },
        { value: "telehealth", label: "Telehealth" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "clinic",
      label: "Clinic",
      options: [
        { value: "all", label: "All clinics" },
        ...clinics.map((c) => ({ value: c.id, label: c.name })),
      ],
    },
    {
      key: "duty",
      label: "Roster",
      options: [
        { value: "all", label: "Any" },
        { value: "on", label: "On upcoming roster" },
        { value: "off", label: "Not rostered" },
      ],
    },
  ];

  function resetAll() {
    clear();
    setQ("");
  }

  function save() {
    if (!form.fullName.trim()) return;
    const clinicId = form.isTelehealth ? null : form.clinicId;
    if (editing) {
      setList((p) =>
        p.map((d) => (d.id === editing.id ? { ...d, ...form, clinicId } : d)),
      );
    } else {
      setList((p) => [...p, { ...form, clinicId, id: `p${Date.now()}` }]);
    }
    setEditing(null);
    setCreating(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Doctors</h1>
          <p className="mt-1 text-sm text-slate-500">
            Clinic doctors belong to one practice. Telehealth doctors are a
            shared pool across all clinics.
          </p>
        </div>
        <button
          onClick={() => {
            setForm(empty);
            setCreating(true);
            setEditing(null);
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" />
          Add doctor
        </button>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search doctors"
            className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-accent-orange"
          />
        </div>
        <FilterBar
          groups={filterGroups}
          active={active}
          onChange={set}
          onClear={resetAll}
          shown={filtered.length}
          total={list.length}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Doctor</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Clinic</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
                      {d.fullName
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{d.fullName}</p>
                      <p className="text-xs text-slate-400">{d.specialty}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{d.phoneNumber}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      d.isTelehealth
                        ? "bg-accent-orange-soft text-accent-orange"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {d.isTelehealth ? "TELEHEALTH" : "CLINIC"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {clinics.find((c) => c.id === d.clinicId)?.name ?? "Shared pool"}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() =>
                      setList((p) =>
                        p.map((x) =>
                          x.id === d.id ? { ...x, isActive: !x.isActive } : x,
                        ),
                      )
                    }
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      d.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {d.isActive ? "ACTIVE" : "INACTIVE"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setForm({ ...d });
                        setEditing(d);
                        setCreating(false);
                      }}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setList((p) => p.filter((x) => x.id !== d.id))
                      }
                      className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <EmptyState
            icon={Stethoscope}
            title="No doctors match these filters"
            detail="Try widening the type, status or clinic filter."
            actionLabel="Clear filters"
            onAction={resetAll}
          />
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                <Stethoscope className="h-4 w-4 text-accent-orange" />
                {editing ? "Edit doctor" : "Add doctor"}
              </h2>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  value={form.fullName}
                  placeholder="Dr. Jane Smith"
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Phone number
                </label>
                <input
                  value={form.phoneNumber}
                  placeholder="+61 400 000 000"
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Specialty
                </label>
                <input
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                />
              </div>

              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isTelehealth}
                  onChange={(e) =>
                    setForm({ ...form, isTelehealth: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#ff6a13]"
                />
                Independent telehealth doctor (works across all clinics)
              </label>

              {!form.isTelehealth && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Clinic
                  </label>
                  <select
                    value={form.clinicId ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, clinicId: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-accent-orange"
                  >
                    {clinics.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#ff6a13]"
                />
                Active — eligible to be dialled
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => {
                  setEditing(null);
                  setCreating(false);
                }}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                {editing ? "Save changes" : "Add doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}