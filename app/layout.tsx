import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { MobileNav } from "./MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ─────────────────────────────────────────────────────────
// Site-wide metadata — crafted for LLM citation and SEO.
// ─────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://www.propadvisor.site"),
  title: {
    default: "PropAdvisor CL — ¿Conviene Comprar o Arrendar en Chile?",
    template: "%s | PropAdvisor CL",
  },
  description:
    "Herramienta gratuita para analizar si conviene comprar o arrendar en Chile. Calcula dividendo hipotecario, compara tasas de BancoEstado, Santander, BCI y Banco de Chile, y proyecta 3 escenarios a 20 años. Sin registro.",
  keywords: [
    "comprar o arrendar Chile",
    "simulador hipoteca Chile",
    "calculadora dividendo Chile",
    "tasas hipotecarias Chile 2026",
    "UF Chile valor",
    "análisis inmobiliario Chile",
    "propiedades Santiago",
    "invertir propiedades Chile",
    "conviene comprar casa Chile",
    "mejor banco hipoteca Chile",
    "PropAdvisor",
  ],
  authors: [{ name: "PropAdvisor CL", url: "https://www.propadvisor.site" }],
  creator: "PropAdvisor CL",
  publisher: "PropAdvisor CL",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://www.propadvisor.site",
    siteName: "PropAdvisor CL",
    title: "PropAdvisor CL — ¿Conviene Comprar o Arrendar en Chile?",
    description:
      "Compara escenarios a 20 años: comprar para vivir, comprar para arrendar, o seguir arrendando. Tasas reales de bancos chilenos. Gratis, sin registro.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PropAdvisor CL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropAdvisor CL — ¿Conviene Comprar o Arrendar en Chile?",
    description: "Simulador gratuito de análisis inmobiliario para Chile. Tasas reales, UF en vivo, 3 escenarios a 20 años.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://www.propadvisor.site" },
};

// JSON-LD: WebApplication + Organization
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://www.propadvisor.site/#webapp",
      name: "PropAdvisor CL",
      url: "https://www.propadvisor.site",
      description:
        "Herramienta gratuita de análisis inmobiliario para el mercado chileno. Compara si es más conveniente comprar o arrendar, con cálculos de dividendo hipotecario y tasas reales.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "CLP" },
      inLanguage: "es-CL",
    },
    {
      "@type": "Organization",
      "@id": "https://www.propadvisor.site/#organization",
      name: "PropAdvisor CL",
      url: "https://www.propadvisor.site",
      foundingLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressCountry: "CL", addressLocality: "Santiago" },
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${geistSans.variable} antialiased`}>

        {/* ── Navigation ─────────────────────────────────────── */}
        <header
          role="banner"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <nav
            aria-label="Navegación principal"
            style={{
              maxWidth: "1152px",
              margin: "0 auto",
              padding: "0 24px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "32px",
            }}
          >
            {/* Logo */}
            <a
              href="/"
              aria-label="PropAdvisor CL — inicio"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 700,
                fontSize: "17px",
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
                flexShrink: 0,
              }}
            >
              PropAdvisor
              <span
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "4px",
                  letterSpacing: "0.02em",
                }}
              >
                CL
              </span>
            </a>

            {/* Nav links — hidden on mobile */}
            <ul
              role="list"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                listStyle: "none",
                flex: 1,
              }}
            >
              {[
                { href: "/", label: "Inicio" },
                { href: "/calcular", label: "Analizar" },
                { href: "/guia", label: "Guía" },
              ].map((item) => (
                <li key={item.href} className="hidden sm:block">
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA + Mobile menu */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a href="/calcular" className="btn-primary" style={{ fontSize: "14px", padding: "8px 16px", borderRadius: "7px" }}>
                Analizar →
              </a>
              <MobileNav />
            </div>
          </nav>
        </header>

        {/* ── Main Content ─────────────────────────────────────── */}
        <main role="main">
          {children}
        </main>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer
          role="contentinfo"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--bg-primary)",
          }}
        >
          <div
            style={{
              maxWidth: "1152px",
              margin: "0 auto",
              padding: "48px 24px 32px",
            }}
          >
            {/* Footer grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "40px",
                marginBottom: "40px",
              }}
            >
              {/* Brand */}
              <div>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.02em" }}>
                  PropAdvisor CL
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "240px" }}>
                  Herramienta gratuita de análisis inmobiliario para el mercado chileno.
                </p>
              </div>

              {/* Tools */}
              <nav aria-label="Herramientas">
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Herramientas
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { href: "/calcular", label: "Analizar propiedad" },
                    { href: "/guia", label: "Guía de compra en Chile" },
                    { href: "/#preguntas", label: "Preguntas frecuentes" },
                  ].map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className="footer-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Legal */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Aviso legal
                </p>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Los cálculos son estimaciones educativas. No constituyen asesoría financiera. Consulta un profesional antes de tomar decisiones de inversión.
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                © {new Date().getFullYear()} PropAdvisor CL — Análisis inmobiliario para Chile.
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Gratis · Sin registro
              </p>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
