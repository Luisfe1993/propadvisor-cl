import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PropAdvisor CL — ¿Conviene Comprar o Arrendar en Chile?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            PropAdvisor
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0d9488",
              backgroundColor: "#ccfbf1",
              padding: "4px 12px",
              borderRadius: "8px",
            }}
          >
            CL
          </div>
        </div>

        {/* Main text */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.3,
            marginBottom: "32px",
          }}
        >
          ¿Comprar o arrendar en Chile?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            marginBottom: "40px",
          }}
        >
          Calcula tu dividendo, compara 8 bancos y proyecta 3 escenarios — gratis
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
          }}
        >
          {[
            { value: "8", label: "bancos" },
            { value: "60+", label: "comunas" },
            { value: "3", label: "escenarios" },
            { value: "UF", label: "tiempo real" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#0d9488",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
