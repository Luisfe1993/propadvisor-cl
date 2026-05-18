"use client";

import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import ToolLayout from "@/components/ToolLayout";

// ─── Quiz data ──────────────────────────────────────────

interface QuizQuestion {
  question: string;
  options: { label: string; points: number; explanation: string }[];
}

const questions: QuizQuestion[] = [
  {
    question: "¿Tienes ahorros equivalentes al 20% o más del precio de la propiedad que quieres?",
    options: [
      { label: "Sí, tengo el 20% o más", points: 3, explanation: "Excelente. Con 20%+ de pie obtienes mejores tasas y aprobación más fácil." },
      { label: "Tengo entre 10% y 20%", points: 2, explanation: "Es posible comprar con 10-20% de pie, pero la tasa será más alta." },
      { label: "Tengo menos del 10%", points: 0, explanation: "La mayoría de los bancos en Chile exigen mínimo 10% de pie." },
    ],
  },
  {
    question: "¿Tu dividendo estimado sería menor al 25% de tu ingreso líquido?",
    options: [
      { label: "Sí, menor al 25%", points: 3, explanation: "Ideal. Tienes margen para imprevistos y ahorro." },
      { label: "Entre 25% y 35%", points: 1, explanation: "Ajustado pero posible. Los bancos pueden aprobar hasta 30%." },
      { label: "Más del 35%", points: 0, explanation: "Riesgoso. Es probable que el banco no apruebe, y si lo hace, quedarás muy ajustado." },
    ],
  },
  {
    question: "¿Tienes un fondo de emergencia de al menos 3 meses de gastos?",
    options: [
      { label: "Sí, 3 meses o más", points: 2, explanation: "Correcto. Nunca compres sin colchón para imprevistos." },
      { label: "Tengo algo pero menos de 3 meses", points: 1, explanation: "Deberías fortalecer tu fondo antes de comprometerte con un dividendo." },
      { label: "No tengo fondo de emergencia", points: 0, explanation: "Es arriesgado. Un imprevisto podría hacerte caer en morosidad." },
    ],
  },
  {
    question: "¿Planeas quedarte en la misma ciudad al menos 5 años?",
    options: [
      { label: "Sí, al menos 5 años", points: 2, explanation: "Comprar conviene a partir de 5+ años. Los costos de transacción se diluyen." },
      { label: "Probablemente sí, no estoy seguro", points: 1, explanation: "Si hay posibilidad de mudarte pronto, evalúa bien. Vender rápido puede significar pérdida." },
      { label: "No, podría mudarme antes", points: 0, explanation: "Arrendar puede ser mejor opción si no tienes estabilidad geográfica." },
    ],
  },
  {
    question: "¿Tienes un empleo estable o ingresos regulares hace más de 1 año?",
    options: [
      { label: "Sí, empleo estable hace más de 2 años", points: 2, explanation: "Los bancos valoran la estabilidad laboral. Más de 2 años es ideal." },
      { label: "Empleo estable entre 1-2 años", points: 1, explanation: "Aceptable para la mayoría de los bancos." },
      { label: "Menos de 1 año o ingresos variables", points: 0, explanation: "Puede complicar la aprobación del crédito. Algunos bancos exigen mínimo 1 año." },
    ],
  },
  {
    question: "¿Tienes deudas actuales (tarjetas, créditos de consumo, auto)?",
    options: [
      { label: "No, estoy libre de deudas", points: 2, explanation: "Perfecto. Tu capacidad de endeudamiento está al máximo." },
      { label: "Sí, pero son menores al 10% de mi ingreso", points: 1, explanation: "Manejable. Los bancos consideran tu carga financiera total." },
      { label: "Sí, son significativas", points: 0, explanation: "Reduce tus deudas primero. Los bancos miran tu carga total, no solo el dividendo." },
    ],
  },
  {
    question: "¿Has revisado tu historial crediticio (no estar en DICOM)?",
    options: [
      { label: "Sí, y estoy limpio", points: 2, explanation: "Excelente. Un historial limpio es requisito para cualquier crédito hipotecario." },
      { label: "No lo he revisado", points: 1, explanation: "Revísalo en equifax.cl antes de postular. Puedes tener deudas olvidadas." },
      { label: "Tengo registros negativos", points: 0, explanation: "Debes limpiar tu historial primero. Estar en DICOM impide obtener crédito hipotecario." },
    ],
  },
  {
    question: "¿Has comparado tasas de al menos 3 bancos diferentes?",
    options: [
      { label: "Sí, ya investigué", points: 1, explanation: "Bien. Una diferencia de 0.5% en la tasa puede significar millones en 20 años." },
      { label: "No, pero planeo hacerlo", points: 1, explanation: "Hazlo. PropAdvisor te ayuda a comparar 8 bancos al instante." },
      { label: "No, iré directo a mi banco", points: 0, explanation: "Error común. Siempre compara. Tu banco no necesariamente ofrece la mejor tasa." },
    ],
  },
];

