import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { ROLE_LABEL, type Role } from "@/lib/demo-data";
import { Button, Panel } from "./ui-kit";

/**
 * Client-side authorization layer of the demo.
 * Layer 1 authentication (session + MFA), layer 2 authorization (role check).
 */
export function Guard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { session, ready } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready) return <Screen title="Verifying session…" body="Zero Trust check in progress." />;

  if (!session)
    return (
      <Screen title="Authentication required" body={`No verified session for ${pathname}. Sign in with MFA to continue.`}>
        <Link to="/login">
          <Button>Go to secure login</Button>
        </Link>
      </Screen>
    );

  if (!allow.includes(session.role))
    return (
      <Screen
        title="403 — Access denied"
        body={`Your role (${ROLE_LABEL[session.role]}) is not authorized for this application domain. This denial is recorded in the audit log.`}
      >
        <Link to="/">
          <Button variant="outline">Back to overview</Button>
        </Link>
      </Screen>
    );

  return <>{children}</>;
}

function Screen({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Panel className="max-w-md text-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        {children ? <div className="mt-5 flex justify-center">{children}</div> : null}
      </Panel>
    </div>
  );
}
