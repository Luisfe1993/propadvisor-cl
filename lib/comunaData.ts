/**
 * Comuna-level real estate data for all major Chilean cities.
 * Sources: CCHC quarterly reports, SII fiscal appraisals, Banco Central IPV.
 * Rates are conservative estimates based on 2020-2026 historical data.
 */

export interface ComunaInfo {
  label: string;
  appreciation: number;  // annual appreciation rate (e.g. 0.07 = 7%)
  capRate: number;       // average gross rental yield (e.g. 0.05 = 5%)
  avgPricePerM2UF: number; // average UF per m²
  risk: "low" | "medium" | "high";
  metro: boolean;        // has metro/public transport nearby
  note: string;          // one-line insight
}

export interface CityInfo {
  label: string;
  region: string;
  comunas: Record<string, ComunaInfo>;
  defaultAppreciation: number; // fallback if "Otra" is selected
  defaultCapRate: number;
}

export const cityData: Record<string, CityInfo> = {
  // ═══════════════════════════════════════════════════════
  // REGIÓN METROPOLITANA
  // ═══════════════════════════════════════════════════════
  santiago: {
    label: "Santiago",
    region: "Metropolitana",
    defaultAppreciation: 0.06,
    defaultCapRate: 0.048,
    comunas: {
      providencia: { label: "Providencia", appreciation: 0.07, capRate: 0.045, avgPricePerM2UF: 62, risk: "low", metro: true, note: "Alta demanda, oferta limitada, conectividad premium" },
      las_condes: { label: "Las Condes", appreciation: 0.06, capRate: 0.04, avgPricePerM2UF: 72, risk: "low", metro: true, note: "Mercado maduro, plusvalía estable, baja volatilidad" },
      nunoa: { label: "Ñuñoa", appreciation: 0.08, capRate: 0.052, avgPricePerM2UF: 52, risk: "low", metro: true, note: "Gentrificación activa, expansión de metro, alta demanda" },
      vitacura: { label: "Vitacura", appreciation: 0.055, capRate: 0.035, avgPricePerM2UF: 85, risk: "low", metro: false, note: "Segmento premium, crecimiento moderado, baja rentabilidad" },
      lo_barnechea: { label: "Lo Barnechea", appreciation: 0.05, capRate: 0.03, avgPricePerM2UF: 75, risk: "low", metro: false, note: "Casas de alto valor, plusvalía moderada" },
      la_reina: { label: "La Reina", appreciation: 0.065, capRate: 0.042, avgPricePerM2UF: 55, risk: "low", metro: false, note: "Zona residencial consolidada, buena plusvalía" },
      macul: { label: "Macul", appreciation: 0.07, capRate: 0.055, avgPricePerM2UF: 42, risk: "medium", metro: true, note: "Corredor universitario, alta demanda arriendo estudiantil" },
      san_miguel: { label: "San Miguel", appreciation: 0.075, capRate: 0.058, avgPricePerM2UF: 45, risk: "medium", metro: true, note: "Emergente, buena conectividad, alta rentabilidad" },
      la_florida: { label: "La Florida", appreciation: 0.06, capRate: 0.05, avgPricePerM2UF: 38, risk: "medium", metro: true, note: "Gran mercado, metro línea 4, variable por sector" },
      penalolen: { label: "Peñalolén", appreciation: 0.065, capRate: 0.048, avgPricePerM2UF: 40, risk: "medium", metro: false, note: "Crecimiento sostenido, proyectos inmobiliarios activos" },
      santiago_centro: { label: "Santiago Centro", appreciation: 0.04, capRate: 0.06, avgPricePerM2UF: 40, risk: "high", metro: true, note: "Alta rentabilidad, sobreoferta de studios, plusvalía baja" },
      barrio_italia: { label: "Barrio Italia", appreciation: 0.08, capRate: 0.055, avgPricePerM2UF: 48, risk: "medium", metro: true, note: "Zona trendy en alza, alta demanda joven" },
      independencia: { label: "Independencia", appreciation: 0.065, capRate: 0.058, avgPricePerM2UF: 35, risk: "medium", metro: true, note: "Buena rentabilidad, cercanía a hospitales y universidades" },
      maipu: { label: "Maipú", appreciation: 0.05, capRate: 0.052, avgPricePerM2UF: 32, risk: "medium", metro: true, note: "Gran comuna, oferta abundante, crecimiento moderado" },
      puente_alto: { label: "Puente Alto", appreciation: 0.04, capRate: 0.055, avgPricePerM2UF: 25, risk: "high", metro: true, note: "Precios accesibles, plusvalía limitada, alta rotación" },
      la_cisterna: { label: "La Cisterna", appreciation: 0.06, capRate: 0.054, avgPricePerM2UF: 36, risk: "medium", metro: true, note: "Conectividad metro, precios moderados" },
      san_bernardo: { label: "San Bernardo", appreciation: 0.045, capRate: 0.055, avgPricePerM2UF: 22, risk: "high", metro: true, note: "Precios bajos, metro línea 2, plusvalía limitada" },
      huechuraba: { label: "Huechuraba", appreciation: 0.06, capRate: 0.048, avgPricePerM2UF: 38, risk: "medium", metro: false, note: "Zona empresarial creciente, desarrollo mixto" },
      quilicura: { label: "Quilicura", appreciation: 0.05, capRate: 0.052, avgPricePerM2UF: 28, risk: "medium", metro: false, note: "Zona industrial en transición, nuevos proyectos" },
      estacion_central: { label: "Estación Central", appreciation: 0.055, capRate: 0.06, avgPricePerM2UF: 38, risk: "high", metro: true, note: "Alta densidad, buena rentabilidad, sobreoferta potencial" },
      recoleta: { label: "Recoleta", appreciation: 0.06, capRate: 0.057, avgPricePerM2UF: 36, risk: "medium", metro: true, note: "Zona comercial diversa, cercanía al centro" },
      otra_santiago: { label: "Otra comuna (Santiago)", appreciation: 0.06, capRate: 0.048, avgPricePerM2UF: 40, risk: "medium", metro: false, note: "Promedio Región Metropolitana" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE VALPARAÍSO
  // ═══════════════════════════════════════════════════════
  valparaiso: {
    label: "Valparaíso",
    region: "Valparaíso",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.05,
    comunas: {
      vina_del_mar: { label: "Viña del Mar", appreciation: 0.06, capRate: 0.048, avgPricePerM2UF: 42, risk: "low", metro: true, note: "Alta demanda turística y residencial, metro Valparaíso" },
      valparaiso_centro: { label: "Valparaíso Centro", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 28, risk: "medium", metro: true, note: "Patrimonio UNESCO, turismo, riesgo de incendios" },
      concon: { label: "Concón", appreciation: 0.07, capRate: 0.042, avgPricePerM2UF: 55, risk: "low", metro: false, note: "Zona costera premium, alta plusvalía, baja rentabilidad" },
      quilpue: { label: "Quilpué", appreciation: 0.05, capRate: 0.052, avgPricePerM2UF: 25, risk: "medium", metro: true, note: "Ciudad satélite, precios accesibles, metro" },
      villa_alemana: { label: "Villa Alemana", appreciation: 0.045, capRate: 0.053, avgPricePerM2UF: 22, risk: "medium", metro: true, note: "Precios bajos, conectividad por metro" },
      san_antonio: { label: "San Antonio", appreciation: 0.04, capRate: 0.055, avgPricePerM2UF: 20, risk: "high", metro: false, note: "Puerto, precios accesibles, mercado limitado" },
      otra_valparaiso: { label: "Otra comuna (Valparaíso)", appreciation: 0.055, capRate: 0.05, avgPricePerM2UF: 30, risk: "medium", metro: false, note: "Promedio Región de Valparaíso" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DEL BIOBÍO
  // ═══════════════════════════════════════════════════════
  concepcion: {
    label: "Concepción",
    region: "Biobío",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.055,
    comunas: {
      concepcion_centro: { label: "Concepción Centro", appreciation: 0.06, capRate: 0.06, avgPricePerM2UF: 32, risk: "low", metro: false, note: "Centro universitario, alta demanda arriendo" },
      san_pedro: { label: "San Pedro de la Paz", appreciation: 0.065, capRate: 0.048, avgPricePerM2UF: 38, risk: "low", metro: false, note: "Zona residencial premium del Gran Concepción" },
      chiguayante: { label: "Chiguayante", appreciation: 0.055, capRate: 0.052, avgPricePerM2UF: 30, risk: "low", metro: false, note: "Residencial familiar, crecimiento estable" },
      hualpen: { label: "Hualpén", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Zona industrial en transición, precios accesibles" },
      talcahuano: { label: "Talcahuano", appreciation: 0.04, capRate: 0.058, avgPricePerM2UF: 22, risk: "high", metro: false, note: "Puerto militar, riesgo tsunami, precios bajos" },
      coronel: { label: "Coronel", appreciation: 0.045, capRate: 0.06, avgPricePerM2UF: 18, risk: "high", metro: false, note: "Precios muy accesibles, alta rentabilidad, riesgo mayor" },
      otra_concepcion: { label: "Otra comuna (Concepción)", appreciation: 0.055, capRate: 0.055, avgPricePerM2UF: 28, risk: "medium", metro: false, note: "Promedio Gran Concepción" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE ANTOFAGASTA
  // ═══════════════════════════════════════════════════════
  antofagasta: {
    label: "Antofagasta",
    region: "Antofagasta",
    defaultAppreciation: 0.05,
    defaultCapRate: 0.06,
    comunas: {
      antofagasta_centro: { label: "Antofagasta Centro", appreciation: 0.05, capRate: 0.065, avgPricePerM2UF: 35, risk: "medium", metro: false, note: "Ciudad minera, alta rentabilidad, ciclos de commodities" },
      antofagasta_norte: { label: "Antofagasta Norte", appreciation: 0.055, capRate: 0.06, avgPricePerM2UF: 40, risk: "medium", metro: false, note: "Zona residencial premium, cercanía a playas" },
      calama: { label: "Calama", appreciation: 0.04, capRate: 0.07, avgPricePerM2UF: 25, risk: "high", metro: false, note: "Depende 100% de minería, altísima rentabilidad pero volátil" },
      otra_antofagasta: { label: "Otra comuna", appreciation: 0.05, capRate: 0.06, avgPricePerM2UF: 30, risk: "medium", metro: false, note: "Promedio Región de Antofagasta" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE COQUIMBO
  // ═══════════════════════════════════════════════════════
  la_serena: {
    label: "La Serena / Coquimbo",
    region: "Coquimbo",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.052,
    comunas: {
      la_serena_centro: { label: "La Serena Centro", appreciation: 0.06, capRate: 0.05, avgPricePerM2UF: 32, risk: "low", metro: false, note: "Turismo + residencial, alta demanda estacional" },
      coquimbo: { label: "Coquimbo", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Puerto, precios más accesibles que La Serena" },
      la_serena_playa: { label: "La Serena (sector playa)", appreciation: 0.065, capRate: 0.045, avgPricePerM2UF: 45, risk: "low", metro: false, note: "Premium costero, alta plusvalía, arriendo turístico" },
      otra_coquimbo: { label: "Otra comuna", appreciation: 0.055, capRate: 0.052, avgPricePerM2UF: 28, risk: "medium", metro: false, note: "Promedio Región de Coquimbo" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE LA ARAUCANÍA
  // ═══════════════════════════════════════════════════════
  temuco: {
    label: "Temuco",
    region: "La Araucanía",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.055,
    comunas: {
      temuco_centro: { label: "Temuco Centro", appreciation: 0.06, capRate: 0.058, avgPricePerM2UF: 30, risk: "medium", metro: false, note: "Capital regional, alta demanda universitaria" },
      temuco_poniente: { label: "Temuco Poniente", appreciation: 0.065, capRate: 0.05, avgPricePerM2UF: 38, risk: "low", metro: false, note: "Zona residencial premium, crecimiento sostenido" },
      padre_las_casas: { label: "Padre Las Casas", appreciation: 0.05, capRate: 0.06, avgPricePerM2UF: 20, risk: "high", metro: false, note: "Precios accesibles, crecimiento emergente" },
      otra_temuco: { label: "Otra comuna", appreciation: 0.055, capRate: 0.055, avgPricePerM2UF: 28, risk: "medium", metro: false, note: "Promedio La Araucanía" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE LOS LAGOS
  // ═══════════════════════════════════════════════════════
  puerto_montt: {
    label: "Puerto Montt",
    region: "Los Lagos",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.055,
    comunas: {
      puerto_montt_centro: { label: "Puerto Montt Centro", appreciation: 0.055, capRate: 0.058, avgPricePerM2UF: 28, risk: "medium", metro: false, note: "Capital regional, industria acuícola" },
      puerto_varas: { label: "Puerto Varas", appreciation: 0.065, capRate: 0.04, avgPricePerM2UF: 50, risk: "low", metro: false, note: "Turismo premium, alta plusvalía, baja rentabilidad" },
      osorno: { label: "Osorno", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 22, risk: "medium", metro: false, note: "Ciudad intermedia, mercado estable" },
      otra_los_lagos: { label: "Otra comuna", appreciation: 0.055, capRate: 0.055, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Promedio Región de Los Lagos" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE O'HIGGINS
  // ═══════════════════════════════════════════════════════
  rancagua: {
    label: "Rancagua",
    region: "O'Higgins",
    defaultAppreciation: 0.05,
    defaultCapRate: 0.055,
    comunas: {
      rancagua_centro: { label: "Rancagua Centro", appreciation: 0.055, capRate: 0.058, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Capital regional, cercanía a Santiago" },
      machalí: { label: "Machalí", appreciation: 0.06, capRate: 0.048, avgPricePerM2UF: 35, risk: "low", metro: false, note: "Zona residencial premium de Rancagua" },
      otra_ohiggins: { label: "Otra comuna", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 22, risk: "medium", metro: false, note: "Promedio Región de O'Higgins" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DEL MAULE
  // ═══════════════════════════════════════════════════════
  talca: {
    label: "Talca",
    region: "Maule",
    defaultAppreciation: 0.05,
    defaultCapRate: 0.055,
    comunas: {
      talca_centro: { label: "Talca Centro", appreciation: 0.055, capRate: 0.058, avgPricePerM2UF: 22, risk: "medium", metro: false, note: "Capital regional, universidad, crecimiento moderado" },
      talca_oriente: { label: "Talca Oriente", appreciation: 0.06, capRate: 0.05, avgPricePerM2UF: 30, risk: "low", metro: false, note: "Zona residencial emergente, nuevos proyectos" },
      otra_maule: { label: "Otra comuna", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 20, risk: "medium", metro: false, note: "Promedio Región del Maule" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE TARAPACÁ
  // ═══════════════════════════════════════════════════════
  iquique: {
    label: "Iquique",
    region: "Tarapacá",
    defaultAppreciation: 0.05,
    defaultCapRate: 0.06,
    comunas: {
      iquique_centro: { label: "Iquique Centro", appreciation: 0.05, capRate: 0.065, avgPricePerM2UF: 30, risk: "medium", metro: false, note: "Zona franca, minería, alta rentabilidad" },
      iquique_playa: { label: "Iquique (Playa Brava/Cavancha)", appreciation: 0.06, capRate: 0.05, avgPricePerM2UF: 45, risk: "medium", metro: false, note: "Premium costero, turismo, buena plusvalía" },
      alto_hospicio: { label: "Alto Hospicio", appreciation: 0.04, capRate: 0.065, avgPricePerM2UF: 18, risk: "high", metro: false, note: "Precios muy accesibles, alta rentabilidad" },
      otra_tarapaca: { label: "Otra comuna", appreciation: 0.05, capRate: 0.06, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Promedio Región de Tarapacá" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE ARICA Y PARINACOTA
  // ═══════════════════════════════════════════════════════
  arica: {
    label: "Arica",
    region: "Arica y Parinacota",
    defaultAppreciation: 0.04,
    defaultCapRate: 0.06,
    comunas: {
      arica_centro: { label: "Arica Centro", appreciation: 0.04, capRate: 0.065, avgPricePerM2UF: 22, risk: "medium", metro: false, note: "Ciudad fronteriza, precios accesibles, alta rentabilidad" },
      arica_playa: { label: "Arica (sector costero)", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 30, risk: "medium", metro: false, note: "Turismo, plusvalía moderada" },
      otra_arica: { label: "Otra comuna", appreciation: 0.04, capRate: 0.06, avgPricePerM2UF: 20, risk: "medium", metro: false, note: "Promedio Región de Arica" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE LOS RÍOS
  // ═══════════════════════════════════════════════════════
  valdivia: {
    label: "Valdivia",
    region: "Los Ríos",
    defaultAppreciation: 0.055,
    defaultCapRate: 0.055,
    comunas: {
      valdivia_centro: { label: "Valdivia Centro", appreciation: 0.06, capRate: 0.058, avgPricePerM2UF: 28, risk: "low", metro: false, note: "Ciudad universitaria, alta demanda arriendo estudiantil" },
      isla_teja: { label: "Isla Teja", appreciation: 0.065, capRate: 0.045, avgPricePerM2UF: 40, risk: "low", metro: false, note: "Zona premium, universidad Austral, alta plusvalía" },
      otra_los_rios: { label: "Otra comuna", appreciation: 0.055, capRate: 0.055, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Promedio Región de Los Ríos" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE MAGALLANES
  // ═══════════════════════════════════════════════════════
  punta_arenas: {
    label: "Punta Arenas",
    region: "Magallanes",
    defaultAppreciation: 0.04,
    defaultCapRate: 0.055,
    comunas: {
      punta_arenas_centro: { label: "Punta Arenas Centro", appreciation: 0.04, capRate: 0.058, avgPricePerM2UF: 25, risk: "medium", metro: false, note: "Zona austral, mercado limitado, precios estables" },
      otra_magallanes: { label: "Otra comuna", appreciation: 0.04, capRate: 0.055, avgPricePerM2UF: 22, risk: "medium", metro: false, note: "Promedio Región de Magallanes" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DE ATACAMA
  // ═══════════════════════════════════════════════════════
  copiapo: {
    label: "Copiapó",
    region: "Atacama",
    defaultAppreciation: 0.045,
    defaultCapRate: 0.06,
    comunas: {
      copiapo_centro: { label: "Copiapó Centro", appreciation: 0.045, capRate: 0.065, avgPricePerM2UF: 22, risk: "high", metro: false, note: "Minería, ciclos de commodities, alta rentabilidad" },
      otra_atacama: { label: "Otra comuna", appreciation: 0.045, capRate: 0.06, avgPricePerM2UF: 20, risk: "medium", metro: false, note: "Promedio Región de Atacama" },
    },
  },

  // ═══════════════════════════════════════════════════════
  // REGIÓN DEL ÑUBLE
  // ═══════════════════════════════════════════════════════
  chillan: {
    label: "Chillán",
    region: "Ñuble",
    defaultAppreciation: 0.05,
    defaultCapRate: 0.055,
    comunas: {
      chillan_centro: { label: "Chillán Centro", appreciation: 0.05, capRate: 0.058, avgPricePerM2UF: 20, risk: "medium", metro: false, note: "Capital regional nueva, crecimiento post-terremoto" },
      otra_nuble: { label: "Otra comuna", appreciation: 0.05, capRate: 0.055, avgPricePerM2UF: 18, risk: "medium", metro: false, note: "Promedio Región de Ñuble" },
    },
  },
};

/**
 * Get comuna info, with fallback to city defaults
 */
export function getComunaInfo(cityId: string, comunaId: string): ComunaInfo | null {
  const city = cityData[cityId];
  if (!city) return null;
  if (comunaId && city.comunas[comunaId]) return city.comunas[comunaId];
  // Fallback: return default city data
  return {
    label: city.label,
    appreciation: city.defaultAppreciation,
    capRate: city.defaultCapRate,
    avgPricePerM2UF: 35,
    risk: "medium",
    metro: false,
    note: `Promedio ${city.label}`,
  };
}

/**
 * Get list of cities for dropdown
 */
export function getCityOptions(): { value: string; label: string; region: string }[] {
  return Object.entries(cityData).map(([id, city]) => ({
    value: id,
    label: city.label,
    region: city.region,
  }));
}

/**
 * Get list of comunas for a city
 */
export function getComunaOptions(cityId: string): { value: string; label: string }[] {
  const city = cityData[cityId];
  if (!city) return [];
  return Object.entries(city.comunas).map(([id, comuna]) => ({
    value: id,
    label: comuna.label,
  }));
}
