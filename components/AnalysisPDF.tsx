import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

export interface AnalysisPDFProps {
  // Property
  address: string;
  propertyType: string;
  city: string;
  rooms: number;
  baths: number;
  priceCLP: number;
  priceUF: number;
  ufValue: number;
  // Mortgage
  bankName: string;
  interestRate: number;
  downPaymentPct: number;
  downPaymentCLP: number;
  loanTermYears: number;
  // Results
  monthlyPayment: number;
  buyTotal: number;
  rentTotal: number;
  rentMonthlyCLP: number;
  netMonthlyFlow: number;
  rentalYield: number;
  propertyValueAfter20Years: number;
  savings: number;
  generatedAt: string;
}

const TEAL = "#0d9488";
const TEAL_LIGHT = "#f0fdfa";
const GRAY_TEXT = "#374151";
const GRAY_MUTED = "#6b7280";
const GRAY_BORDER = "#e5e7eb";
const GREEN = "#16a34a";
const RED = "#dc2626";
const BG = "#f9fafb";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: GRAY_TEXT,
    backgroundColor: "#ffffff",
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },
  // Header
  header: {
    backgroundColor: TEAL,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  headerSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
    marginTop: 3,
  },
  headerDate: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 9,
    textAlign: "right",
  },
  // Content wrapper
  content: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  // Section
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: TEAL,
    borderBottomStyle: "solid",
  },
  // Property block
  propertyAddress: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: GRAY_TEXT,
    marginBottom: 4,
  },
  propertyMeta: {
    fontSize: 10,
    color: GRAY_MUTED,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 2,
  },
  priceBox: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 6,
    padding: 10,
    flex: 1,
  },
  priceLabel: {
    fontSize: 8,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: GRAY_TEXT,
  },
  priceSub: {
    fontSize: 8,
    color: GRAY_MUTED,
    marginTop: 1,
  },
  // Grid row
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: BG,
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderStyle: "solid",
  },
  cardLabel: {
    fontSize: 8,
    color: GRAY_MUTED,
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cardValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: GRAY_TEXT,
  },
  // Dividend highlight
  dividendBox: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: TEAL,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dividendLabel: {
    fontSize: 9,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dividendSub: {
    fontSize: 8,
    color: GRAY_MUTED,
    marginTop: 2,
  },
  dividendValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
  },
  // Scenarios table
  scenarioRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_BORDER,
    borderBottomStyle: "solid",
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  scenarioRowHighlight: {
    backgroundColor: TEAL_LIGHT,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: TEAL,
    borderStyle: "solid",
    marginBottom: 4,
  },
  scenarioTableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_BORDER,
    borderBottomStyle: "solid",
    marginBottom: 2,
  },
  scenarioLabel: {
    flex: 3,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: GRAY_TEXT,
  },
  scenarioSub: {
    flex: 3,
    fontSize: 8,
    color: GRAY_MUTED,
    marginTop: 1,
  },
  scenarioValue: {
    flex: 2,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  // Recommendation
  recommendationBox: {
    backgroundColor: BG,
    borderRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderStyle: "solid",
    marginBottom: 18,
  },
  recommendationText: {
    fontSize: 10,
    color: GRAY_TEXT,
    lineHeight: 1.6,
  },
  disclaimer: {
    fontSize: 8,
    color: GRAY_MUTED,
    marginTop: 6,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: GRAY_BORDER,
    borderTopStyle: "solid",
  },
  footerText: {
    fontSize: 8,
    color: GRAY_MUTED,
  },
  footerBrand: {
    fontSize: 8,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
  },
});

function fmt(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(Math.round(n));
}

