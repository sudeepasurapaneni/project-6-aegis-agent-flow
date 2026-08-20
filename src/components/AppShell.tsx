import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_APPS, ROLE_LABEL } from "@/lib/demo-data";
import { Badge, Button, Panel } from "./ui-kit";

const NAV: { to: string; label: string }[] = [
  { to: "/app/customer", label: "Customer App" },
  { to: "/app/agents", label: "AI Agent Management" },
  { to: "/app/merchant", label: "Merchant App" },
  { to: "/app/fraud", label: "Fraud & Risk" },
  { to: "/app/admin", label: "Admin & Security" },
];

export function AppShell({
  zone,
  title,
  subtitle,
  children,
}: {
  zone: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const allowed = session ? ROLE_APPS[session.role] : [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/20 text-primary">◈</span>
            <span className="font-semibold tracking-tight">AegisFlow</span>
          </Link>
          <nav className="flex flex-1 flex-wrap gap-1 text-sm">
            {NAV.map((n) => {
              const permitted = allowed.some((a) => n.to.startsWith(a));
              const active = pathname.startsWith(n.to);
              return permitted ? (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {n.label}
                </Link>
              ) : (
                <span
                  key={n.to}
                  title="Denied by role-based access control"
                  className="cursor-not-allowed rounded-lg px-3 py-1.5 text-muted-foreground/40 line-through"
                >
                  {n.label}
                </span>
              );
            })}
          </nav>
          <Link to="/architecture" className="text-sm text-accent hover:underline">
            Architecture
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight">{session.name}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABEL[session.role]}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  navigate({ to: "/login", replace: true });
                }}
              >
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Badge tone="info">{zone}</Badge>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Panel className="!p-3 text-xs text-muted-foreground">
            Zero Trust: authenticate → verify session → authorize role → allow / deny
          </Panel>
        </div>
        {children}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-6 text-xs text-muted-foreground">
        AegisFlow — educational prototype. No real payment systems, no real money.
      </footer>
    </div>
  );
}
