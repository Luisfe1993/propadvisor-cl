// ─── Tool data for all 8 mini-tools ─────────────────────
// Shared between server and client components.

export interface ToolInfo {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
}

export const allTools: ToolInfo[] = [
  { slug: "me-alcanza", title: "¿Me alcanza para comprar?", shortTitle: "¿Me alcanza?", description: "Descubre el precio máximo de propiedad que puedes financiar con tu sueldo.", icon: "💰", color: "#059669" },
  { slug: "dividendo", title: "¿Cuánto sería mi dividendo?", shortTitle: "Mi dividendo", description: "Calcula tu dividendo mensual en segundos.", icon: "🏠", color: "#0284c7" },
  { slug: "comprar-o-arrendar", title: "¿Conviene comprar o arrendar?", shortTitle: "¿Comprar o arrendar?", description: "Compara el costo real de comprar vs. arrendar a 20 años.", icon: "⚖️", color: "#7c3aed" },
  { slug: "ahorrar-pie", title: "¿Cuánto necesito ahorrar para el pie?", shortTitle: "Ahorrar pie", description: "Calcula cuántos meses necesitas para juntar el pie.", icon: "🐷", color: "#db2777" },
  { slug: "prepago", title: "¿Me conviene prepagar mi crédito?", shortTitle: "Prepago", description: "Descubre cuánto ahorras prepagando tu hipoteca.", icon: "📊", color: "#ea580c" },
  { slug: "presupuesto-vivienda", title: "¿Cuánto de mi sueldo se va en vivienda?", shortTitle: "Presupuesto", description: "Revisa si tu gasto en vivienda es saludable.", icon: "📋", color: "#0891b2" },
  { slug: "plan-compra", title: "Mi plan para comprar", shortTitle: "Plan compra", description: "Arma tu plan paso a paso para comprar tu propiedad.", icon: "🗓️", color: "#4f46e5" },
  { slug: "test-comprador", title: "¿Estás listo para comprar?", shortTitle: "Test comprador", description: "Descubre qué tan preparado estás con un test rápido.", icon: "✅", color: "#16a34a" },
];
