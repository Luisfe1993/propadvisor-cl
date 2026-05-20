import type { Metadata } from "next";
import Link from "next/link";
import RateAlertSignup from "@/components/RateAlertSignup";

export const metadata: Metadata = {
  title: "Guía completa: comprar tu primera vivienda en Santiago 2026 | PropAdvisor CL",
  description: "Todo lo que necesitas saber para comprar tu primer departamento en Santiago: requisitos bancarios, costos ocultos, plazos, errores comunes y paso a paso completo.",
  keywords: ["comprar primera vivienda Santiago 2026", "guía comprar departamento Chile", "requisitos crédito hipotecario Chile", "primer departamento Santiago"],
  alternates: { canonical: "https://www.propadvisor.site/mercado/guia-comprar-primera-vivienda-santiago-2026" },
};

const wrap: React.CSSProperties = { maxWidth: "720px", margin: "0 auto", padding: "0 24px" };
const h2Sx: React.CSSProperties = { fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginTop: "40px", marginBottom: "12px" };
const pSx: React.CSSProperties = { fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "16px" };

export default function GuiaCompraPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <article style={{ ...wrap, paddingTop: "64px", paddingBottom: "96px" }}>

        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
          <Link href="/mercado" style={{ color: "var(--accent)", textDecoration: "none" }}>← Mercado</Link>
        </div>

        <span className="badge badge-teal" style={{ marginBottom: "12px" }}>Guía · 8 min lectura</span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "12px" }}>
          Guía completa: comprar tu primera vivienda en Santiago 2026
        </h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "32px" }}>
          El paso a paso para ir de &quot;quiero comprar&quot; a &quot;tengo las llaves&quot;. Sin jerga financiera, con números reales.
        </p>

        {/* Step 1 */}
        <h2 style={h2Sx}>1. Evalúa tu situación financiera</h2>
        <p style={pSx}>
          Antes de buscar propiedades, necesitas saber cuánto puedes financiar. Los bancos chilenos evalúan tres cosas principales:
        </p>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Ingreso líquido:</strong> Tu sueldo después de impuestos y descuentos legales.</li>
          <li><strong>Carga financiera:</strong> Cuánto del ingreso ya va a deudas (tarjetas, auto, consumo). Ideal: menor al 25%.</li>
          <li><strong>Pie disponible:</strong> Mínimo 10% (BancoEstado) a 20% (mayoría de bancos privados).</li>
        </ul>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            💡 <strong>Tip:</strong> Usa nuestra <Link href="/herramientas/me-alcanza" style={{ color: "var(--accent)" }}>calculadora &quot;¿Me alcanza?&quot;</Link> para ver el precio máximo que financias con tu sueldo.
          </p>
        </div>

        {/* Step 2 */}
        <h2 style={h2Sx}>2. Ahorra el pie</h2>
        <p style={pSx}>
          El pie es generalmente el mayor obstáculo. Para un departamento de UF 3.000 (≈$111M), necesitas entre UF 300 y UF 600 de pie ($11M-$22M). Las mejores opciones para ahorrar:
        </p>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Depósitos a plazo:</strong> Bajo riesgo, 4-6% anual. Ideal si compras en menos de 1 año.</li>
          <li><strong>Fondos mutuos renta fija:</strong> 5-7% anual. Buen balance riesgo/retorno para 1-2 años.</li>
          <li><strong>APV (Ahorro Previsional Voluntario):</strong> Beneficio tributario del 15% sobre el ahorro (régimen A). Excelente si tu tasa marginal de impuesto es alta.</li>
        </ul>

        {/* Step 3 */}
        <h2 style={h2Sx}>3. Obtén preaprobación</h2>
        <p style={pSx}>
          La preaprobación hipotecaria es gratuita y te da una carta que indica cuánto te presta el banco. Pide preaprobación en al menos 3 bancos para comparar. Necesitas:
        </p>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li>Últimas 3-6 liquidaciones de sueldo</li>
          <li>Certificado de AFP (últimos 12 meses)</li>
          <li>Declaración de impuestos (si eres independiente)</li>
          <li>Certificado de deudas SBIF (gratis en CMF)</li>
        </ul>

        {/* Step 4 */}
        <h2 style={h2Sx}>4. Busca y analiza propiedades</h2>
        <p style={pSx}>
          No te enamores de la primera propiedad. Analiza al menos 5-10 opciones antes de decidir. Factores clave:
        </p>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Ubicación:</strong> Cercana a metro/trabajo, plusvalía histórica de la comuna.</li>
          <li><strong>Gastos comunes:</strong> Pueden sumar $80.000-$200.000/mes en edificios con amenities.</li>
          <li><strong>Orientación:</strong> Norte es más luminosa y abriga más en invierno.</li>
          <li><strong>Estado legal:</strong> Verificar que no tenga hipotecas, embargos o litigios pendientes.</li>
        </ul>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            💡 <strong>Tip:</strong> Usa nuestro <Link href="/calcular" style={{ color: "var(--accent)" }}>análisis completo</Link> para comparar si una propiedad conviene como inversión vs. compra para vivir.
          </p>
        </div>

        {/* Step 5 */}
        <h2 style={h2Sx}>5. Costos que no te dicen</h2>
        <p style={pSx}>
          Además del pie, prepara entre 2% y 4% adicional del precio para:
        </p>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Gastos operacionales:</strong> 0.5-1% del crédito (comisión del banco)</li>
          <li><strong>Estudio de títulos:</strong> $200.000-$400.000 (abogado verifica la propiedad)</li>
          <li><strong>Tasación:</strong> $150.000-$300.000 (el banco tasa el inmueble)</li>
          <li><strong>Notaría e inscripción CBR:</strong> $500.000-$1.000.000</li>
          <li><strong>Impuesto de timbres:</strong> 0.2% del monto del crédito</li>
          <li><strong>Seguros obligatorios:</strong> Desgravamen + incendio (incluidos en el dividendo)</li>
        </ul>

        {/* Step 6 */}
        <h2 style={h2Sx}>6. Cierra el negocio</h2>
        <p style={pSx}>
          El proceso desde la oferta aceptada hasta tener las llaves toma 45-90 días:
        </p>
        <ol style={{ ...pSx, paddingLeft: "20px" }}>
          <li>Firma de promesa de compraventa (+ arras: 5-10% del precio)</li>
          <li>Gestión del crédito hipotecario con el banco elegido</li>
          <li>Estudio de títulos por el abogado del banco</li>
          <li>Tasación del inmueble</li>
          <li>Aprobación final del crédito</li>
          <li>Escritura ante notario</li>
          <li>Inscripción en el Conservador de Bienes Raíces</li>
          <li>Entrega de llaves</li>
        </ol>

        {/* Common mistakes */}
        <h2 style={h2Sx}>❌ Errores comunes a evitar</h2>
        <ul style={{ ...pSx, paddingLeft: "20px" }}>
          <li><strong>Cotizar en un solo banco:</strong> La diferencia entre tasas puede ser de $50.000+/mes.</li>
          <li><strong>No considerar gastos comunes:</strong> Un departamento &quot;barato&quot; con GGCC de $180.000 sale caro.</li>
          <li><strong>Comprar con pie mínimo sin reserva:</strong> Si te quedas sin colchón financiero, cualquier emergencia te pone en riesgo.</li>
          <li><strong>Ignorar la plusvalía:</strong> No todas las comunas crecen igual. Investiga antes de comprar.</li>
        </ul>

        {/* Newsletter */}
        <div style={{ marginTop: "40px" }}>
          <RateAlertSignup />
        </div>

        {/* Related */}
        <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Artículos relacionados</p>
          <Link href="/mercado/tasas-hipotecarias-junio-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block", marginBottom: "8px" }}>
            Tasas hipotecarias en Chile — Junio 2026 →
          </Link>
          <Link href="/mercado/mejores-comunas-invertir-santiago-2026" style={{ fontSize: "14px", color: "var(--accent)", textDecoration: "none", display: "block" }}>
            Mejores comunas para invertir en Santiago 2026 →
          </Link>
        </div>
      </article>
    </div>
  );
}
