import { NavLink } from "react-router-dom";
import { Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export default function Sidebar({ items }: { items: NavItem[] }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-orange">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-brand">
          GenericHealth
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-accent-orange-soft font-medium text-brand"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-accent-orange" : "text-slate-400"
                    }`}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="text-[11px] leading-relaxed text-slate-400">
          After-hours platform v1.0
          <br />
          Emergency calls route to 000
        </p>
      </div>
    </aside>
  );
}