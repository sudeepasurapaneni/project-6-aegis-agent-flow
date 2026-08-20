import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Guard } from "@/components/Guard";
import { Badge, Panel, SectionTitle, Stat, Table } from "@/components/ui-kit";
import { MERCHANT_ORDERS, MERCHANT_REFUNDS, SETTLEMENTS, TRANSACTIONS, inr } from "@/lib/demo-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/merchant")({
  head: () => ({
    meta: [
      { title: "Merchant console — AegisFlow" },
      { name: "description", content: "Merchant orders, payments, refunds and settlement reporting, scoped strictly to your own business data." },
      { property: "og:title", content: "Merchant console — AegisFlow" },
      { property: "og:description", content: "Receive and manage payments from customers and their AI agents." },
    ],
  }),
  component: () => (
    <Guard allow={["merchant"]}>
      <MerchantApp />
    </Guard>
  ),
});

function MerchantApp() {
  const { session } = useAuth();
  const myTxns = TRANSACTIONS.filter((t) => t.merchant === "UrbanCart");
  const gross = MERCHANT_ORDERS.filter((o) => o.status !== "Refunded").reduce((s, o) => s + o.amount, 0);

  return (
    <AppShell
      zone="Payment / Application Zone"
      title="Merchant Application"
      subtitle={`${session?.org ?? "Merchant"} — data access is filtered by merchant ID on the server; other merchants' records are never returned.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gross volume (7d)" value={inr(gross)} sub="Own business only" />
        <Stat label="Orders" value={String(MERCHANT_ORDERS.length)} sub="Includes AI-agent orders" />
        <Stat label="Refunds" value={String(MERCHANT_REFUNDS.length)} sub="1 processing" />
        <Stat label="Next settlement" value={inr(20923)} sub="In transit · T+1" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="Orders" hint="Human and AI-agent initiated purchases." />
          <Table head={["Order", "Buyer", "Initiated by", "Amount", "Status"]}>
            {MERCHANT_ORDERS.map((o) => (
              <tr key={o.id}>
                <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                <td className="px-3 py-2">{o.buyer}</td>
                <td className="px-3 py-2 text-muted-foreground">{o.agent}</td>
                <td className="px-3 py-2">{inr(o.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={o.status === "Refunded" ? "danger" : o.status === "Fulfilled" ? "success" : "warning"}>{o.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel>
          <SectionTitle title="Transaction history" hint="Payments received through AegisFlow." />
          <Table head={["Txn", "Agent", "Amount", "Status"]}>
            {myTxns.map((t) => (
              <tr key={t.id}>
                <td className="px-3 py-2 font-mono text-xs">{t.id}</td>
                <td className="px-3 py-2">{t.agent}</td>
                <td className="px-3 py-2">{inr(t.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={t.status === "approved" ? "success" : "danger"}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel>
          <SectionTitle title="Refunds" />
          <Table head={["Refund", "Order", "Amount", "Reason", "Status"]}>
            {MERCHANT_REFUNDS.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 font-mono text-xs">{r.id}</td>
                <td className="px-3 py-2 font-mono text-xs">{r.order}</td>
                <td className="px-3 py-2">{inr(r.amount)}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.reason}</td>
                <td className="px-3 py-2">
                  <Badge tone={r.status === "Completed" ? "success" : "warning"}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel>
          <SectionTitle title="Settlements" hint="Payouts to your registered bank account." />
          <Table head={["Batch", "Period", "Gross", "Fees", "Net", "Status"]}>
            {SETTLEMENTS.map((s) => (
              <tr key={s.id}>
                <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                <td className="px-3 py-2">{s.period}</td>
                <td className="px-3 py-2">{inr(s.gross)}</td>
                <td className="px-3 py-2 text-muted-foreground">{inr(s.fees)}</td>
                <td className="px-3 py-2 font-medium">{inr(s.net)}</td>
                <td className="px-3 py-2">
                  <Badge tone={s.status === "Settled" ? "success" : "info"}>{s.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>

      <Panel className="mt-6">
        <SectionTitle title="Access boundary" />
        <p className="text-sm text-destructive">
          ✕ Merchant Application cannot reach the Admin Application, customer profiles, or another merchant's settlements.
        </p>
      </Panel>
    </AppShell>
  );
}
