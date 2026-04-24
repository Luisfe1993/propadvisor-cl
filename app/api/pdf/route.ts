export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { AnalysisPDF, type AnalysisPDFProps } from "@/components/AnalysisPDF";

export async function POST(req: NextRequest) {
  try {
    const props = (await req.json()) as AnalysisPDFProps;

    const pdfBuffer = await renderToBuffer(
      createElement(AnalysisPDF, props) as Parameters<typeof renderToBuffer>[0]
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="analisis-propadvisor.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Error al generar el PDF" },
      { status: 500 }
    );
  }
}
