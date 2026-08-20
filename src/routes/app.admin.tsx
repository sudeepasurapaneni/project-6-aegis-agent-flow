import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Guard } from "@/components/Guard";
import { Badge, Button, Panel, SectionTitle, Stat, Table } from "@/components/ui-kit";
import { AUDIT_LOGS, PERMISSIONS, ROLE_LABEL, SECURITY_EVENTS, USERS, type Role } from "@/lib/demo-data";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [
      { title: "Admin & security console — AegisFlow" },
      { name: "description", content: "Manage users, roles, access policies, audit logs and security events in the restricted admin zone." },
      { property: "og:title", content: "Admin & security console — AegisFlow" },
      { property: "og:description", content: "Highest-restriction domain: RBAC administration, audit trail and security monitoring." },
    ],
  }),
  component: () => (
    <Guard allow={["admin"]}>
      <AdminApp />
    </Guard>
  ),
});

const POLICIES = [
  ["MFA required for all roles", "Enforced"],
  ["Admin console restricted to corporate network", "Enforced"],
  ["Session lifetime 15 minutes", "Enforced"],
  ["Fraud analysts denied user management", "Enforced"],
  ["Agents denied direct database access", "Enforced"],
  ["Cross-zone traffic default-deny", "Enforced"],
];

function AdminApp() {
  const [users, setUsers] = useState(USERS);

  const changeRole = (id: string, role: Role) => setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
  const toggleStatus = (id: string) =>
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" } : x)));

  return (
    <AppShell
      zone="Admin Zone"
      title="Admin & Security Application"
      subtitle="Highest security restrictions: admin network only, MFA enforced, every action written to an immutable audit log."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Users" value={String(users.length)} sub={`${users.filter((u) => u.status === "Active").length} active`} />
        <Stat label="Roles" value="4" sub="Customer · Merchant · Analyst · Admin" />
        <Stat label="Security events (24h)" value={String(SECURITY_EVENTS.length)} sub="1 critical" />
        <Stat label="Audit entries" value={String(AUDIT_LOGS.length)} sub="Append-only" />
      </div>

      <Panel className="mt-6">
        <SectionTitle title="User management" hint="Assign roles and suspend accounts." />
        <Table head={["User", "Email", "Role", "MFA", "Status", "Action"]}>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-3 py-2 font-medium">{u.name}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{u.email}</td>
              <td className="px-3 py-2">
                <select
                  className="rounded-lg border border-border bg-background/60 px-2 py-1 text-xs"
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as Role)}
                >
                  {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-3 py-2">
                <Badge tone={u.mfa ? "success" : "danger"}>{u.mfa ? "enabled" : "missing"}</Badge>
              </td>
              <td className="px-3 py-2">
                <Badge tone={u.status === "Active" ? "success" : "danger"}>{u.status}</Badge>
              </td>
              <td className="px-3 py-2">
                <Button variant="outline" onClick={() => toggleStatus(u.id)}>
                  {u.status === "Active" ? "Suspend" : "Reinstate"}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="Role permissions" hint="Least privilege enforced server-side." />
          <div className="space-y-3">
            {PERMISSIONS.map((p) => (
              <div key={p.role} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="font-medium">{ROLE_LABEL[p.role]}</p>
                <p className="mt-1 text-xs text-success">✓ {p.can.join(" · ")}</p>
                <p className="mt-1 text-xs text-destructive">✕ {p.cannot.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="Access policies" />
          <ul className="space-y-2 text-sm">
            {POLICIES.map(([p, s]) => (
              <li key={p} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3">
                <span>{p}</span>
                <Badge tone="success">{s}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="Security monitoring" hint="Login and access events." />
          <Table head={["Event", "Principal", "Severity", "Time"]}>
            {SECURITY_EVENTS.map((e) => (
              <tr key={e.id}>
                <td className="px-3 py-2">{e.type}</td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{e.who}</td>
                <td className="px-3 py-2">
                  <Badge tone={e.severity === "critical" ? "danger" : e.severity === "warning" ? "warning" : "info"}>{e.severity}</Badge>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{e.time}</td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel>
          <SectionTitle title="Audit log" hint="Append-only record of privileged actions." />
          <Table head={["Actor", "Action", "Target", "Time"]}>
            {AUDIT_LOGS.map((l) => (
              <tr key={l.id}>
                <td className="px-3 py-2 font-mono text-xs">{l.actor}</td>
                <td className="px-3 py-2">{l.action}</td>
                <td className="px-3 py-2 text-muted-foreground">{l.target}</td>
                <td className="px-3 py-2 text-muted-foreground">{l.time}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </AppShell>
  );
}
