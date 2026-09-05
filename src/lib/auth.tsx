import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { users } from "@/mocks/data";
import type { Role, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string, role: Role) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "gh_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function login(email: string, password: string, role: Role): string | null {
    const match = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!match) return "No account found with that email address.";
    if (match.password !== password) return "Incorrect password.";
    if (match.role !== role)
      return `This account is registered as ${match.role}, not ${role}.`;

    setUser(match);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    return null;
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}