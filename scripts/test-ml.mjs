/**
 * Quick test to verify Mercado Libre API credentials and search work.
 * Run with: node scripts/test-ml.mjs
 */

const APP_ID = "3362854147139156";
const SECRET = "LSxj8JRwnvqN3GUDDrVmuxUJ2b048DWP";
const ML_BASE = "https://api.mercadolibre.com";

console.log("1️⃣  Testing token endpoint...");
let token;
try {
  const res = await fetch(`${ML_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: APP_ID,
      client_secret: SECRET,
    }),
  });
  const data = await res.json();
  if (data.access_token) {
    token = data.access_token;
    console.log("✅ Token obtained:", token.slice(0, 20) + "...");
    console.log("   Expires in:", data.expires_in, "seconds");
  } else {
    console.error("❌ Token failed:", JSON.stringify(data));
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Token request error:", err.message);
  process.exit(1);
}

console.log("\n2️⃣  Testing public search (no auth, category MLC1459)...");
try {
  const res = await fetch(
    `${ML_BASE}/sites/MLC/search?category=MLC1459&q=Santiago&limit=3`
  );
  const data = await res.json();
  console.log("   HTTP status:", res.status);
  console.log("   Total available:", data.paging?.total);
  console.log("   Results returned:", data.results?.length);
  if (data.results?.length > 0) {
    const first = data.results[0];
    console.log("   First item:", {
      id: first.id,
      title: first.title?.slice(0, 60),
      price: first.price,
      currency: first.currency_id,
      thumbnail: first.thumbnail?.slice(0, 50),
    });
  } else {
    console.log("   ⚠️  No results returned");
    console.log("   Raw response:", JSON.stringify(data).slice(0, 300));
  }
} catch (err) {
  console.error("❌ Search error:", err.message);
}

console.log("\n3️⃣  Testing authenticated search...");
try {
  const res = await fetch(
    `${ML_BASE}/sites/MLC/search?category=MLC1459&q=Santiago&limit=3`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  console.log("   HTTP status:", res.status);
  console.log("   Total available:", data.paging?.total);
  console.log("   Results returned:", data.results?.length);
  if (data.results?.length > 0) {
    console.log("✅ Authenticated search works!");
    const item = data.results[0];
    console.log("   Sample property:");
    console.log("     id:", item.id);
    console.log("     title:", item.title?.slice(0, 60));
    console.log("     price:", item.price, item.currency_id);
    console.log("     location:", JSON.stringify(item.location)?.slice(0, 100));
    const bedroomsAttr = item.attributes?.find((a) => a.id === "BEDROOMS");
    const bathsAttr = item.attributes?.find((a) => a.id === "BATHROOMS");
    const areaAttr = item.attributes?.find((a) => a.id === "COVERED_AREA");
    console.log("     bedrooms:", bedroomsAttr?.value_name);
    console.log("     baths:", bathsAttr?.value_name);
    console.log("     area:", areaAttr?.value_name, "m²");
    console.log("     link:", item.permalink);
  } else {
    console.log("   ⚠️  No results");
    console.log("   Raw:", JSON.stringify(data).slice(0, 300));
  }
} catch (err) {
  console.error("❌ Authenticated search error:", err.message);
}
