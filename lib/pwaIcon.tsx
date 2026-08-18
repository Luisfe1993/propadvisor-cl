import { ImageResponse } from "next/og";

/** PropAdvisor's teal accent — matches --accent in app/globals.css. */
const TEAL = "#0d9488";

/**
 * Renders the placeholder PWA icon: a teal square with a white "P" monogram.
 * No logo file exists in the repo yet (see LUI-6 non-goals) — swapping in a
 * real logo later needs no code changes beyond replacing these routes.
 *
 * Maskable icons are cropped to a circle/rounded-square by some platforms,
 * so the glyph is kept smaller to stay inside the ~80% safe zone.
 */
export function renderPwaIcon(size: number, { maskable = false }: { maskable?: boolean } = {}) {
  const fontSize = maskable ? Math.round(size * 0.42) : Math.round(size * 0.58);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: TEAL,
        }}
      >
        <span style={{ fontSize, fontWeight: 800, color: "#ffffff", fontFamily: "sans-serif" }}>P</span>
      </div>
    ),
    { width: size, height: size }
  );
}
