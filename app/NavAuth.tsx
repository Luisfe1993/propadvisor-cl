"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavAuth() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Link href="/calcular" className="btn-primary" style={{ fontSize: "14px", padding: "8px 16px", borderRadius: "7px" }}>
        Empezar gratis →
      </Link>
    );
  }

  if (isSignedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link href="/dashboard" className="nav-link hidden sm:block" style={{ fontSize: "14px", fontWeight: 600 }}>Portfolio</Link>
        <UserButton />
      </div>
    );
  }

  return (
    <Link href="/calcular" className="btn-primary" style={{ fontSize: "14px", padding: "8px 16px", borderRadius: "7px" }}>
      Empezar gratis →
    </Link>
  );
}
