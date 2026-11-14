/**
 * Fetches authentic NASA / JPL imagery from the official NASA Image and Video
 * Library (images-api.nasa.gov) and stores it in public/img.
 *
 * Writes src/data/nasaImages.json with the NASA ID, title, centre, date and
 * credit for every downloaded file, so the site can attribute every image.
 */
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://images-api.nasa.gov/search";

/** key -> { query, nasaId?, mustInclude?, minWidth? } */
const TARGETS = {
  "apollo11-lm": { query: "Apollo 11 lunar module Eagle", mustInclude: ["lunar module"], nasaId: null },
  "apollo11-surface": { query: "Apollo 11 astronaut lunar surface footprint", mustInclude: ["apollo 11"] },
  "lrv": { query: "lunar roving vehicle Apollo 17", mustInclude: ["roving vehicle"] },
  "lrv-apollo15": { query: "Apollo 15 lunar rover Hadley", mustInclude: ["rover"] },
  "alsep": { query: "ALSEP Apollo lunar surface experiments package", mustInclude: ["alsep"] },
  "alsep-astronaut": { query: "Apollo 16 ALSEP deployment", mustInclude: ["alsep"] },
  "surveyor3": { query: "Surveyor 3 spacecraft Moon", mustInclude: ["surveyor"] },
  "lunar-surface": { query: "Moon surface craters LRO", mustInclude: ["moon"] },
  "tranquility": { query: "Apollo 11 Tranquility Base landing site LRO", mustInclude: ["tranquility"] },
  "sojourner": { query: "Sojourner rover Mars Pathfinder", mustInclude: ["sojourner"] },
  "spirit": { query: "Spirit rover Mars Gusev panorama", mustInclude: ["spirit"], avoid: ["sandbox", "test", "engineers", "laboratory"] },
  "opportunity": { query: "Opportunity rover Mars panorama", mustInclude: ["opportunity"], avoid: ["stereo", "artist"] },
  "viking": { query: "Viking lander Mars 1976", mustInclude: ["viking"], avoid: ["drone", "death valley", "testing"] },
  "phoenix": { query: "Phoenix Mars lander polar", mustInclude: ["phoenix"], avoid: ["illustration"] },
  "insight": { query: "InSight lander Mars surface", mustInclude: ["insight"], avoid: ["impact"] },
  "ingenuity": { query: "Ingenuity Mars helicopter Perseverance", mustInclude: ["ingenuity"], avoid: ["video"] },
  "dawn": { query: "Dawn spacecraft artist concept", mustInclude: ["dawn"] },
  "ceres": { query: "Ceres dwarf planet occator crater", mustInclude: ["ceres"] },
  "vesta": { query: "Vesta asteroid", mustInclude: ["vesta"] },
  "eros": { query: "asteroid Eros NEAR Shoemaker", mustInclude: ["eros"] },
  "near": { query: "NEAR Shoemaker spacecraft", mustInclude: ["near"] },
  "pioneer": { query: "Pioneer 10 Jupiter spacecraft artist concept", mustInclude: ["pioneer"], avoid: ["psyche", "transport"] },
  "jupiter": { query: "Jupiter great red spot Juno", mustInclude: ["jupiter"] },
  "saturn": { query: "Saturn Cassini rings", mustInclude: ["saturn"] },
  "kepler": { query: "Kepler spacecraft space telescope", mustInclude: ["kepler"], avoid: ["planet 1649", "surface view"] },
  "exoplanet": { query: "exoplanet planetary system illustration", mustInclude: ["exoplanet"] },
  "mars-surface": { query: "Mars surface panorama rover", mustInclude: ["mars"] },
  "earthrise": { query: "Apollo 8 Earthrise lunar", mustInclude: ["earthrise"] },
  "eros": { query: "asteroid Eros NEAR surface", mustInclude: ["eros"] },
  "near": { query: "NEAR Shoemaker Eros spacecraft", mustInclude: ["near"] },
  "tranquility": { query: "Apollo 11 landing site Tranquility", mustInclude: ["apollo 11"] },
  "moon-full": { query: "Moon full disk", mustInclude: ["moon"] },
  "apollo12-lm": { query: "Apollo 12 lunar module Intrepid surface", mustInclude: ["intrepid"] },
  "moon-footprint": { query: "Apollo 11 footprint lunar soil", mustInclude: ["footprint"] },
  "pathfinder-lander": { query: "Mars Pathfinder lander surface", mustInclude: ["pathfinder"] },
  "starfield": { query: "star field deep space Hubble", mustInclude: ["star"] },
  "curiosity": { query: "Curiosity rover selfie Mars", mustInclude: ["curiosity"] },
};

