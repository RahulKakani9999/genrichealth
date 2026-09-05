import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  Building2,
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  PhoneCall,
  Stethoscope,
  Users,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import AppShell from "@/components/layout/AppShell";
import type { NavItem } from "@/components/layout/Sidebar";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import Clinics from "@/pages/admin/Clinics";
import type { Role } from "@/types";

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Clinics", to: "/admin/clinics", icon: Building2 },
  { label: "Doctors", to: "/admin/doctors", icon: Stethoscope },
  { label: "On-call roster", to: "/admin/roster", icon: CalendarClock },
  { label: "Calls", to: "/admin/calls", icon: PhoneCall },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Patients", to: "/admin/patients", icon: Users },
];

function Guard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
}

function Stub({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">This screen is next up.</p>
    </div>
  );
}

function SimplePortal({ title }: { title: string }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <h1 className="text-2xl font-semibold text-brand">{title}</h1>
      <p className="text-slate-500">Signed in as {user?.name}</p>
      <button
        onClick={logout}
        className="rounded-md bg-accent-orange px-4 py-2 text-sm text-white"
      >
        Sign out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <Guard role="admin">
                <AppShell nav={adminNav} />
              </Guard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="clinics" element={<Clinics />} />
            <Route path="doctors" element={<Stub title="Doctors" />} />
            <Route path="roster" element={<Stub title="On-call roster" />} />
            <Route path="calls" element={<Stub title="Calls" />} />
            <Route path="payments" element={<Stub title="Payments" />} />
            <Route path="patients" element={<Stub title="Patients" />} />
          </Route>

          <Route
            path="/doctor"
            element={
              <Guard role="doctor">
                <SimplePortal title="Doctor Portal" />
              </Guard>
            }
          />
          <Route
            path="/patient"
            element={
              <Guard role="patient">
                <SimplePortal title="Patient Portal" />
              </Guard>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}