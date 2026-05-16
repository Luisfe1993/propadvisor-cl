"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { allTools } from "@/lib/toolData";
import type { ToolInfo } from "@/lib/toolData";

// ─── Tool data re-exported for convenience ──────────────

export type { ToolInfo };

// ─── Email Capture (lightweight, non-blocking) ──────────

interface EmailCaptureProps {
  toolSlug: string;
  ctaText: string;
  valueProp: string;
}

function ToolEmailCapture({ toolSlug, ctaText, valueProp }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/send-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `tool_${toolSlug}`, wantsBrokerContact: false }),
      });
      if (!res.ok) throw new Error();
      track("tool_email_captured", { tool: toolSlug });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div style={{ background: "var(--accent-light)", border: "1px solid var(--accent)", borderRadius: "12px", padding: "20px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--accent-dark)" }}>✓ Enviado a tu correo</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px" }}>{valueProp}</p>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-input"
          style={{ flex: 1 }}
          required
        />
        <button type="submit" className="btn-primary" disabled={status === "sending"} style={{ flexShrink: 0, padding: "10px 20px", fontSize: "14px" }}>
          {status === "sending" ? "..." : ctaText}
        </button>
      </div>
      {status === "error" && <p style={{ fontSize: "13px", color: "#dc2626", marginTop: "6px" }}>Error. Intenta de nuevo.</p>}
    </form>
  );
}

// ─── Insurance CTA ──────────────────────────────────────

function InsuranceCTA() {
  return (
    <div style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "24px", flexShrink: 0 }}>🛡️</span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#166534", marginBottom: "4px" }}>Seguro hipotecario obligatorio</p>
          <p style={{ fontSize: "13px", color: "#15803d", lineHeight: 1.5, marginBottom: "10px" }}>
            Todo crédito hipotecario en Chile requiere seguro de desgravamen e incendio. Cotiza antes de firmar.
          </p>
          <button
            onClick={() => track("insurance_cta_clicked", { source: "tool" })}
            className="btn-primary"
            style={{ fontSize: "13px", padding: "8px 16px", background: "#16a34a" }}
          >
            Cotizar seguro →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Related Tools ──────────────────────────────────────

function RelatedTools({ currentSlug }: { currentSlug: string }) {
  const related = allTools.filter(t => t.slug !== currentSlug).slice(0, 3);
  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", marginBottom: "16px" }}>
        Otras herramientas
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        {related.map(tool => (
          <Link
            key={tool.slug}
            href={`/herramientas/${tool.slug}`}
            style={{ display: "block", padding: "16px 20px", borderRadius: "12px", border: "1px solid var(--border)", background: "white", textDecoration: "none", transition: "border-color 0.15s, box-shadow 0.15s" }}
            className="card"
          >
            <span style={{ fontSize: "20px", marginBottom: "8px", display: "block" }}>{tool.icon}</span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{tool.shortTitle}</p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Full Analysis CTA ──────────────────────────────────

function FullAnalysisCTA() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
      border: "1px solid #99f6e4",
      borderRadius: "16px",
      padding: "28px 24px",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
        ¿Ya tienes una propiedad en mente?
      </p>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "16px", maxWidth: "380px", margin: "0 auto 16px" }}>
        Haz un análisis completo gratuito: dividendo por banco, 3 escenarios a 20 años, y PDF profesional.
      </p>
      <Link href="/calcular" className="btn-primary" style={{ padding: "12px 28px", fontSize: "15px" }}>
        Analizar una propiedad →
      </Link>
    </div>
  );
}

// ─── Main ToolLayout ────────────────────────────────────

interface ToolLayoutProps {
  slug: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Result section — shown after calculation */
  result?: ReactNode;
  /** Explanation — "¿Qué significa esto?" */
  explanation?: ReactNode;
  /** Show insurance CTA */
  showInsurance?: boolean;
  /** Email capture config */
  emailCapture?: { ctaText: string; valueProp: string };
  /** Related tool slugs to prioritize (defaults to auto) */
  relatedSlugs?: string[];
}

export default function ToolLayout({
  slug,
  title,
  subtitle,
  children,
  result,
  explanation,
  showInsurance = false,
  emailCapture,
}: ToolLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ marginBottom: "32px" }}>
          <Link
            href="/herramientas"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            Herramientas
          </Link>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <span className="badge badge-teal" style={{ marginBottom: "12px" }}>Herramienta gratuita</span>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "10px", lineHeight: 1.15 }}>
            {title}
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* Input form (tool-specific) */}
        <div style={{ marginBottom: "32px" }}>
          {children}
        </div>

        {/* Result */}
        {result && (
          <div style={{ marginBottom: "32px" }}>
            {result}
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div style={{ marginBottom: "32px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", marginBottom: "10px" }}>
              ¿Qué significa esto?
            </p>
            {explanation}
          </div>
        )}

        {/* Email capture */}
        {emailCapture && (
          <div style={{ marginBottom: "24px" }}>
            <ToolEmailCapture toolSlug={slug} ctaText={emailCapture.ctaText} valueProp={emailCapture.valueProp} />
          </div>
        )}

        {/* Insurance CTA */}
        {showInsurance && (
          <div style={{ marginBottom: "24px" }}>
            <InsuranceCTA />
          </div>
        )}

        {/* Full analysis CTA */}
        <div style={{ marginBottom: "32px" }}>
          <FullAnalysisCTA />
        </div>

        {/* Related tools */}
        <RelatedTools currentSlug={slug} />
      </div>
    </div>
  );
}
