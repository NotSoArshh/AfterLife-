/**
 * Downloads specific, hand-picked NASA image IDs (chosen by title from the
 * images-api.nasa.gov catalogue) so every image provably matches its subject.
 */
import fs from "node:fs/promises";
import path from "node:path";

const IDS = {
  "viking": "PIA00563",              // First Color Image From Viking Lander 1
  "viking2": "PIA00568",             // First Color Image of the Viking Lander 2 Site
  "eros": "PIA02470",                // Eros in Color
  "eros-sunset": "PIA02493",         // Sunset on Eros
  "near-eros": "PIA03148",           // Final Eros Images: last, closest image
  "kepler-spacecraft": "PIA11824",   // Kepler in Space Artist Concept
  "pioneer-plaque": "ARC-1972-AC72-2135",
  "apollo12-surface": "as12-49-7281",
};

const OUT = path.join(process.cwd(), "public", "img");
const MANIFEST = path.join(process.cwd(), "src", "data", "nasaImages.json");

const main = async () => {
  await fs.mkdir(OUT, { recursive: true });
  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));

  for (const [key, nasaId] of Object.entries(IDS)) {
    const res = await fetch(`https://images-api.nasa.gov/search?nasa_id=${encodeURIComponent(nasaId)}`);
    const json = await res.json();
    const item = json?.collection?.items?.[0];
    if (!item) {
      console.log(`✗ ${key}: ${nasaId} not found`);
      continue;
    }
    // Ask NASA for the real asset list for this ID: some assets exist only as
    // ~orig, others only as ~large/~medium.
    const collRes = await fetch(`https://images-assets.nasa.gov/image/${encodeURIComponent(nasaId)}/collection.json`);
    const assets = collRes.ok ? await collRes.json() : [];
    const pickAsset = (suffix) => assets.find((a) => a.endsWith(suffix));
    const url = (
      (item.links ?? []).find((l) => /~large\.jpg$/.test(l.href))?.href ??
      pickAsset("~large.jpg") ??
      pickAsset("~orig.jpg") ??
      (item.links ?? []).find((l) => /~medium\.jpg$/.test(l.href))?.href ??
      pickAsset("~medium.jpg")
    );
    if (!url) {
      console.log(`✗ ${key}: no downloadable asset`);
      continue;
    }
    const bin = Buffer.from(await (await fetch(url)).arrayBuffer());
    await fs.writeFile(path.join(OUT, `${key}.jpg`), bin);
    const d = item.data[0];
    manifest[key] = {
      nasaId: d.nasa_id,
      title: d.title,
      center: d.center ?? null,
      date: (d.date_created ?? "").slice(0, 10) || null,
      photographer: d.secondary_creator ?? d.photographer ?? null,
      source: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`,
      file: `/img/${key}.jpg`,
    };
    console.log(`✓ ${key.padEnd(18)} ${(bin.length / 1024).toFixed(0)}kB  "${d.title}"  [${d.nasa_id}]`);
  }
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
};

main();
