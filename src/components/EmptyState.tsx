import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  detail,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-full bg-slate-50 p-3">
        <Icon className="h-5 w-5 text-slate-300" />
      </div>
      <p className="mt-4 font-medium text-slate-900">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{detail}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:border-accent-orange hover:text-accent-orange"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}