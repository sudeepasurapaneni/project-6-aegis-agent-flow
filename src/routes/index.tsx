import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Panel } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { ROLE_APPS, ROLE_LABEL } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AegisFlow — Multi-domain AI agent payment platform" },
      {
        name: "description",
        content:
          "AegisFlow demo: five separate applications for customers, AI agents, merchants, fraud analysts and administrators, built on zero trust and least privilege.",
      },
      { property: "og:title", content: "AegisFlow — Multi-domain AI agent payment platform" },
      {
        property: "og:description",
        content: "Explore the customer, agent, merchant, fraud and admin domains of the AegisFlow security architecture.",
      },
    ],
  }),
  component: Home,
});

const DOMAINS = [
  { to: "/app/customer", name: "Customer Application", zone: "Customer Zone", role: "Customer", desc: "Account, transactions, payment approvals and security settings." },
  { to: "/app/agents", name: "AI Agent Management", zone: "Payment Zone", role: "Customer", desc: "Create agents, set spending limits and allowed categories, pause or revoke." },
  { to: "/app/merchant", name: "Merchant Application", zone: "Payment Zone", role: "Merchant", desc: "Orders, payments, refunds and settlement reporting — own data only." },
  { to: "/app/fraud", name: "Fraud & Risk Application", zone: "Fraud Zone", role: "Fraud Analyst", desc: "Risk scoring, alerts, investigations and payment blocking." },
  { to: "/app/admin", name: "Admin & Security", zone: "Admin Zone", role: "Administrator", desc: "Users, roles, access policies, audit logs and security events." },
] as const;

const PILLARS = [
  ["Defense in Depth", "WAF → authentication → authorization → application → database."],
  ["Least Privilege", "Agents and users receive only the permissions they need."],
  ["Zero Trust", "Every sensitive request is authenticated, verified and authorized."],
  ["Secure Authentication", "Password + 6-digit MFA with short-lived demo sessions."],
  ["Strong Authorization", "Role-based access control across four distinct roles."],
  ["Network Segmentation", "Five zones with explicitly controlled communication paths."],
];

function Home() {
  const { session } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/20 text-primary">◈</span>
          <span className="text-lg font-semibold tracking-tight">AegisFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/architecture" className="text-sm text-accent hover:underline">
            Architecture
          </Link>
          <Link to="/login">
            <Button>{session ? "Switch account" : "Secure login"}</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8">
        <Badge tone="info">Educational prototype — no real money</Badge>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Smart payments. <span className="text-primary">Human control.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          AegisFlow lets customers authorize AI agents to pay on their behalf inside strict limits. The platform is built
          as five separate applications with different business purposes, isolated network zones and role-based access.
        </p>
        {session ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{session.name}</span> ({ROLE_LABEL[session.role]}) — your
            authorized domain:{" "}
            <Link to={ROLE_APPS[session.role][0]!} className="text-accent hover:underline">
              open application
            </Link>
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">Five application domains</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d) => (
            <Panel key={d.to}>
              <div className="flex items-center justify-between gap-2">
                <Badge tone="info">{d.zone}</Badge>
                <Badge>{d.role}</Badge>
              </div>
              <h3 className="mt-3 font-semibold">{d.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
              <Link to={d.to} className="mt-4 inline-block text-sm text-accent hover:underline">
                Enter application →
              </Link>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">Six security concepts demonstrated</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(([t, d]) => (
            <Panel key={t}>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Panel>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-muted-foreground">
        AegisFlow is fictional and for coursework demonstration only. React · Node/Express-style REST design · PostgreSQL ·
        JWT + MFA.
      </footer>
    </div>
  );
}
