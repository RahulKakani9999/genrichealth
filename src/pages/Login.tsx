import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Lock, ShieldCheck, Stethoscope, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/types";

const roleOptions: {
  value: Role;
  label: string;
  icon: typeof ShieldCheck;
  email: string;
  password: string;
}[] = [
  {
    value: "admin",
    label: "Administrator",
    icon: ShieldCheck,
    email: "admin@genrichealth.com.au",
    password: "admin123",
  },
  {
    value: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    email: "dr.chen@genrichealth.com.au",
    password: "doctor123",
  },
  {
    value: "patient",
    label: "Patient",
    icon: User2,
    email: "j.patel@example.com",
    password: "patient123",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    setError(null);
    const failure = login(email, password, role);
    if (failure) {
      setError(failure);
      return;
    }
    navigate(`/${role}`);
  }

  function fillDemo() {
    const option = roleOptions.find((r) => r.value === role)!;
    setEmail(option.email);
    setPassword(option.password);
    setError(null);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-brand p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-orange">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            GenericHealth
          </span>
        </div>

        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-semibold leading-tight">
            After-hours care, answered on the first ring.
          </h1>
          <p className="text-white/70 leading-relaxed">
            An AI voice receptionist that screens for emergencies, collects
            patient details, takes payment and connects the on-call doctor —
            without a human answering the phone at 2am.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-sm text-white/60">Clinics live</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">24/7</p>
              <p className="text-sm text-white/60">Coverage</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">&lt;2s</p>
              <p className="text-sm text-white/60">Answer time</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40">
          Emergency calls are always redirected to 000 before any payment is
          taken.
        </p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-500">
              Select your role to continue to the portal.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const active = role === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setRole(option.value);
                    setError(null);
                  }}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs font-medium transition ${
                    active
                      ? "border-accent-orange bg-accent-orange-soft text-brand"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="you@genrichealth.com.au"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full bg-brand hover:bg-brand-dark"
            >
              <Lock className="mr-2 h-4 w-4" />
              Sign in
            </Button>

            <button
              onClick={fillDemo}
              className="w-full text-center text-xs text-slate-400 underline-offset-4 hover:text-accent-orange hover:underline"
            >
              Use demo credentials for this role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}