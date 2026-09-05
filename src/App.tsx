import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import Login from "@/pages/Login";
import type { Role } from "@/types";

function Guard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
}

function Placeholder({ title }: { title: string }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <h1 className="text-2xl font-semibold text-brand">{title}</h1>
      <p className="text-slate-500">
        Signed in as {user?.name} ({user?.jobTitle})
      </p>
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
                <Placeholder title="Admin Console" />
              </Guard>
            }
          />
          <Route
            path="/doctor"
            element={
              <Guard role="doctor">
                <Placeholder title="Doctor Portal" />
              </Guard>
            }
          />
          <Route
            path="/patient"
            element={
              <Guard role="patient">
                <Placeholder title="Patient Portal" />
              </Guard>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}