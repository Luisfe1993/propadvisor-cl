"use client";

import { useState, useEffect } from "react";

/**
 * MarketIndicators — Real-time Chilean economic & real estate data strip.
 *
 * Pulls from:
 *   /api/indicadores (mindicador.cl) — UF, TPM, IPC, dólar, desempleo
 *   /api/ipv (FRED / Banco Central) — property price index + appreciation
 *
 * Usage: <MarketIndicators /> anywhere in the app.
 */

interface Indicator {
  label: string;
  value: string;
  sublabel?: string;
  emoji: string;
}

interface IPVData {
  latest: { value: number; date: string };
  appreciation: {
    annual1y: number;
    annual5y: number;
    annual10y: number;
  };
  source: string;
  series: { date: string; value: number }[];
}

interface IndicadoresData {
  uf: { valor: number };
  dolar: { valor: number };
  ipc: { valor: number };
  tpm: { valor: number };
  utm: { valor: number };
  tasaDesempleo: { valor: number };
}

export default function MarketIndicators({ compact = false }: { compact?: boolean }) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [ipv, setIpv] = useState<IPVData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/indicadores").then((r) => r.json()).catch(() => null),
      fetch("/api/ipv").then((r) => r.json()).catch(() => null),
    ]).then(([ind, ipvData]: [IndicadoresData | null, IPVData | null]) => {
      const items: Indicator[] = [];

      if (ind) {
        items.push({
          emoji: "📊",
          label: "UF",
          value: `$${ind.uf.valor.toLocaleString("es-CL")}`,
        });
        items.push({
          emoji: "🏛️",
          label: "TPM",
          value: `${ind.tpm.valor}%`,
          sublabel: "Banco Central",
        });
        items.push({
          emoji: "📈",
          label: "IPC",
          value: `${ind.ipc.valor > 0 ? "+" : ""}${ind.ipc.valor}%`,
          sublabel: "mensual",
        });
        items.push({
          emoji: "💵",
          label: "Dólar",
          value: `$${ind.dolar.valor.toLocaleString("es-CL")}`,
        });
        if (!compact) {
          items.push({
            emoji: "👷",
            label: "Desempleo",
            value: `${ind.tasaDesempleo.valor}%`,
            sublabel: "INE",
          });
        }
      }

      if (ipvData?.appreciation) {
        items.push({
          emoji: "🏠",
          label: "Plusvalía 1 año",
          value: `${ipvData.appreciation.annual1y > 0 ? "+" : ""}${ipvData.appreciation.annual1y.toFixed(1)}%`,
          sublabel: "real, 8 ciudades",
        });
        if (!compact) {
          items.push({
            emoji: "📉",
            label: "Plusvalía 5 años",
            value: `${ipvData.appreciation.annual5y > 0 ? "+" : ""}${ipvData.appreciation.annual5y.toFixed(1)}%/año`,
            sublabel: "promedio anualizado",
          });
        }
      }

      setIndicators(items);
      setIpv(ipvData);
      setLoading(false);
    });
  }, [compact]);

  if (loading || indicators.length === 0) return null;

  return (
    <div style={{ marginBottom: compact ? "16px" : "32px" }}>
      {/* Indicators strip */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          padding: "4px 0",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          flexWrap: compact ? "wrap" : undefined,
        }}
      >
        {indicators.map((ind, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "13px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span>{ind.emoji}</span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{ind.label}</span>
            <span style={{ fontWeight: 700, color: "var(--accent)" }}>{ind.value}</span>
            {ind.sublabel && (
              <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{ind.sublabel}</span>
            )}
          </div>
        ))}
      </div>

      {/* IPV Chart — only in full mode */}
      {!compact && ipv?.series && ipv.series.length > 8 && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            📊 Índice de Precios de Vivienda (Chile, 8 ciudades principales)
          </h3>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            Base 2010 = 100 · Fuente: {ipv.source === "fred" ? "FRED / BIS" : ipv.source === "bcentral" ? "Banco Central de Chile" : "datos históricos"} · Actualización trimestral
          </p>

          {/* Simple SVG chart */}
          <IPVChart series={ipv.series} />

          {/* Summary stats */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "16px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Índice actual</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                {ipv.latest.value.toFixed(1)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Plusvalía real 1 año</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: ipv.appreciation.annual1y > 0 ? "#059669" : "#dc2626" }}>
                {ipv.appreciation.annual1y > 0 ? "+" : ""}{ipv.appreciation.annual1y.toFixed(1)}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Promedio 5 años</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: ipv.appreciation.annual5y > 0 ? "#059669" : "#dc2626" }}>
                {ipv.appreciation.annual5y > 0 ? "+" : ""}{ipv.appreciation.annual5y.toFixed(1)}%/año
              </p>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Promedio 10 años</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: ipv.appreciation.annual10y > 0 ? "#059669" : "#dc2626" }}>
                {ipv.appreciation.annual10y > 0 ? "+" : ""}{ipv.appreciation.annual10y.toFixed(1)}%/año
              </p>
            </div>
          </div>
        </div>
      )}

      <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px", textAlign: "right" }}>
        Datos en tiempo real · Fuente: mindicador.cl, Banco Central, FRED/BIS
      </p>
    </div>
  );
}

// ── Simple SVG Line Chart ────────────────────────────────
function IPVChart({ series }: { series: { date: string; value: number }[] }) {
  const W = 700;
  const H = 180;
  const PAD = { top: 10, right: 10, bottom: 30, left: 40 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const values = series.map((s) => s.value);
  const minVal = Math.floor(Math.min(...values) / 10) * 10;
  const maxVal = Math.ceil(Math.max(...values) / 10) * 10;
  const range = maxVal - minVal || 1;

  const points = series.map((s, i) => {
    const x = PAD.left + (i / (series.length - 1)) * iW;
    const y = PAD.top + iH - ((s.value - minVal) / range) * iH;
    return { x, y, ...s };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD.top + iH} L ${points[0].x} ${PAD.top + iH} Z`;

  // Y-axis labels
  const yLabels = [minVal, minVal + range / 2, maxVal];

  // X-axis labels (every ~2 years)
  const step = Math.max(1, Math.floor(series.length / 5));
  const xLabels = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", maxHeight: "200px" }}>
      {/* Grid lines */}
      {yLabels.map((v) => {
        const y = PAD.top + iH - ((v - minVal) / range) * iH;
        return (
          <g key={v}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth="0.5" />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="rgba(13,148,136,0.1)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Latest point */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="#0d9488" />

      {/* X-axis labels */}
      {xLabels.map((s) => {
        const idx = series.indexOf(s);
        const x = PAD.left + (idx / (series.length - 1)) * iW;
        const year = s.date.substring(0, 4);
        return (
          <text key={s.date} x={x} y={H - 5} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
            {year}
          </text>
        );
      })}
    </svg>
  );
}
