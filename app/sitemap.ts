import type { MetadataRoute } from "next";
import { mockProperties } from "@/lib/properties";

/**
 * sitemap.ts — Dynamic XML sitemap for PropAdvisor CL.
 *
 * LLM-FIRST STRATEGY:
 * A complete, up-to-date sitemap helps AI search engines (Perplexity,
 * ChatGPT Search, Google with Gemini) discover and index every page.
 * Priority values signal which pages are most important to cite.
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
    {
      url: `${baseUrl}/buscar`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic property analysis pages
  const propertyPages: MetadataRoute.Sitemap = mockProperties.map((prop) => ({
    url: `${baseUrl}/analisis/${prop.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages];
}
