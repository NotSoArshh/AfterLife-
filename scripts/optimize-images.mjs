/**
 * Optimises the NASA image set for the hosting upload budget.
 *
 * The site limit is 10 MiB of assets, and the raw NASA downloads came to
 * ~9.7 MB on their own. This resizes to a cinematic-but-efficient width and
 * re-encodes as progressive mozjpeg, keeping the originals referenceable by
 * NASA ID (see src/data/nasaImages.ts).
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "img");
const MAX_WIDTH = 1600;
const QUALITY = 74;

const main = async () => {
  const entries = (await fs.readdir(DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let before = 0;
  let after = 0;

  for (const file of entries) {
    const full = path.join(DIR, file);
    const stat = await fs.stat(full);
    before += stat.size;

    const buf = await fs.readFile(full);
    const image = sharp(buf, { failOn: "none" });
    const meta = await image.metadata();
    const resized = meta.width && meta.width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image;

    const out = await resized
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" })
      .toBuffer();

    // Never write a bigger file than we started with.
    if (out.length < buf.length) {
      await fs.writeFile(full, out);
      after += out.length;
    } else {
      after += buf.length;
    }
    const ratio = Math.round((1 - out.length / buf.length) * 100);
    console.log(
      `${file.padEnd(26)} ${String(meta.width).padStart(5)}px  ${(buf.length / 1024).toFixed(0).padStart(4)}kB -> ${(out.length / 1024)
        .toFixed(0)
        .padStart(4)}kB  (-${ratio}%)`
    );
  }

  console.log(
    `\nTotal ${(before / 1048576).toFixed(2)} MiB -> ${(after / 1048576).toFixed(2)} MiB across ${entries.length} files`
  );
};

main();
