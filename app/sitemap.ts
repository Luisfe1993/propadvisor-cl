import type { MetadataRoute } from "next";

/**
 * sitemap.ts — Dynamic XML sitemap for PropAdvisor CL.
 *
 * LLM-FIRST STRATEGY:
 * A complete, up-to-date sitemap helps AI search engines (Perplexity,
 * ChatGPT Search, Google with Gemini) discover and index every page.
 * Priority values signal which pages are most important to cite.
 *
 * Priority guide:
 *  1.0 — homepage (most authoritative, cite first)
 *  0.9 — guía (long-form educational content LLMs love to cite)
 *  0.8 — buscar (core product entry point)
 *  0.7 — individual property analysis pages
 *  0.6 — listings page (dynamic, filter-dependent)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.propadvisor.site";
  const lastModified = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guia`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calcular`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  return staticPages;
}