// ─── Score interpretation ───────────────────────────────

function getVerdict(score: number, maxScore: number) {
  const pct = score / maxScore;
  if (pct >= 0.75) return {
    level: "listo" as const,
    emoji: "🟢",
    title: "¡Estás listo para comprar!",
    description: "Tienes una base financiera sólida. Es buen momento para avanzar con el análisis de propiedades concretas.",
    color: "#16a34a",
    bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    border: "#16a34a",
  };
  if (pct >= 0.5) return {
    level: "casi" as const,
    emoji: "🟡",
    title: "Casi listo — ajusta algunos puntos",
    description: "Vas por buen camino, pero hay áreas que mejorar antes de firmar. Revisa las recomendaciones.",
    color: "#d97706",
    bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
    border: "#d97706",
  };
  return {
    level: "preparar" as const,
    emoji: "🔴",
    title: "Todavía no es el momento",
    description: "Necesitas prepararte más antes de comprar. No te apures — es mejor esperar que endeudarte mal.",
    color: "#dc2626",
    bg: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
    border: "#dc2626",
  };
}

export default function TestCompradorPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [explanations, setExplanations] = useState<string[]>([]);

  useEffect(() => {
    track("tool_started", { tool: "test-comprador" });
  }, []);

  const maxScore = questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.points)), 0);
  const score = answers.reduce((sum, a) => sum + a, 0);
  const verdict = getVerdict(score, maxScore);

  const handleAnswer = (points: number, explanation: string) => {
    const newAnswers = [...answers, points];
    const newExplanations = [...explanations, explanation];
    setAnswers(newAnswers);
    setExplanations(newExplanations);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
      const totalScore = newAnswers.reduce((s, a) => s + a, 0);
      track("tool_completed", { tool: "test-comprador", score: totalScore, maxScore, level: getVerdict(totalScore, maxScore).level });
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setExplanations([]);
    setShowResult(false);
  };

  return (
    <ToolLayout
      slug="test-comprador"
      title="¿Estás listo para comprar?"
      subtitle="8 preguntas rápidas para evaluar si estás preparado financieramente para comprar tu primera propiedad en Chile."
      showInsurance={showResult && verdict.level === "listo"}
      emailCapture={showResult ? { ctaText: "Ver recomendaciones", valueProp: "Recibe recomendaciones personalizadas según tu resultado." } : undefined}
      toolData={showResult ? { score, maxScore, level: verdict.level } : undefined}
      result={showResult ? (
        <div>
          {/* Score card */}
          <div style={{
            background: verdict.bg,
            border: `2px solid ${verdict.border}`,
            borderRadius: "16px",
            padding: "32px 28px",
            textAlign: "center",
            marginBottom: "24px",
          }}>
            <p style={{ fontSize: "48px", marginBottom: "8px" }}>{verdict.emoji}</p>
            <p style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "8px" }}>
              {verdict.title}
            </p>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "20px", maxWidth: "380px", margin: "0 auto 20px" }}>
              {verdict.description}
            </p>

            {/* Score badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.7)", borderRadius: "9999px",
              padding: "8px 20px", fontSize: "18px", fontWeight: 700, color: verdict.color,
            }}>
              {score}/{maxScore} puntos
            </div>
          </div>

          {/* Explanations */}
          <div className="card" style={{ padding: "24px" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "16px" }}>
              Detalle por pregunta
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {questions.map((q, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: "8px", background: answers[i] >= 2 ? "#f0fdf4" : answers[i] >= 1 ? "#fffbeb" : "#fef2f2", border: "1px solid var(--border)" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {i + 1}. {q.question}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {explanations[i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Restart */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleRestart} className="btn-secondary" style={{ fontSize: "14px" }}>
              Repetir test
            </button>
          </div>
        </div>
      ) : undefined}
    >
      {!showResult && (
        <div>
          {/* Progress */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
              <span>Pregunta {currentQ + 1} de {questions.length}</span>
              <span>{Math.round(((currentQ) / questions.length) * 100)}%</span>
            </div>
            <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{
                width: `${(currentQ / questions.length) * 100}%`,
                height: "100%",
                background: "var(--accent)",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }} />
            </div>
          </div>

          {/* Question */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "20px" }}>
              {questions[currentQ].question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.points, opt.explanation)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "16px 20px",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                  }}
                  className="card"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
