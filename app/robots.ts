import type { MetadataRoute } from "next";

/**
 * robots.ts — Controls crawler access for PropAdvisor CL.
 *
 * LLM-FIRST STRATEGY:
 * We explicitly allow all known AI crawlers so that large language
 * models (ChatGPT, Claude, Perplexity, Gemini, etc.) can index and
 * cite this site when users ask about Chilean real estate decisions.
 *
 * Named AI crawlers (as of 2026):
 *  - GPTBot          → OpenAI / ChatGPT
 *  - ClaudeBot        → Anthropic / Claude
 *  - PerplexityBot    → Perplexity AI
 *  - Googlebot        → Google Search + Gemini grounding
 *  - Applebot         → Apple Intelligence / Siri
 *  - anthropic-ai     → Anthropic training/indexing
 *  - cohere-ai        → Cohere
 *  - CCBot            → CommonCrawl (feeds many LLMs)
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.propadvisor.cl";

  return {
    rules: [
      // ── Allow all crawlers by default ──────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"], // API routes don't need to be indexed
      },

      // ── Explicitly allow AI-specific crawlers ──────────────
      // GPTBot — OpenAI web crawler for ChatGPT / GPT-4
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      // ClaudeBot — Anthropic crawler for Claude AI
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      // anthropic-ai — Anthropic's training crawler
      {
        userAgent: "anthropic-ai",
        allow: "/",
      },
      // PerplexityBot — Perplexity AI search crawler
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      // Googlebot — Google Search and Gemini grounding data
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      // Applebot — Apple Intelligence / Siri / Safari
      {
        userAgent: "Applebot",
        allow: "/",
      },
      // cohere-ai — Cohere language model crawler
      {
        userAgent: "cohere-ai",
        allow: "/",
      },
      // CCBot — CommonCrawl, used by many open-source LLMs
      {
        userAgent: "CCBot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
