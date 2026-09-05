import { X } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

interface Props {
  groups: FilterGroup[];
  active: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
  shown: number;
  total: number;
}

export default function FilterBar({
  groups,
  active,
  onChange,
  onClear,
  shown,
  total,
}: Props) {
  const activeCount = Object.values(active).filter((v) => v && v !== "all")
    .length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        {groups.map((group) => (
          <div key={group.key} className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              {group.label}
            </span>
            <select
              value={active[group.key] ?? "all"}
              onChange={(e) => onChange(group.key, e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-accent-orange"
            >
              {group.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:border-red-300 hover:text-red-600"
          >
            <X className="h-3 w-3" />
            Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Showing <strong className="text-slate-600">{shown}</strong> of {total}
      </p>
    </div>
  );
}