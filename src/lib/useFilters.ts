import { useSearchParams } from "react-router-dom";

export function useFilters(keys: string[]) {
  const [params, setParams] = useSearchParams();

  const active: Record<string, string> = {};
  keys.forEach((k) => {
    active[k] = params.get(k) ?? "all";
  });

  function set(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function clear() {
    const next = new URLSearchParams(params);
    keys.forEach((k) => next.delete(k));
    setParams(next, { replace: true });
  }

  return { active, set, clear };
}