"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export function NavAuth() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <a href="/calcular" className="btn-primary" style={{ fontSize: "14px", padding: "8px 16px", borderRadius: "7px" }}>
        Analizar →
      </a>
    );
  }

  if (isSignedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <a href="/pricing" className="nav-link hidden sm:block" style={{ fontSize: "13px", fontWeight: 600 }}>Pro</a>
        <a href="/dashboard" className="nav-link hidden sm:block" style={{ fontSize: "14px", fontWeight: 600 }}>Portfolio</a>
        <UserButton />
      </div>
    );
  }

  return (
    <a href="/calcular" className="btn-primary" style={{ fontSize: "14px", padding: "8px 16px", borderRadius: "7px" }}>
      Analizar →
    </a>
  );
}
