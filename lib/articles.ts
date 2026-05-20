// ─── Market blog articles data ──────────────────────────
// Static article metadata. Content lives in /mercado/[slug]/page.tsx.
// Adding a new article = create page.tsx + add entry here + update sitemap.

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  category: "tasas" | "guia" | "mercado";
  tags: string[];
}

export const articles: Article[] = [
  {
    slug: "tasas-hipotecarias-junio-2026",
    title: "Tasas hipotecarias en Chile — Junio 2026",
    description: "Comparación actualizada de tasas hipotecarias de los 8 principales bancos de Chile. Tendencias, análisis y proyección para el segundo semestre.",
    date: "2026-06-01",
    readingTime: "5 min",
    category: "tasas",
    tags: ["tasas hipotecarias", "bancos Chile", "crédito hipotecario"],
  },
  {
    slug: "guia-comprar-primera-vivienda-santiago-2026",
    title: "Guía completa: comprar tu primera vivienda en Santiago 2026",
    description: "Todo lo que necesitas saber para comprar tu primer departamento o casa en Santiago: requisitos, costos, plazos, y errores comunes que evitar.",
    date: "2026-06-01",
    readingTime: "8 min",
    category: "guia",
    tags: ["primera vivienda", "Santiago", "guía compra"],
  },
  {
    slug: "mejores-comunas-invertir-santiago-2026",
    title: "Mejores comunas para invertir en Santiago 2026",
    description: "Análisis de plusvalía, cap rate y rentabilidad por comuna. Descubre dónde conviene comprar para invertir según tu presupuesto.",
    date: "2026-06-01",
    readingTime: "7 min",
    category: "mercado",
    tags: ["inversión inmobiliaria", "comunas Santiago", "plusvalía"],
  },
];