export function AnalysisPDF(props: AnalysisPDFProps) {
  const {
    address, propertyType, city, rooms, baths,
    priceCLP, priceUF, ufValue,
    bankName, interestRate, downPaymentPct, downPaymentCLP, loanTermYears,
    monthlyPayment, buyTotal, rentTotal, rentMonthlyCLP,
    netMonthlyFlow, rentalYield, propertyValueAfter20Years,
    savings, generatedAt,
  } = props;

  const recommendation = savings > 0
    ? `Comprar para vivir es la opción más conveniente a largo plazo. En ${loanTermYears} años ahorrarías aproximadamente ${fmt(Math.abs(savings))} versus seguir arrendando, además de acumular el valor de la propiedad como patrimonio (proyectado en ${fmt(propertyValueAfter20Years)} en 20 años con 7% de apreciación anual).`
    : `Seguir arrendando tiene menor costo directo a ${loanTermYears} años. Sin embargo, al comprar acumulas patrimonio y te proteges de futuros aumentos de arriendo. Considera ajustar el pie o el plazo para mejorar el escenario de compra.`;

  return (
    <Document
      title={`Análisis PropAdvisor — ${address}`}
      author="PropAdvisor CL"
      subject="Análisis financiero inmobiliario"
    >
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>PropAdvisor CL</Text>
            <Text style={styles.headerSub}>Análisis financiero inmobiliario</Text>
          </View>
          <Text style={styles.headerDate}>Generado el {generatedAt}</Text>
        </View>

        <View style={styles.content}>

          {/* Property */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Propiedad</Text>
            <Text style={styles.propertyAddress}>{address}</Text>
            <Text style={styles.propertyMeta}>
              {propertyType} · {city} · {rooms} dormitorios · {baths} baños
            </Text>
            <View style={styles.priceRow}>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Precio CLP</Text>
                <Text style={styles.priceValue}>{fmt(priceCLP)}</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Precio UF</Text>
                <Text style={styles.priceValue}>UF {priceUF.toLocaleString("es-CL", { maximumFractionDigits: 0 })}</Text>
                <Text style={styles.priceSub}>1 UF = {fmt(ufValue)}</Text>
              </View>
            </View>
          </View>

          {/* Mortgage parameters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Parámetros del crédito</Text>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Banco</Text>
                <Text style={styles.cardValue}>{bankName}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Tasa anual fija</Text>
                <Text style={styles.cardValue}>{interestRate.toFixed(2)}%</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Pie ({downPaymentPct}%)</Text>
                <Text style={styles.cardValue}>{fmt(downPaymentCLP)}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Plazo</Text>
                <Text style={styles.cardValue}>{loanTermYears} años</Text>
              </View>
            </View>
          </View>

          {/* Monthly dividend */}
          <View style={styles.dividendBox}>
            <View>
              <Text style={styles.dividendLabel}>Dividendo mensual estimado</Text>
              <Text style={styles.dividendSub}>{bankName} · {interestRate.toFixed(2)}% · {loanTermYears} años · Pie {downPaymentPct}%</Text>
            </View>
            <Text style={styles.dividendValue}>{fmt(monthlyPayment)}</Text>
          </View>

          {/* 3-scenario comparison */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comparación a {loanTermYears} años — 3 escenarios</Text>

            {/* Comprar para vivir */}
            <View style={[styles.scenarioRow, styles.scenarioRowHighlight]}>
              <View style={{ flex: 3 }}>
                <Text style={styles.scenarioLabel}>Comprar para vivir</Text>
                <Text style={styles.scenarioSub}>Dividendo + gastos mensuales, acumulas patrimonio</Text>
              </View>
              <Text style={[styles.scenarioValue, { color: TEAL }]}>{fmt(buyTotal)}</Text>
            </View>

            {/* Seguir arrendando */}
            <View style={styles.scenarioRow}>
              <View style={{ flex: 3 }}>
                <Text style={styles.scenarioLabel}>Seguir arrendando</Text>
                <Text style={styles.scenarioSub}>{fmt(rentMonthlyCLP)}/mes × {loanTermYears * 12} meses</Text>
              </View>
              <Text style={[styles.scenarioValue, { color: GRAY_TEXT }]}>{fmt(rentTotal)}</Text>
            </View>

            {/* Comprar para arrendar */}
            <View style={styles.scenarioRow}>
              <View style={{ flex: 3 }}>
                <Text style={styles.scenarioLabel}>Comprar para arrendar</Text>
                <Text style={styles.scenarioSub}>
                  Flujo neto mensual: {netMonthlyFlow >= 0 ? "+" : ""}{fmt(netMonthlyFlow)} · Rentabilidad bruta: {rentalYield.toFixed(1)}% anual
                </Text>
              </View>
              <Text style={[styles.scenarioValue, { color: netMonthlyFlow >= 0 ? GREEN : RED }]}>
                {netMonthlyFlow >= 0 ? "+" : ""}{fmt(netMonthlyFlow)}/mes
              </Text>
            </View>
          </View>

          {/* Recommendation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análisis de PropAdvisor</Text>
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
              <Text style={styles.disclaimer}>
                Proyección con 7% apreciación anual estimada para el mercado chileno. Cálculo educativo — no incluye plusvalía, impuestos, gastos de escritura ni seguros.
              </Text>
            </View>
          </View>

          {/* 20-year projection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proyección a 20 años</Text>
            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Valor actual</Text>
                <Text style={styles.cardValue}>{fmt(priceCLP)}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Valor proyectado (7% anual)</Text>
                <Text style={[styles.cardValue, { color: GREEN }]}>{fmt(propertyValueAfter20Years)}</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Plusvalía estimada</Text>
                <Text style={[styles.cardValue, { color: GREEN }]}>+{fmt(propertyValueAfter20Years - priceCLP)}</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Cálculo educativo. No incluye impuestos ni gastos de escritura.
          </Text>
          <Text style={styles.footerBrand}>propadvisor.cl</Text>
        </View>

      </Page>
    </Document>
  );
}
