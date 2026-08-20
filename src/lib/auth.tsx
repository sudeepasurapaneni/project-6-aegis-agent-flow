import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEMO_ACCOUNTS, ROLE_APPS, type Role } from "./demo-data";

export type Session = { email: string; name: string; role: Role; org: string; mfa: true; issuedAt: number };

type AuthCtx = {
  session: Session | null;
  ready: boolean;
  verifyCredentials: (email: string, password: string) => { ok: boolean; error?: string };
  completeMfa: (email: string, code: string) => { ok: boolean; error?: string };
  signOut: () => void;
  canAccess: (path: string) => boolean;
};

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "aegisflow.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore corrupt demo session */
    }
    setReady(true);
  }, []);

  const verifyCredentials = useCallback((email: string, password: string) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase());
    if (!acc || acc.password !== password) return { ok: false, error: "Invalid email or password." };
    return { ok: true };
  }, []);

  const completeMfa = useCallback((email: string, code: string) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase());
    if (!acc) return { ok: false, error: "Session expired, start again." };
    if (code.trim() !== acc.otp) return { ok: false, error: "Incorrect 6-digit code." };
    const s: Session = { email: acc.email, name: acc.name, role: acc.role, org: acc.org, mfa: true, issuedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  const canAccess = useCallback(
    (path: string) => (session ? ROLE_APPS[session.role].some((p) => path.startsWith(p)) : false),
    [session],
  );

  const value = useMemo(
    () => ({ session, ready, verifyCredentials, completeMfa, signOut, canAccess }),
    [session, ready, verifyCredentials, completeMfa, signOut, canAccess],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
