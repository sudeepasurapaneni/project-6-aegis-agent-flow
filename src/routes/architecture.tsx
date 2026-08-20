import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Panel, SectionTitle } from "@/components/ui-kit";
import { PERMISSIONS, ROLE_LABEL } from "@/lib/demo-data";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Security architecture — AegisFlow" },
      {
        name: "description",
        content: "Network segmentation zones, defense in depth layers and the AegisFlow payment security flow explained.",
      },
      { property: "og:title", content: "Security architecture — AegisFlow" },
      { property: "og:description", content: "Zones, trust boundaries, RBAC matrix and the agent payment authorization flow." },
    ],
  }),
  component: Architecture,
});

const ZONES = [
  { zone: "Customer Zone", apps: ["Customer Application"], notes: "Public internet edge behind WAF. Holds no secrets." },
  { zone: "Payment / Application Zone", apps: ["AI Agent Management", "Payment Services", "Merchant Application"], notes: "Business logic and policy engine. Only zone allowed to call payment services." },
  { zone: "Fraud Zone", apps: ["Fraud & Risk Application"], notes: "Read-mostly analytics. Can block payments, cannot move money." },
  { zone: "Admin Zone", apps: ["Admin & Security Application"], notes: "Highest restrictions: admin network only, MFA + audit on every action." },
  { zone: "Database Zone", apps: ["Customer DB", "Payments DB", "Fraud DB", "Admin DB"], notes: "No inbound internet. Reachable only from its owning service." },
];

const FLOWS_ALLOWED = [
  "Customer Application → Payment Service (REST, mTLS)",
  "AI Agent → Policy Engine → Payment Service",
  "Payment Service → Payments DB",
  "Fraud Application → Payments DB (read-only replica)",
  "Admin Application → Admin DB",
];

const FLOWS_DENIED = [
  "Customer Application ✕→ Admin Database",
  "AI Agent ✕→ Direct database access",
  "Merchant Application ✕→ Admin Application",
  "Fraud Application ✕→ Admin settings / user management",
  "Any zone ✕→ Database Zone without a service identity",
];

const LAYERS = ["Internet", "Firewall / WAF", "Authentication (JWT + MFA)", "Authorization (RBAC)", "Application", "Database"];

const FLOW = [
  "Customer",
  "AI Agent",
  "Authentication",
  "Permission Check",
  "Risk Check",
  "Authorization",
  "Payment",
  "Merchant",
];

function Architecture() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Link to="/" className="text-sm text-accent hover:underline">
            ← AegisFlow
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Security architecture</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            AegisFlow is deliberately built as five applications with different business purposes, deployed into separate
            network zones with controlled communication between them.
          </p>
        </div>

        <Panel>
          <SectionTitle title="1. Defense in depth" hint="No single control is trusted on its own." />
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            {LAYERS.map((l, i) => (
              <span key={l} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-background/50 px-3 py-1.5">{l}</span>
                {i < LAYERS.length - 1 ? <span className="text-primary">↓</span> : null}
              </span>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="2. Network segmentation" hint="Five zones, explicit allow-list between them." />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {ZONES.map((z) => (
              <div key={z.zone} className="rounded-xl border border-border bg-background/40 p-4">
                <Badge tone="info">{z.zone}</Badge>
                <ul className="mt-3 space-y-1 text-sm">
                  {z.apps.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">{z.notes}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-success/40 bg-success/5 p-4">
              <p className="mb-2 text-sm font-medium text-success">Allowed paths</p>
              <ul className="space-y-1 font-mono text-xs text-muted-foreground">
                {FLOWS_ALLOWED.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <p className="mb-2 text-sm font-medium text-destructive">Blocked paths</p>
              <ul className="space-y-1 font-mono text-xs text-muted-foreground">
                {FLOWS_DENIED.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="3. Payment security flow" hint="Every agent payment passes each gate before settlement." />
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            {FLOW.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-background/50 px-3 py-1.5">{s}</span>
                {i < FLOW.length - 1 ? <span className="text-primary">↓</span> : null}
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
              Violates agent permissions (limit or blocked category) →{" "}
              <span className="font-semibold text-destructive">TRANSACTION BLOCKED</span>
            </div>
            <div className="rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm">
              Suspicious risk score → <span className="font-semibold text-warning">HUMAN APPROVAL REQUIRED</span>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="4. Least privilege & RBAC matrix" hint="Each role gets only what its job requires." />
          <div className="grid gap-3 md:grid-cols-2">
            {PERMISSIONS.map((p) => (
              <div key={p.role} className="rounded-xl border border-border bg-background/40 p-4">
                <p className="font-medium">{ROLE_LABEL[p.role]}</p>
                <ul className="mt-2 space-y-1 text-sm text-success">
                  {p.can.map((c) => (
                    <li key={c}>✓ {c}</li>
                  ))}
                </ul>
                <ul className="mt-2 space-y-1 text-sm text-destructive">
                  {p.cannot.map((c) => (
                    <li key={c}>✕ {c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="5. Zero trust request lifecycle" hint="No implicit trust for users, agents or services." />
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Authenticate — JWT session issued only after password + MFA.</li>
            <li>2. Verify — token signature, expiry, device and zone are re-checked on every request.</li>
            <li>3. Authorize — RBAC plus agent policy (limit, category, velocity) evaluated server-side.</li>
            <li>4. Allow / Deny — decision written to the immutable audit log either way.</li>
          </ol>
        </Panel>

        <p className="pb-10 text-xs text-muted-foreground">
          Reference stack: React frontend, Node.js + Express REST services per domain, PostgreSQL per zone, AWS hosting,
          JWT + MFA. Secrets never live in frontend code.
        </p>
      </div>
    </div>
  );
}