const OUT_DIR = path.join(process.cwd(), "public", "img");
const MANIFEST = path.join(process.cwd(), "src", "data", "nasaImages.json");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(query) {
  const url = `${API}?q=${encodeURIComponent(query)}&media_type=image&page_size=40`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`search failed ${res.status}`);
  const json = await res.json();
  return json?.collection?.items ?? [];
}

function score(item, target) {
  const d = item.data?.[0] ?? {};
  const title = (d.title ?? "").toLowerCase();
  const desc = (d.description ?? "").toLowerCase();
  let s = 0;
  for (const term of target.mustInclude ?? []) {
    if (title.includes(term)) s += 6;
    if (desc.includes(term)) s += 2;
  }
  const med = (item.links ?? []).find((l) => /~medium\.jpg$/.test(l.href));
  if (med) s += 2;
  // Prefer colour, wide, modern photographs for cinematic crops.
  if (d.secondary_creator || d.photographer) s += 1;
  for (const term of target.avoid ?? []) {
    if (title.includes(term)) s -= 9;
    if (desc.includes(term)) s -= 3;
  }
  if (/poster|logo|infographic/.test(title)) s -= 4;
  const y = Number((d.date_created ?? "2000").slice(0, 4));
  if (y > 2008) s += 1;
  return s;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  const manifest = {};
  try {
    Object.assign(manifest, JSON.parse(await fs.readFile(MANIFEST, "utf8")));
  } catch {}

  const only = process.argv.slice(2);
  for (const [key, target] of Object.entries(TARGETS)) {
    if (only.length && !only.includes(key)) continue;
    try {
      const items = await search(target.query);
      if (!items.length) {
        console.log(`✗ ${key}: no results for "${target.query}"`);
        continue;
      }
      const ranked = items
        .map((item) => ({ item, s: score(item, target) }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 6);

      let picked = null;
      for (const { item } of ranked) {
        const links = item.links ?? [];
        // Prefer large, then medium, then original collection asset.
        const large = links.find((l) => /~large\.jpg$/.test(l.href));
        const med = links.find((l) => /~medium\.jpg$/.test(l.href));
        const url = (large ?? med)?.href;
        if (!url) continue;
        const pickW = Number(large?.width ?? med?.width ?? 0);
        if (pickW && pickW < 800) continue;
        const data = item.data[0];
        const dest = path.join(OUT_DIR, `${key}.jpg`);
        const bytes = await download(url, dest);
        if (bytes < 12000) continue;
        picked = { data, url, bytes };
        break;
      }
      if (!picked) {
        console.log(`✗ ${key}: no usable image`);
        continue;
      }
      const d = picked.data;
      manifest[key] = {
        nasaId: d.nasa_id,
        title: d.title,
        center: d.center ?? null,
        date: (d.date_created ?? "").slice(0, 10) || null,
        photographer: d.photographer ?? d.secondary_creator ?? null,
        source: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`,
        file: `/img/${key}.jpg`,
      };
      console.log(
        `✓ ${key.padEnd(16)} ${(picked.bytes / 1024).toFixed(0)}kB  ${d.center ?? "?"}  "${d.title}"  [${d.nasa_id}]`
      );
      await sleep(120);
    } catch (err) {
      console.log(`✗ ${key}: ${err.message}`);
    }
  }
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest: ${Object.keys(manifest).length} images -> ${MANIFEST}`);
}

main();
