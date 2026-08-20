import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Guard } from "@/components/Guard";
import { Badge, Bar, Button, Panel, SectionTitle, Stat, Table } from "@/components/ui-kit";
import { AGENTS, TRANSACTIONS, inr, type TxnStatus } from "@/lib/demo-data";

export const Route = createFileRoute("/app/customer")({
  head: () => ({
    meta: [
      { title: "Customer dashboard — AegisFlow" },
      { name: "description", content: "Balance, active AI agents, today's spending, pending approvals and recent agent transactions." },
      { property: "og:title", content: "Customer dashboard — AegisFlow" },
      { property: "og:description", content: "Control AI agent payments, approve or reject pending transactions and manage security settings." },
    ],
  }),
  component: () => (
    <Guard allow={["customer"]}>
      <CustomerApp />
    </Guard>
  ),
});

const tone = (s: TxnStatus) => (s === "approved" ? "success" : s === "blocked" ? "danger" : "warning") as const;

function CustomerApp() {
  const [txns, setTxns] = useState(TRANSACTIONS);
  const activeAgents = AGENTS.filter((a) => a.status === "active");
  const spentToday = AGENTS.reduce((s, a) => s + a.spentToday, 0);
  const pending = txns.filter((t) => t.status === "pending");

  const decide = (id: string, status: TxnStatus) =>
    setTxns((prev) => prev.map((t) => (t.id === id ? { ...t, status, reason: `Manually ${status} by account holder.` } : t)));

  return (
    <AppShell
      zone="Customer Zone"
      title="Customer Application"
      subtitle="Your account, your agents, your approvals. This app can never reach admin or fraud data."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Account balance" value={inr(184320)} sub="Savings •••• 4821" />
        <Stat label="Active AI agents" value={String(activeAgents.length)} sub={activeAgents.map((a) => a.name).join(", ")} />
        <Stat label="Today's spending" value={inr(spentToday)} sub="Across all agents" />
        <Stat label="Pending approvals" value={String(pending.length)} sub="Awaiting your decision" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionTitle title="Recent transactions" hint="Agent → merchant → amount → decision" />
          <Table head={["Agent", "Merchant", "Category", "Amount", "Status"]}>
            {txns.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2 font-medium">{t.agent}</td>
                <td className="px-3 py-2">{t.merchant}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.category}</td>
                <td className="px-3 py-2">{inr(t.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={tone(t.status)}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel>
          <SectionTitle title="Pending approvals" hint="Human control over every risky payment." />
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing waiting on you.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((t) => (
                <div key={t.id} className="rounded-xl border border-warning/40 bg-warning/5 p-3">
                  <p className="text-sm font-medium">
                    {t.agent} → {t.merchant}
                  </p>
                  <p className="text-lg font-semibold">{inr(t.amount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.reason}</p>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => decide(t.id, "approved")}>Approve</Button>
                    <Button variant="danger" onClick={() => decide(t.id, "blocked")}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionTitle title="Agent spend today" hint="Daily limits enforced by the policy engine, not the agent." />
          <div className="space-y-4">
            {AGENTS.map((a) => (
              <div key={a.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>
                    {a.name} <span className="text-muted-foreground">· {a.status}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {inr(a.spentToday)} / {inr(a.dailyLimit)}
                  </span>
                </div>
                <Bar value={a.spentToday} max={a.dailyLimit} tone={a.spentToday / a.dailyLimit > 0.8 ? "warning" : "info"} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="Security settings" hint="Account hardening controls." />
          <ul className="space-y-3 text-sm">
            {[
              ["Multi-factor authentication", "Enabled (authenticator app)", "success"],
              ["Payment approval threshold", "Above ₹7,000 needs human approval", "info"],
              ["New-device alerts", "Enabled", "success"],
              ["Agent auto-revoke on anomaly", "Enabled", "success"],
            ].map(([label, value, t]) => (
              <li key={label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{value}</p>
                </div>
                <Badge tone={t as "success" | "info"}>on</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
