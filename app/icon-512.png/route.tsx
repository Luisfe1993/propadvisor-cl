import { renderPwaIcon } from "@/lib/pwaIcon";

export const runtime = "edge";

export function GET() {
  return renderPwaIcon(512);
}
