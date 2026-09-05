import { useState } from "react";
import { Search } from "lucide-react";
import { bookings, calls, patients } from "@/mocks/data";

export default function Patients() {
  const [q, setQ] = useState("");

  const shown = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(q.toLowerCase()) ||
      p.phoneNumber.includes(q),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Patients</h1>
        <p className="mt-1 text-sm text-slate-500">
          Returning callers are matched on phone number, which is how a dropped
          call resumes where it left off.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or phone number"
          className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-accent-orange"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Date of birth</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Address</th>
              <th className="px-5 py-3 font-medium">Calls</th>
              <th className="px-5 py-3 font-medium">Bookings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shown.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {p.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium text-slate-900">
                      {p.fullName}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {new Date(p.dateOfBirth).toLocaleDateString("en-AU")}
                </td>
                <td className="px-5 py-3.5 text-slate-600">{p.phoneNumber}</td>
                <td className="px-5 py-3.5 text-slate-500">{p.address}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  {calls.filter((c) => c.patientId === p.id).length}
                </td>
                <td className="px-5 py-3.5 text-slate-600">
                  {bookings.filter((b) => b.patientId === p.id).length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}