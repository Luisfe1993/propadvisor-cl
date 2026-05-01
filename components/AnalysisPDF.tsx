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

  const totalRentalIncome = rentMonthlyCLP * loanTermYears * 12 * 1.16; // ~3%/yr growth approximation
  const investNetWealth = propertyValueAfter20Years + totalRentalIncome - buyTotal;
  const pieAt6Pct = downPaymentCLP * Math.pow(1.06, loanTermYears);
  const buyNetW = propertyValueAfter20Years - buyTotal;
  const rentNetW = pieAt6Pct - rentTotal;
  const allWealth = [
    { s: "buy", w: buyNetW },
    { s: "rent", w: rentNetW },
    { s: "invest", w: investNetWealth },
  ];
  allWealth.sort((a, b) => b.w - a.w);
  const winner = allWealth[0].s;
  const winnerLabel = winner === "invest" ? "Comprar para arrendar" : winner === "buy" ? "Comprar para vivir" : "Arrendar + invertir el pie";

  const recommendation = `${winnerLabel} es la opción más rentable a ${loanTermYears} años. `
    + (winner === "invest"
      ? `Patrimonio neto como inversión: ${fmt(investNetWealth)}. ${netMonthlyFlow >= 0 ? `Cash flow positivo de ${fmt(netMonthlyFlow)}/mes.` : `Requiere subsidio de ${fmt(Math.abs(netMonthlyFlow))}/mes, compensado por plusvalía.`}`
      : winner === "buy"
      ? `Patrimonio neto: ${fmt(buyNetW)}. Propiedad proyectada en ${fmt(propertyValueAfter20Years)} con 7% apreciación anual.`
      : `Patrimonio neto: ${fmt(rentNetW)}. Tu pie invertido al 6% anual crece a ${fmt(pieAt6Pct)}.`
    );

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
            <Text style={styles.sectionTitle}>Patrimonio neto a {loanTermYears} años — 3 escenarios</Text>

            {/* Headers */}
            <View style={styles.scenarioTableHeader}>
              <Text style={{ flex: 2, fontSize: 8, color: GRAY_MUTED, fontFamily: "Helvetica-Bold" }}>Escenario</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GRAY_MUTED, fontFamily: "Helvetica-Bold", textAlign: "right" }}>Gastas</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GRAY_MUTED, fontFamily: "Helvetica-Bold", textAlign: "right" }}>Ganas</Text>
              <Text style={{ flex: 1, fontSize: 8, color: GRAY_MUTED, fontFamily: "Helvetica-Bold", textAlign: "right" }}>Patrimonio</Text>
            </View>

            {/* Comprar para vivir */}
            <View style={[styles.scenarioRow, winner === "buy" ? styles.scenarioRowHighlight : {}]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.scenarioLabel}>{winner === "buy" ? "⭐ " : ""}Comprar para vivir</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: RED }}>{fmt(buyTotal)}</Text>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: GREEN }}>{fmt(propertyValueAfter20Years)}</Text>
              <Text style={[styles.scenarioValue, { flex: 1, color: buyNetW >= 0 ? GREEN : RED }]}>{buyNetW >= 0 ? "+" : ""}{fmt(buyNetW)}</Text>
            </View>

            {/* Arrendar + invertir */}
            <View style={[styles.scenarioRow, winner === "rent" ? styles.scenarioRowHighlight : {}]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.scenarioLabel}>{winner === "rent" ? "⭐ " : ""}Arrendar + invertir pie</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: RED }}>{fmt(rentTotal)}</Text>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: GREEN }}>{fmt(pieAt6Pct)}</Text>
              <Text style={[styles.scenarioValue, { flex: 1, color: rentNetW >= 0 ? GREEN : RED }]}>{rentNetW >= 0 ? "+" : ""}{fmt(rentNetW)}</Text>
            </View>

            {/* Comprar para arrendar */}
            <View style={[styles.scenarioRow, winner === "invest" ? styles.scenarioRowHighlight : {}]}>
              <View style={{ flex: 2 }}>
                <Text style={styles.scenarioLabel}>{winner === "invest" ? "⭐ " : ""}Comprar para arrendar</Text>
                <Text style={styles.scenarioSub}>
                  Flujo: {netMonthlyFlow >= 0 ? "+" : ""}{fmt(netMonthlyFlow)}/mes · Cap rate: {rentalYield.toFixed(1)}%
                </Text>
              </View>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: RED }}>{fmt(buyTotal)}</Text>
              <Text style={{ flex: 1, fontSize: 10, textAlign: "right", color: GREEN }}>{fmt(propertyValueAfter20Years + totalRentalIncome)}</Text>
              <Text style={[styles.scenarioValue, { flex: 1, color: investNetWealth >= 0 ? GREEN : RED }]}>{investNetWealth >= 0 ? "+" : ""}{fmt(investNetWealth)}</Text>
            </View>
          </View>

          {/* Recommendation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análisis de PropAdvisor</Text>
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
              <Text style={styles.disclaimer}>
                Supuestos: plusvalía 7%/año · arriendo sube 3%/año · fondo alternativo 6%/año · no incluye impuestos, comisiones de venta ni escritura.
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
          <Text style={styles.footerBrand}>propadvisor.site</Text>
        </View>

      </Page>
    </Document>
  );
}
