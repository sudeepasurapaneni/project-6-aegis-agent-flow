import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Panel>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </Panel>
  );
}

type Tone = "success" | "danger" | "warning" | "info" | "muted";

const toneClass: Record<Tone, string> = {
  success: "border-success/40 bg-success/10 text-success",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10 text-warning",
  info: "border-primary/40 bg-primary/10 text-primary",
  muted: "border-border bg-secondary/40 text-muted-foreground",
};

export function Badge({ tone = "muted", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`chip ${toneClass[tone]}`}>{children}</span>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-border bg-secondary/30 hover:bg-secondary/60",
    ghost: "hover:bg-secondary/50",
    danger: "border border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Bar({ value, max, tone = "info" }: { value: number; max: number; tone?: Tone }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const fill: Record<Tone, string> = {
    success: "bg-success",
    danger: "bg-destructive",
    warning: "bg-warning",
    info: "bg-primary",
    muted: "bg-muted-foreground",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
      <div className={`h-full rounded-full ${fill[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}
