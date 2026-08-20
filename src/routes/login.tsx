import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Button, Panel } from "@/components/ui-kit";
import { useAuth } from "@/lib/auth";
import { DEMO_ACCOUNTS, ROLE_APPS, ROLE_LABEL } from "@/lib/demo-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Secure login — AegisFlow" },
      { name: "description", content: "Demo authentication with password and MFA for AegisFlow's four platform roles." },
      { property: "og:title", content: "Secure login — AegisFlow" },
      { property: "og:description", content: "Password plus 6-digit MFA demo sign-in for customer, merchant, analyst and admin roles." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { verifyCredentials, completeMfa } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitCreds = () => {
    const r = verifyCredentials(email, password);
    if (!r.ok) return setError(r.error ?? "Login failed.");
    setError(null);
    setStep(2);
  };

  const submitMfa = () => {
    const r = completeMfa(email, code);
    if (!r.ok) return setError(r.error ?? "Verification failed.");
    const acc = DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase())!;
    navigate({ to: ROLE_APPS[acc.role][0]!, replace: true });
  };

  const field = "w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr]">
        <Panel>
          <Link to="/" className="text-sm text-accent hover:underline">
            ← AegisFlow
          </Link>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Secure login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {step} of 2 — {step === 1 ? "credentials" : "multi-factor verification"}
          </p>

          <div className="mt-5 space-y-3">
            {step === 1 ? (
              <>
                <label className="block text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <input className={`mt-1 ${field}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@aegisflow.demo" />
                </label>
                <label className="block text-sm">
                  <span className="text-muted-foreground">Password</span>
                  <input type="password" className={`mt-1 ${field}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </label>
                <Button className="w-full" onClick={submitCreds}>
                  Continue
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  A 6-digit code was &quot;sent&quot; to the registered device for <span className="text-foreground">{email}</span>. Demo
                  code: <span className="font-mono text-accent">424242</span>
                </p>
                <input
                  className={`${field} text-center font-mono text-lg tracking-[0.5em]`}
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
                <Button className="w-full" onClick={submitMfa}>
                  Verify &amp; sign in
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => { setStep(1); setError(null); }}>
                  Back
                </Button>
              </>
            )}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Sessions are short-lived and role-scoped. After sign-in, the platform authorizes every navigation against your
            role before rendering an application.
          </p>
        </Panel>

        <Panel>
          <h2 className="font-semibold">Demo accounts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fictional users only. Click to fill the form.</p>
          <div className="mt-4 space-y-3">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                onClick={() => {
                  setEmail(a.email);
                  setPassword(a.password);
                  setStep(1);
                  setError(null);
                }}
                className="w-full rounded-xl border border-border bg-background/40 p-3 text-left transition hover:border-primary/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{ROLE_LABEL[a.role]}</span>
                  <Badge tone="info">MFA required</Badge>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {a.email} · {a.password} · OTP {a.otp}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{a.org}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
