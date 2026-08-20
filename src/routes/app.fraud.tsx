import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Guard } from "@/components/Guard";
import { Badge, Bar, Button, Panel, SectionTitle, Stat, Table } from "@/components/ui-kit";
import { FRAUD_ALERTS, TRANSACTIONS, inr } from "@/lib/demo-data";

export const Route = createFileRoute("/app/fraud")({
  head: () => ({
    meta: [
      { title: "Fraud & risk console — AegisFlow" },
      { name: "description", content: "Investigate suspicious AI agent payments, assign risk scores and block transactions." },
      { property: "og:title", content: "Fraud & risk console — AegisFlow" },
      { property: "og:description", content: "Behavioural anomaly detection and investigation workflow for agent-initiated payments." },
    ],
  }),
  component: () => (
    <Guard allow={["analyst"]}>
      <FraudApp />
    </Guard>
  ),
});

function FraudApp() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [blocked, setBlocked] = useState<string[]>(["txn_10243", "txn_10244"]);
  const [selected, setSelected] = useState(FRAUD_ALERTS[0]!.id);
  const alert = FRAUD_ALERTS.find((a) => a.id === selected)!;
  const txn = TRANSACTIONS.find((t) => t.id === alert.txn)!;

  return (
    <AppShell
      zone="Fraud Zone"
      title="Fraud & Risk Application"
      subtitle="Read-mostly analytics with block authority. Analysts cannot manage users, roles or platform settings."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Open alerts" value={String(FRAUD_ALERTS.length)} sub="2 high · 1 medium" />
        <Stat label="Blocked today" value={String(blocked.length)} sub="Policy + anomaly" />
        <Stat label="Value protected" value={inr(47000)} sub="Blocked payment value" />
        <Stat label="False positive rate" value="4.2%" sub="Rolling 7 days" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel>
          <SectionTitle title="Fraud alerts" />
          <div className="space-y-2">
            {FRAUD_ALERTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  a.id === selected ? "border-primary/60 bg-primary/10" : "border-border bg-background/40 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{a.title}</span>
                  <Badge tone={a.level === "high" ? "danger" : "warning"}>{a.score}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <SectionTitle title="Investigation" hint={`Case ${alert.id} · transaction ${txn.id}`} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-xs text-muted-foreground">Agent</p>
              <p className="font-medium">{txn.agent}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-xs text-muted-foreground">Merchant</p>
              <p className="font-medium">{txn.merchant}</p>
            </div>
            <div className="rounded-lg border border-border bg-background/40 p-3">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-medium">{inr(txn.amount)}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-sm">
              <span>Risk score</span>
              <span className={alert.level === "high" ? "text-destructive" : "text-warning"}>
                {alert.score}/100 · {alert.level.toUpperCase()}
              </span>
            </div>
            <Bar value={alert.score} max={100} tone={alert.level === "high" ? "danger" : "warning"} />
          </div>

          <div className="mt-4 rounded-xl border border-border bg-background/40 p-3 text-sm">
            <p className="text-muted-foreground">Reason</p>
            <p className="mt-1">{alert.detail}</p>
            <p className="mt-2 text-muted-foreground">Policy note</p>
            <p className="mt-1">{txn.reason}</p>
          </div>

          <textarea
            className="mt-4 w-full rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-primary"
            rows={3}
            placeholder="Investigation notes…"
            value={notes[alert.id] ?? ""}
            onChange={(e) => setNotes({ ...notes, [alert.id]: e.target.value })}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() => setBlocked((b) => (b.includes(txn.id) ? b : [...b, txn.id]))}
            >
              {blocked.includes(txn.id) ? "Payment blocked" : "Block payment"}
            </Button>
            <Button variant="outline">Escalate for human approval</Button>
            <Button variant="ghost">Mark as false positive</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Analyst actions never modify user accounts or roles — those live in the Admin Zone.
          </p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <SectionTitle title="Transaction monitoring" hint="All agent payments visible to risk operations." />
        <Table head={["Txn", "Agent", "Merchant", "Amount", "Risk", "Status"]}>
          {TRANSACTIONS.map((t) => (
            <tr key={t.id}>
              <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
              <td className="px-3 py-2">{t.agent}</td>
              <td className="px-3 py-2 text-muted-foreground">{t.merchant}</td>
              <td className="px-3 py-2">{inr(t.amount)}</td>
              <td className="px-3 py-2">
                <Badge tone={t.risk === "high" ? "danger" : t.risk === "medium" ? "warning" : "success"}>{t.risk}</Badge>
              </td>
              <td className="px-3 py-2">
                <Badge tone={blocked.includes(t.id) || t.status === "blocked" ? "danger" : t.status === "pending" ? "warning" : "success"}>
                  {blocked.includes(t.id) ? "blocked" : t.status}
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </AppShell>
  );
}
