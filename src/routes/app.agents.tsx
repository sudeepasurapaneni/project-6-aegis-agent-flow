import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Guard } from "@/components/Guard";
import { Badge, Bar, Button, Panel, SectionTitle, Table } from "@/components/ui-kit";
import { AGENTS, TRANSACTIONS, inr, type Agent, type AgentStatus } from "@/lib/demo-data";

export const Route = createFileRoute("/app/agents")({
  head: () => ({
    meta: [
      { title: "AI agent management — AegisFlow" },
      { name: "description", content: "Create AI payment agents, set per-transaction and daily limits, allow categories, pause or revoke access." },
      { property: "og:title", content: "AI agent management — AegisFlow" },
      { property: "og:description", content: "Least-privilege permissions for AI agents that pay on your behalf." },
    ],
  }),
  component: () => (
    <Guard allow={["customer"]}>
      <AgentsApp />
    </Guard>
  ),
});

const CATEGORIES = ["Flights", "Hotels", "Transportation", "Groceries", "Household", "Utilities"];

function AgentsApp() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", purpose: "", perTxnLimit: 5000, dailyLimit: 10000, allowed: [] as string[] });
  const [simAgent, setSimAgent] = useState(agents[0]!.id);
  const [simAmount, setSimAmount] = useState(6500);
  const [simCategory, setSimCategory] = useState("Hotels");
  const [simResult, setSimResult] = useState<{ ok: boolean; label: string; reason: string } | null>(null);

  const setStatus = (id: string, status: AgentStatus) =>
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const createAgent = () => {
    if (!form.name.trim()) return;
    setAgents((prev) => [
      ...prev,
      {
        id: `agt_${form.name.toLowerCase().replace(/\s+/g, "")}`,
        name: form.name,
        purpose: form.purpose || "General purpose agent",
        perTxnLimit: Number(form.perTxnLimit),
        dailyLimit: Number(form.dailyLimit),
        spentToday: 0,
        allowed: form.allowed.length ? form.allowed : ["Groceries"],
        blocked: ["Gambling", "Cryptocurrency", "Cash transfer"],
        status: "active",
      },
    ]);
    setForm({ name: "", purpose: "", perTxnLimit: 5000, dailyLimit: 10000, allowed: [] });
    setCreating(false);
  };

  const runSimulation = () => {
    const a = agents.find((x) => x.id === simAgent)!;
    if (a.status !== "active")
      return setSimResult({ ok: false, label: "BLOCKED", reason: `Agent is ${a.status}; no payment authority.` });
    if (!a.allowed.includes(simCategory))
      return setSimResult({ ok: false, label: "BLOCKED", reason: `Category "${simCategory}" is not in the agent's allowed list.` });
    if (simAmount > a.perTxnLimit)
      return setSimResult({ ok: false, label: "BLOCKED", reason: `Amount exceeds the ${inr(a.perTxnLimit)} per-transaction limit.` });
    if (a.spentToday + simAmount > a.dailyLimit)
      return setSimResult({ ok: false, label: "BLOCKED", reason: `Daily limit of ${inr(a.dailyLimit)} would be exceeded.` });
    if (simAmount > a.perTxnLimit * 0.85)
      return setSimResult({ ok: false, label: "HUMAN APPROVAL REQUIRED", reason: "Amount is close to the ceiling and unusual for this agent." });
    return setSimResult({ ok: true, label: "APPROVED", reason: "Within limits, category allowed, risk score low." });
  };

  const field = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <AppShell
      zone="Payment / Application Zone"
      title="AI Agent Management Application"
      subtitle="Agents act only inside the permissions you grant. They cannot touch your profile, other customers or the database."
    >
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreating((c) => !c)}>{creating ? "Cancel" : "+ Create AI agent"}</Button>
      </div>

      {creating ? (
        <Panel className="mb-6">
          <SectionTitle title="New agent" hint="Grant the minimum permissions required for its purpose." />
          <div className="grid gap-3 md:grid-cols-2">
            <input className={field} placeholder="Agent name (e.g. TravelBot)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={field} placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            <label className="text-sm text-muted-foreground">
              Per-transaction limit (₹)
              <input type="number" className={`mt-1 ${field}`} value={form.perTxnLimit} onChange={(e) => setForm({ ...form, perTxnLimit: Number(e.target.value) })} />
            </label>
            <label className="text-sm text-muted-foreground">
              Daily limit (₹)
              <input type="number" className={`mt-1 ${field}`} value={form.dailyLimit} onChange={(e) => setForm({ ...form, dailyLimit: Number(e.target.value) })} />
            </label>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Allowed categories</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = form.allowed.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, allowed: on ? form.allowed.filter((x) => x !== c) : [...form.allowed, c] })}
                  className={`chip ${on ? "border-primary/50 bg-primary/15 text-primary" : "text-muted-foreground"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <Button className="mt-4" onClick={createAgent}>
            Create agent
          </Button>
        </Panel>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {agents.map((a) => (
          <Panel key={a.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{a.purpose}</p>
              </div>
              <Badge tone={a.status === "active" ? "success" : a.status === "paused" ? "warning" : "danger"}>{a.status}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">Per transaction</p>
                <p className="font-semibold">{inr(a.perTxnLimit)}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <p className="text-xs text-muted-foreground">Daily limit</p>
                <p className="font-semibold">{inr(a.dailyLimit)}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Spent today</span>
                <span>
                  {inr(a.spentToday)} / {inr(a.dailyLimit)}
                </span>
              </div>
              <Bar value={a.spentToday} max={a.dailyLimit} />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-success">✓ {a.allowed.join(" · ")}</p>
              <p className="text-destructive">✕ {a.blocked.join(" · ")}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setCreating(true)}>
                Edit permissions
              </Button>
              <Button variant="outline" onClick={() => setStatus(a.id, a.status === "paused" ? "active" : "paused")}>
                {a.status === "paused" ? "Resume agent" : "Pause agent"}
              </Button>
              <Button variant="danger" onClick={() => setStatus(a.id, "revoked")}>
                Revoke access
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="Permission check simulator" hint="Runs the same policy gate the payment service applies." />
          <div className="grid gap-3 sm:grid-cols-3">
            <select className={field} value={simAgent} onChange={(e) => setSimAgent(e.target.value)}>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <select className={field} value={simCategory} onChange={(e) => setSimCategory(e.target.value)}>
              {[...CATEGORIES, "Gambling", "Cryptocurrency"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input type="number" className={field} value={simAmount} onChange={(e) => setSimAmount(Number(e.target.value))} />
          </div>
          <Button className="mt-3" onClick={runSimulation}>
            Run authorization check
          </Button>
          {simResult ? (
            <div
              className={`mt-4 rounded-xl border p-4 ${
                simResult.ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
              }`}
            >
              <p className={`font-semibold ${simResult.ok ? "text-success" : "text-destructive"}`}>{simResult.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{simResult.reason}</p>
            </div>
          ) : null}
        </Panel>

        <Panel>
          <SectionTitle title="Agent activity log" hint="Every attempt is recorded, allowed or denied." />
          <Table head={["Agent", "Merchant", "Amount", "Outcome"]}>
            {TRANSACTIONS.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2">{t.agent}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.merchant}</td>
                <td className="px-3 py-2">{inr(t.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={t.status === "approved" ? "success" : t.status === "blocked" ? "danger" : "warning"}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </AppShell>
  );
}
