import { Property } from "./types";

// UF reference for CLP estimates (live UF is fetched at runtime via /api/uf)
const UF = 37200;
const clp = (uf: number) => Math.round(uf * UF);
const rent = (uf: number, type: "departamento" | "casa") =>
  Math.round(uf * (type === "casa" ? 0.0035 : 0.004) * 10) / 10;

const DPTO = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
];
const CASA = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
];
const d = (i: number) => DPTO[i % DPTO.length];
const c = (i: number) => CASA[i % CASA.length];

export const mockProperties: Property[] = [

  // ── SANTIAGO PREMIUM (Vitacura, Las Condes, Lo Barnechea) ──────────
  { id:"1",  address:"Av. Vitacura 3650, Vitacura",            neighborhood:"Vitacura",         city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:4800,  priceCLP:clp(4800),  estimatedMonthlyRentUF:rent(4800,"departamento"),  estimatedMonthlyRentCLP:clp(rent(4800,"departamento")),  image:d(0) },
  { id:"2",  address:"Av. Apoquindo 4800, Las Condes",          neighborhood:"Las Condes",       city:"santiago", type:"casa",         rooms:4, baths:3, priceUF:7200,  priceCLP:clp(7200),  estimatedMonthlyRentUF:rent(7200,"casa"),           estimatedMonthlyRentCLP:clp(rent(7200,"casa")),           image:c(0) },
  { id:"3",  address:"Calle El Bosque Norte 500, Las Condes",   neighborhood:"El Bosque",        city:"santiago", type:"departamento", rooms:2, baths:2, priceUF:4200,  priceCLP:clp(4200),  estimatedMonthlyRentUF:rent(4200,"departamento"),  estimatedMonthlyRentCLP:clp(rent(4200,"departamento")),  image:d(1) },
  { id:"4",  address:"Av. Kennedy 5450, Vitacura",              neighborhood:"Vitacura",         city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:5500,  priceCLP:clp(5500),  estimatedMonthlyRentUF:rent(5500,"departamento"),  estimatedMonthlyRentCLP:clp(rent(5500,"departamento")),  image:d(2) },
  { id:"5",  address:"Camino El Alba 8500, Lo Barnechea",       neighborhood:"Lo Barnechea",     city:"santiago", type:"casa",         rooms:4, baths:3, priceUF:8500,  priceCLP:clp(8500),  estimatedMonthlyRentUF:rent(8500,"casa"),           estimatedMonthlyRentCLP:clp(rent(8500,"casa")),           image:c(1) },
  { id:"6",  address:"Av. Las Condes 12500, Las Condes",        neighborhood:"Las Condes",       city:"santiago", type:"casa",         rooms:5, baths:4, priceUF:11000, priceCLP:clp(11000), estimatedMonthlyRentUF:rent(11000,"casa"),          estimatedMonthlyRentCLP:clp(rent(11000,"casa")),          image:c(2) },
  { id:"7",  address:"Calle Alonso de Córdova 3200, Vitacura",  neighborhood:"Vitacura",         city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:3900,  priceCLP:clp(3900),  estimatedMonthlyRentUF:rent(3900,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3900,"departamento")),  image:d(3) },
  { id:"8",  address:"Av. Colón 4150, Las Condes",              neighborhood:"Las Condes",       city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:4600,  priceCLP:clp(4600),  estimatedMonthlyRentUF:rent(4600,"departamento"),  estimatedMonthlyRentCLP:clp(rent(4600,"departamento")),  image:d(4) },
  { id:"88", address:"Av. Presidente Kennedy 7200, Vitacura",   neighborhood:"Vitacura",         city:"santiago", type:"departamento", rooms:4, baths:3, priceUF:7800,  priceCLP:clp(7800),  estimatedMonthlyRentUF:rent(7800,"departamento"),  estimatedMonthlyRentCLP:clp(rent(7800,"departamento")),  image:d(7) },
  { id:"89", address:"Calle Las Hualtatas 7950, Vitacura",      neighborhood:"Vitacura",         city:"santiago", type:"casa",         rooms:5, baths:4, priceUF:13500, priceCLP:clp(13500), estimatedMonthlyRentUF:rent(13500,"casa"),          estimatedMonthlyRentCLP:clp(rent(13500,"casa")),          image:c(3) },

  // ── SANTIAGO ALTO-MEDIO (Providencia, Ñuñoa, La Reina) ────────────
  { id:"9",  address:"Av. Providencia 2250, Providencia",       neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:3200,  priceCLP:clp(3200),  estimatedMonthlyRentUF:rent(3200,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3200,"departamento")),  image:d(5) },
  { id:"10", address:"Calle Condell 1050, Providencia",         neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2700,  priceCLP:clp(2700),  estimatedMonthlyRentUF:rent(2700,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2700,"departamento")),  image:d(6) },
  { id:"11", address:"Av. Pedro de Valdivia 210, Providencia",  neighborhood:"Pedro de Valdivia",city:"santiago", type:"departamento", rooms:1, baths:1, priceUF:2100,  priceCLP:clp(2100),  estimatedMonthlyRentUF:rent(2100,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2100,"departamento")),  image:d(7) },
  { id:"17", address:"Calle Suecia 220, Providencia",           neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:2, baths:2, priceUF:3400,  priceCLP:clp(3400),  estimatedMonthlyRentUF:rent(3400,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3400,"departamento")),  image:d(2) },
  { id:"49", address:"Calle Los Leones 440, Providencia",       neighborhood:"Los Leones",       city:"santiago", type:"departamento", rooms:2, baths:2, priceUF:3600,  priceCLP:clp(3600),  estimatedMonthlyRentUF:rent(3600,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3600,"departamento")),  image:d(7) },
  { id:"92", address:"Calle Eliodoro Yáñez 1800, Providencia",  neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:3700,  priceCLP:clp(3700),  estimatedMonthlyRentUF:rent(3700,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3700,"departamento")),  image:d(2) },
  { id:"93", address:"Av. Pocuro 2440, Providencia",            neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2850,  priceCLP:clp(2850),  estimatedMonthlyRentUF:rent(2850,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2850,"departamento")),  image:d(3) },
  { id:"100",address:"Av. Lota 2380, Providencia",              neighborhood:"Providencia",      city:"santiago", type:"departamento", rooms:2, baths:2, priceUF:3100,  priceCLP:clp(3100),  estimatedMonthlyRentUF:rent(3100,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3100,"departamento")),  image:d(6) },
  { id:"12", address:"Calle Irarrázaval 3200, Ñuñoa",           neighborhood:"Ñuñoa",            city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2500,  priceCLP:clp(2500),  estimatedMonthlyRentUF:rent(2500,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2500,"departamento")),  image:d(0) },
  { id:"13", address:"Av. Grecia 800, Ñuñoa",                   neighborhood:"Ñuñoa",            city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:3000,  priceCLP:clp(3000),  estimatedMonthlyRentUF:rent(3000,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3000,"departamento")),  image:d(1) },
  { id:"14", address:"Calle Exequiel Fernández 150, Ñuñoa",     neighborhood:"Ñuñoa",            city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:4200,  priceCLP:clp(4200),  estimatedMonthlyRentUF:rent(4200,"casa"),           estimatedMonthlyRentCLP:clp(rent(4200,"casa")),           image:c(3) },
  { id:"91", address:"Calle Tegualda 1200, Ñuñoa",              neighborhood:"Ñuñoa",            city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2750,  priceCLP:clp(2750),  estimatedMonthlyRentUF:rent(2750,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2750,"departamento")),  image:d(1) },
  { id:"97", address:"Av. Zañartu 1450, Ñuñoa",                 neighborhood:"Ñuñoa",            city:"santiago", type:"casa",         rooms:4, baths:2, priceUF:5100,  priceCLP:clp(5100),  estimatedMonthlyRentUF:rent(5100,"casa"),           estimatedMonthlyRentCLP:clp(rent(5100,"casa")),           image:c(1) },
  { id:"15", address:"Calle Manquehue Sur 520, La Reina",        neighborhood:"La Reina",         city:"santiago", type:"casa",         rooms:4, baths:2, priceUF:5200,  priceCLP:clp(5200),  estimatedMonthlyRentUF:rent(5200,"casa"),           estimatedMonthlyRentCLP:clp(rent(5200,"casa")),           image:c(4) },
  { id:"16", address:"Av. Larraín 7200, La Reina",               neighborhood:"La Reina",         city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:4400,  priceCLP:clp(4400),  estimatedMonthlyRentUF:rent(4400,"casa"),           estimatedMonthlyRentCLP:clp(rent(4400,"casa")),           image:c(5) },
  { id:"94", address:"Av. Ossa 1900, La Reina",                  neighborhood:"La Reina",         city:"santiago", type:"casa",         rooms:4, baths:3, priceUF:6200,  priceCLP:clp(6200),  estimatedMonthlyRentUF:rent(6200,"casa"),           estimatedMonthlyRentCLP:clp(rent(6200,"casa")),           image:c(4) },
  { id:"50", address:"Av. El Golf 50, Las Condes",               neighborhood:"El Golf",          city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:5800,  priceCLP:clp(5800),  estimatedMonthlyRentUF:rent(5800,"departamento"),  estimatedMonthlyRentCLP:clp(rent(5800,"departamento")),  image:d(0) },
  { id:"90", address:"Av. Los Militares 6200, Las Condes",        neighborhood:"Las Condes",       city:"santiago", type:"departamento", rooms:2, baths:2, priceUF:3800,  priceCLP:clp(3800),  estimatedMonthlyRentUF:rent(3800,"departamento"),  estimatedMonthlyRentCLP:clp(rent(3800,"departamento")),  image:d(0) },

  // ── SANTIAGO EMERGENTE (Barrio Italia, Bellavista, Brasil) ─────────
  { id:"18", address:"Calle Condell 450, Barrio Italia",         neighborhood:"Barrio Italia",    city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2300,  priceCLP:clp(2300),  estimatedMonthlyRentUF:rent(2300,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2300,"departamento")),  image:d(3) },
  { id:"19", address:"Av. Italia 1680, Barrio Italia",           neighborhood:"Barrio Italia",    city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:2900,  priceCLP:clp(2900),  estimatedMonthlyRentUF:rent(2900,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2900,"departamento")),  image:d(4) },
  { id:"20", address:"Calle Dardignac 80, Bellavista",           neighborhood:"Bellavista",       city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2200,  priceCLP:clp(2200),  estimatedMonthlyRentUF:rent(2200,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2200,"departamento")),  image:d(5) },
  { id:"21", address:"Calle Brasil 840, Barrio Brasil",          neighborhood:"Barrio Brasil",    city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2000,  priceCLP:clp(2000),  estimatedMonthlyRentUF:rent(2000,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2000,"departamento")),  image:d(6) },
  { id:"22", address:"Calle Loreto 290, Providencia",            neighborhood:"Manuel Montt",     city:"santiago", type:"departamento", rooms:1, baths:1, priceUF:1950,  priceCLP:clp(1950),  estimatedMonthlyRentUF:rent(1950,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1950,"departamento")),  image:d(7) },

  // ── SANTIAGO MEDIO (Macul, San Miguel, La Florida, Peñalolén) ─────
  { id:"23", address:"Av. Vespucio Sur 4800, Macul",             neighborhood:"Macul",            city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:3200,  priceCLP:clp(3200),  estimatedMonthlyRentUF:rent(3200,"casa"),           estimatedMonthlyRentCLP:clp(rent(3200,"casa")),           image:c(0) },
  { id:"24", address:"Calle Macul 4200, Macul",                  neighborhood:"Macul",            city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2100,  priceCLP:clp(2100),  estimatedMonthlyRentUF:rent(2100,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2100,"departamento")),  image:d(0) },
  { id:"95", address:"Calle Quilín 3100, Macul",                 neighborhood:"Macul",            city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:3400,  priceCLP:clp(3400),  estimatedMonthlyRentUF:rent(3400,"casa"),           estimatedMonthlyRentCLP:clp(rent(3400,"casa")),           image:c(5) },
  { id:"25", address:"Av. Departamental 2800, San Miguel",       neighborhood:"San Miguel",       city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1900,  priceCLP:clp(1900),  estimatedMonthlyRentUF:rent(1900,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1900,"departamento")),  image:d(1) },
  { id:"26", address:"Calle Lo Ovalle 750, San Miguel",          neighborhood:"San Miguel",       city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:3000,  priceCLP:clp(3000),  estimatedMonthlyRentUF:rent(3000,"casa"),           estimatedMonthlyRentCLP:clp(rent(3000,"casa")),           image:c(1) },
  { id:"27", address:"Av. Vicuña Mackenna 7900, La Florida",     neighborhood:"La Florida",       city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2000,  priceCLP:clp(2000),  estimatedMonthlyRentUF:rent(2000,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2000,"departamento")),  image:d(2) },
  { id:"28", address:"Av. Américo Vespucio 6200, La Florida",    neighborhood:"La Florida",       city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2800,  priceCLP:clp(2800),  estimatedMonthlyRentUF:rent(2800,"casa"),           estimatedMonthlyRentCLP:clp(rent(2800,"casa")),           image:c(2) },
  { id:"29", address:"Av. Tobalaba 9500, La Florida",            neighborhood:"La Florida",       city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:2500,  priceCLP:clp(2500),  estimatedMonthlyRentUF:rent(2500,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2500,"departamento")),  image:d(3) },
  { id:"30", address:"Av. Grecia 6800, Peñalolén",               neighborhood:"Peñalolén",        city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2600,  priceCLP:clp(2600),  estimatedMonthlyRentUF:rent(2600,"casa"),           estimatedMonthlyRentCLP:clp(rent(2600,"casa")),           image:c(3) },
  { id:"31", address:"Calle Simón Bolívar 9100, Peñalolén",      neighborhood:"Peñalolén",        city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1900,  priceCLP:clp(1900),  estimatedMonthlyRentUF:rent(1900,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1900,"departamento")),  image:d(4) },
  { id:"32", address:"Av. Consistorial 3200, Peñalolén",         neighborhood:"Peñalolén",        city:"santiago", type:"casa",         rooms:4, baths:2, priceUF:3200,  priceCLP:clp(3200),  estimatedMonthlyRentUF:rent(3200,"casa"),           estimatedMonthlyRentCLP:clp(rent(3200,"casa")),           image:c(4) },
  { id:"96", address:"Av. José Arrieta 8200, Peñalolén",         neighborhood:"Peñalolén Alto",   city:"santiago", type:"casa",         rooms:4, baths:3, priceUF:4500,  priceCLP:clp(4500),  estimatedMonthlyRentUF:rent(4500,"casa"),           estimatedMonthlyRentCLP:clp(rent(4500,"casa")),           image:c(0) },

  // ── SANTIAGO ACCESIBLE (Maipú, Estación Central, Pudahuel) ────────
  { id:"33", address:"Av. Pajaritos 3800, Maipú",                neighborhood:"Maipú",            city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1700,  priceCLP:clp(1700),  estimatedMonthlyRentUF:rent(1700,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1700,"departamento")),  image:d(5) },
  { id:"34", address:"Calle Los Copihues 530, Maipú",            neighborhood:"Maipú",            city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2400,  priceCLP:clp(2400),  estimatedMonthlyRentUF:rent(2400,"casa"),           estimatedMonthlyRentCLP:clp(rent(2400,"casa")),           image:c(5) },
  { id:"35", address:"Av. Américo Vespucio 1800, Maipú",         neighborhood:"Maipú",            city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1850,  priceCLP:clp(1850),  estimatedMonthlyRentUF:rent(1850,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1850,"departamento")),  image:d(6) },
  { id:"36", address:"Calle Matta 1900, Estación Central",       neighborhood:"Estación Central", city:"santiago", type:"departamento", rooms:1, baths:1, priceUF:1500,  priceCLP:clp(1500),  estimatedMonthlyRentUF:rent(1500,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1500,"departamento")),  image:d(7) },
  { id:"37", address:"Av. Pudahuel 8200, Pudahuel",              neighborhood:"Pudahuel",         city:"santiago", type:"casa",         rooms:3, baths:1, priceUF:2000,  priceCLP:clp(2000),  estimatedMonthlyRentUF:rent(2000,"casa"),           estimatedMonthlyRentCLP:clp(rent(2000,"casa")),           image:c(0) },
  { id:"38", address:"Calle Cerrillos 1450, Cerrillos",          neighborhood:"Cerrillos",        city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2200,  priceCLP:clp(2200),  estimatedMonthlyRentUF:rent(2200,"casa"),           estimatedMonthlyRentCLP:clp(rent(2200,"casa")),           image:c(1) },
  { id:"39", address:"Av. O'Higgins 2800, Santiago Centro",      neighborhood:"Santiago Centro",  city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1650,  priceCLP:clp(1650),  estimatedMonthlyRentUF:rent(1650,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1650,"departamento")),  image:d(0) },
  { id:"40", address:"Calle Merced 680, Santiago Centro",        neighborhood:"Santiago Centro",  city:"santiago", type:"departamento", rooms:1, baths:1, priceUF:1380,  priceCLP:clp(1380),  estimatedMonthlyRentUF:rent(1380,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1380,"departamento")),  image:d(1) },
  { id:"41", address:"Av. Matta 680, Quinta Normal",             neighborhood:"Quinta Normal",    city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1750,  priceCLP:clp(1750),  estimatedMonthlyRentUF:rent(1750,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1750,"departamento")),  image:d(2) },
  { id:"42", address:"Calle San Pablo 4500, Quinta Normal",      neighborhood:"Quinta Normal",    city:"santiago", type:"casa",         rooms:3, baths:1, priceUF:2100,  priceCLP:clp(2100),  estimatedMonthlyRentUF:rent(2100,"casa"),           estimatedMonthlyRentCLP:clp(rent(2100,"casa")),           image:c(2) },

  // ── SANTIAGO OTROS (Huechuraba, Quilicura, Recoleta, San Bernardo) ─
  { id:"43", address:"Av. Recoleta 2700, Recoleta",              neighborhood:"Recoleta",         city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1800,  priceCLP:clp(1800),  estimatedMonthlyRentUF:rent(1800,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1800,"departamento")),  image:d(3) },
  { id:"44", address:"Calle Zapadores 1800, Huechuraba",         neighborhood:"Huechuraba",       city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:2000,  priceCLP:clp(2000),  estimatedMonthlyRentUF:rent(2000,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2000,"departamento")),  image:d(4) },
  { id:"45", address:"Av. Reyes Lavalle 3340, Huechuraba",       neighborhood:"Huechuraba",       city:"santiago", type:"departamento", rooms:3, baths:2, priceUF:2600,  priceCLP:clp(2600),  estimatedMonthlyRentUF:rent(2600,"departamento"),  estimatedMonthlyRentCLP:clp(rent(2600,"departamento")),  image:d(5) },
  { id:"46", address:"Av. Quilicura 3200, Quilicura",            neighborhood:"Quilicura",        city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2300,  priceCLP:clp(2300),  estimatedMonthlyRentUF:rent(2300,"casa"),           estimatedMonthlyRentCLP:clp(rent(2300,"casa")),           image:c(3) },
  { id:"47", address:"Calle Colón 450, San Bernardo",            neighborhood:"San Bernardo",     city:"santiago", type:"casa",         rooms:3, baths:2, priceUF:2100,  priceCLP:clp(2100),  estimatedMonthlyRentUF:rent(2100,"casa"),           estimatedMonthlyRentCLP:clp(rent(2100,"casa")),           image:c(4) },
  { id:"48", address:"Av. El Parrón 900, San Bernardo",          neighborhood:"San Bernardo",     city:"santiago", type:"departamento", rooms:2, baths:1, priceUF:1600,  priceCLP:clp(1600),  estimatedMonthlyRentUF:rent(1600,"departamento"),  estimatedMonthlyRentCLP:clp(rent(1600,"departamento")),  image:d(6) },

  // ── VALPARAÍSO — VIÑA DEL MAR ──────────────────────────────────────
  { id:"51", address:"Av. San Martín 350, Viña del Mar",         neighborhood:"Viña del Mar Centro", city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:2400, priceCLP:clp(2400), estimatedMonthlyRentUF:rent(2400,"departamento"), estimatedMonthlyRentCLP:clp(rent(2400,"departamento")), image:d(1) },
  { id:"52", address:"Av. Marina 560, Viña del Mar",             neighborhood:"Viña del Mar Centro", city:"valparaiso", type:"departamento", rooms:3, baths:2, priceUF:3200, priceCLP:clp(3200), estimatedMonthlyRentUF:rent(3200,"departamento"), estimatedMonthlyRentCLP:clp(rent(3200,"departamento")), image:d(2) },
  { id:"53", address:"Calle 1 Norte 850, Viña del Mar",          neighborhood:"Viña del Mar Norte",  city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:2100, priceCLP:clp(2100), estimatedMonthlyRentUF:rent(2100,"departamento"), estimatedMonthlyRentCLP:clp(rent(2100,"departamento")), image:d(3) },
  { id:"54", address:"Av. Libertad 1200, Viña del Mar",          neighborhood:"Viña del Mar",         city:"valparaiso", type:"casa",         rooms:3, baths:2, priceUF:3500, priceCLP:clp(3500), estimatedMonthlyRentUF:rent(3500,"casa"),          estimatedMonthlyRentCLP:clp(rent(3500,"casa")),          image:c(0) },
  { id:"55", address:"Av. Borgoño 14500, Reñaca",                neighborhood:"Reñaca",               city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:2800, priceCLP:clp(2800), estimatedMonthlyRentUF:rent(2800,"departamento"), estimatedMonthlyRentCLP:clp(rent(2800,"departamento")), image:d(4) },
  { id:"56", address:"Av. Edmundo Eluchans 1250, Reñaca",        neighborhood:"Reñaca",               city:"valparaiso", type:"departamento", rooms:3, baths:2, priceUF:3800, priceCLP:clp(3800), estimatedMonthlyRentUF:rent(3800,"departamento"), estimatedMonthlyRentCLP:clp(rent(3800,"departamento")), image:d(5) },
  { id:"57", address:"Calle Los Pinos 320, Con Con",             neighborhood:"Con Con",              city:"valparaiso", type:"casa",         rooms:4, baths:3, priceUF:5500, priceCLP:clp(5500), estimatedMonthlyRentUF:rent(5500,"casa"),          estimatedMonthlyRentCLP:clp(rent(5500,"casa")),          image:c(1) },
  { id:"58", address:"Av. Concón-Reñaca 3400, Con Con",          neighborhood:"Con Con",              city:"valparaiso", type:"departamento", rooms:2, baths:2, priceUF:3200, priceCLP:clp(3200), estimatedMonthlyRentUF:rent(3200,"departamento"), estimatedMonthlyRentCLP:clp(rent(3200,"departamento")), image:d(6) },
  { id:"66", address:"Calle Independencia 2300, Viña del Mar",   neighborhood:"Viña del Mar",         city:"valparaiso", type:"casa",         rooms:4, baths:2, priceUF:4200, priceCLP:clp(4200), estimatedMonthlyRentUF:rent(4200,"casa"),          estimatedMonthlyRentCLP:clp(rent(4200,"casa")),          image:c(4) },
  { id:"98", address:"Av. 5 de Abril 2300, Viña del Mar",        neighborhood:"Viña del Mar",         city:"valparaiso", type:"departamento", rooms:3, baths:2, priceUF:2900, priceCLP:clp(2900), estimatedMonthlyRentUF:rent(2900,"departamento"), estimatedMonthlyRentCLP:clp(rent(2900,"departamento")), image:d(4) },
  { id:"69", address:"Av. Eulogio Gordo 3200, Viña del Mar",     neighborhood:"Viña del Mar Poniente",city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1850, priceCLP:clp(1850), estimatedMonthlyRentUF:rent(1850,"departamento"), estimatedMonthlyRentCLP:clp(rent(1850,"departamento")), image:d(5) },

  // ── VALPARAÍSO — CIUDAD PUERTO Y ALREDEDORES ───────────────────────
  { id:"61", address:"Av. Brasil 1200, Valparaíso",              neighborhood:"Valparaíso Centro",    city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1700, priceCLP:clp(1700), estimatedMonthlyRentUF:rent(1700,"departamento"), estimatedMonthlyRentCLP:clp(rent(1700,"departamento")), image:d(0) },
  { id:"62", address:"Calle Blanco 980, Valparaíso",             neighborhood:"Valparaíso Centro",    city:"valparaiso", type:"departamento", rooms:1, baths:1, priceUF:1350, priceCLP:clp(1350), estimatedMonthlyRentUF:rent(1350,"departamento"), estimatedMonthlyRentCLP:clp(rent(1350,"departamento")), image:d(1) },
  { id:"63", address:"Calle Urriola 620, Cerro Alegre",          neighborhood:"Cerro Alegre",          city:"valparaiso", type:"casa",         rooms:3, baths:2, priceUF:3400, priceCLP:clp(3400), estimatedMonthlyRentUF:rent(3400,"casa"),          estimatedMonthlyRentCLP:clp(rent(3400,"casa")),          image:c(3) },
  { id:"64", address:"Calle Héroe 340, Cerro Concepción",        neighborhood:"Cerro Concepción",      city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:2200, priceCLP:clp(2200), estimatedMonthlyRentUF:rent(2200,"departamento"), estimatedMonthlyRentCLP:clp(rent(2200,"departamento")), image:d(2) },
  { id:"65", address:"Av. Argentina 150, Valparaíso",            neighborhood:"Valparaíso",            city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1550, priceCLP:clp(1550), estimatedMonthlyRentUF:rent(1550,"departamento"), estimatedMonthlyRentCLP:clp(rent(1550,"departamento")), image:d(3) },
  { id:"99", address:"Calle Pudeto 580, Valparaíso",             neighborhood:"Valparaíso",            city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1600, priceCLP:clp(1600), estimatedMonthlyRentUF:rent(1600,"departamento"), estimatedMonthlyRentCLP:clp(rent(1600,"departamento")), image:d(5) },
  { id:"59", address:"Av. Los Carrera 180, Quilpué",             neighborhood:"Quilpué",               city:"valparaiso", type:"casa",         rooms:3, baths:2, priceUF:2200, priceCLP:clp(2200), estimatedMonthlyRentUF:rent(2200,"casa"),          estimatedMonthlyRentCLP:clp(rent(2200,"casa")),          image:c(2) },
  { id:"60", address:"Calle Manuel Rodríguez 450, Quilpué",      neighborhood:"Quilpué",               city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1600, priceCLP:clp(1600), estimatedMonthlyRentUF:rent(1600,"departamento"), estimatedMonthlyRentCLP:clp(rent(1600,"departamento")), image:d(7) },
  { id:"70", address:"Calle Los Boldos 890, Quilpué",            neighborhood:"Quilpué Norte",         city:"valparaiso", type:"casa",         rooms:3, baths:2, priceUF:2000, priceCLP:clp(2000), estimatedMonthlyRentUF:rent(2000,"casa"),          estimatedMonthlyRentCLP:clp(rent(2000,"casa")),          image:c(0) },
  { id:"67", address:"Av. Villa Alemana 1800, Villa Alemana",    neighborhood:"Villa Alemana",         city:"valparaiso", type:"casa",         rooms:3, baths:2, priceUF:1900, priceCLP:clp(1900), estimatedMonthlyRentUF:rent(1900,"casa"),          estimatedMonthlyRentCLP:clp(rent(1900,"casa")),          image:c(5) },
  { id:"68", address:"Calle Chorrillos 450, Villa Alemana",      neighborhood:"Villa Alemana",         city:"valparaiso", type:"departamento", rooms:2, baths:1, priceUF:1400, priceCLP:clp(1400), estimatedMonthlyRentUF:rent(1400,"departamento"), estimatedMonthlyRentCLP:clp(rent(1400,"departamento")), image:d(4) },

  // ── CONCEPCIÓN — GRAN CONCEPCIÓN ───────────────────────────────────
  { id:"71", address:"Av. O'Higgins 820, Concepción",            neighborhood:"Concepción Centro",    city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1800, priceCLP:clp(1800), estimatedMonthlyRentUF:rent(1800,"departamento"), estimatedMonthlyRentCLP:clp(rent(1800,"departamento")), image:d(6) },
  { id:"72", address:"Calle Barros Arana 650, Concepción",       neighborhood:"Concepción Centro",    city:"concepcion", type:"departamento", rooms:1, baths:1, priceUF:1400, priceCLP:clp(1400), estimatedMonthlyRentUF:rent(1400,"departamento"), estimatedMonthlyRentCLP:clp(rent(1400,"departamento")), image:d(7) },
  { id:"73", address:"Av. Chacabuco 1400, Concepción",           neighborhood:"Concepción",           city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1650, priceCLP:clp(1650), estimatedMonthlyRentUF:rent(1650,"departamento"), estimatedMonthlyRentCLP:clp(rent(1650,"departamento")), image:d(0) },
  { id:"74", address:"Calle Paicaví 980, Concepción",            neighborhood:"Concepción",           city:"concepcion", type:"casa",         rooms:3, baths:2, priceUF:2800, priceCLP:clp(2800), estimatedMonthlyRentUF:rent(2800,"casa"),          estimatedMonthlyRentCLP:clp(rent(2800,"casa")),          image:c(1) },
  { id:"83", address:"Av. Collao 2100, Concepción",              neighborhood:"Collao",               city:"concepcion", type:"departamento", rooms:3, baths:2, priceUF:2100, priceCLP:clp(2100), estimatedMonthlyRentUF:rent(2100,"departamento"), estimatedMonthlyRentCLP:clp(rent(2100,"departamento")), image:d(4) },
  { id:"75", address:"Av. Padre Hurtado 2600, San Pedro de la Paz", neighborhood:"San Pedro de la Paz", city:"concepcion", type:"departamento", rooms:2, baths:2, priceUF:2200, priceCLP:clp(2200), estimatedMonthlyRentUF:rent(2200,"departamento"), estimatedMonthlyRentCLP:clp(rent(2200,"departamento")), image:d(1) },
  { id:"76", address:"Av. Los Canelos 1200, San Pedro de la Paz", neighborhood:"San Pedro de la Paz", city:"concepcion", type:"casa",         rooms:4, baths:3, priceUF:3800, priceCLP:clp(3800), estimatedMonthlyRentUF:rent(3800,"casa"),          estimatedMonthlyRentCLP:clp(rent(3800,"casa")),          image:c(2) },
  { id:"77", address:"Av. Carlos Infante 3100, San Pedro de la Paz", neighborhood:"San Pedro de la Paz", city:"concepcion", type:"casa",      rooms:3, baths:2, priceUF:2900, priceCLP:clp(2900), estimatedMonthlyRentUF:rent(2900,"casa"),          estimatedMonthlyRentCLP:clp(rent(2900,"casa")),          image:c(3) },
  { id:"78", address:"Av. Gran Bretaña 2400, Talcahuano",        neighborhood:"Talcahuano",           city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1500, priceCLP:clp(1500), estimatedMonthlyRentUF:rent(1500,"departamento"), estimatedMonthlyRentCLP:clp(rent(1500,"departamento")), image:d(2) },
  { id:"79", address:"Calle Colón 950, Talcahuano",              neighborhood:"Talcahuano",           city:"concepcion", type:"casa",         rooms:3, baths:2, priceUF:2300, priceCLP:clp(2300), estimatedMonthlyRentUF:rent(2300,"casa"),          estimatedMonthlyRentCLP:clp(rent(2300,"casa")),          image:c(4) },
  { id:"80", address:"Av. Las Industrias 1400, Hualpén",         neighborhood:"Hualpén",              city:"concepcion", type:"casa",         rooms:3, baths:1, priceUF:1800, priceCLP:clp(1800), estimatedMonthlyRentUF:rent(1800,"casa"),          estimatedMonthlyRentCLP:clp(rent(1800,"casa")),          image:c(5) },
  { id:"81", address:"Calle Freire 780, Chiguayante",            neighborhood:"Chiguayante",          city:"concepcion", type:"casa",         rooms:3, baths:2, priceUF:2100, priceCLP:clp(2100), estimatedMonthlyRentUF:rent(2100,"casa"),          estimatedMonthlyRentCLP:clp(rent(2100,"casa")),          image:c(0) },
  { id:"82", address:"Av. Claudio Arrau 2800, Chiguayante",      neighborhood:"Chiguayante",          city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1600, priceCLP:clp(1600), estimatedMonthlyRentUF:rent(1600,"departamento"), estimatedMonthlyRentCLP:clp(rent(1600,"departamento")), image:d(3) },
  { id:"84", address:"Calle Arturo Prat 560, Los Ángeles",       neighborhood:"Los Ángeles",          city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1300, priceCLP:clp(1300), estimatedMonthlyRentUF:rent(1300,"departamento"), estimatedMonthlyRentCLP:clp(rent(1300,"departamento")), image:d(5) },
  { id:"85", address:"Av. Alemania 1600, Los Ángeles",           neighborhood:"Los Ángeles",          city:"concepcion", type:"casa",         rooms:3, baths:2, priceUF:2200, priceCLP:clp(2200), estimatedMonthlyRentUF:rent(2200,"casa"),          estimatedMonthlyRentCLP:clp(rent(2200,"casa")),          image:c(1) },
  { id:"86", address:"Calle Caupolican 890, Coronel",            neighborhood:"Coronel",              city:"concepcion", type:"casa",         rooms:3, baths:2, priceUF:1700, priceCLP:clp(1700), estimatedMonthlyRentUF:rent(1700,"casa"),          estimatedMonthlyRentCLP:clp(rent(1700,"casa")),          image:c(2) },
  { id:"87", address:"Av. Alessandri 2200, Coronel",             neighborhood:"Coronel",              city:"concepcion", type:"departamento", rooms:2, baths:1, priceUF:1250, priceCLP:clp(1250), estimatedMonthlyRentUF:rent(1250,"departamento"), estimatedMonthlyRentCLP:clp(rent(1250,"departamento")), image:d(6) },

];

/**
 * Filter properties by search criteria
 */
export function filterProperties(
  budget: number,
  currency: "CLP" | "UF",
  city?: string,
  propertyType?: string,
  rooms?: number,
  baths?: number,
  ufValue: number = 37200
): Property[] {
  const budgetUF = currency === "UF" ? budget : budget / ufValue;

  return mockProperties.filter((prop) => {
    if (prop.priceUF > budgetUF) return false;
    if (city && prop.city !== city) return false;
    if (propertyType && prop.type !== propertyType) return false;
    if (rooms && prop.rooms < rooms) return false;
    if (baths && prop.baths < baths) return false;
    return true;
  });
}
