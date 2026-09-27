// Downloads the licensed source files listed in assets/animals/models/models.json into ./sources.
// Poly Pizza files are fetched directly. Quaternius packs live in Google Drive folders and must be
// downloaded manually (see README) into ./sources/quaternius/<Name>.gltf.
import fs from 'fs';

const models = JSON.parse(fs.readFileSync('../../assets/animals/models/models.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
fs.mkdirSync('sources/quaternius', { recursive: true });

for (const [id, m] of Object.entries(models)) {
  const dest = config[id].src;
  if (fs.existsSync(dest)) continue;
  if (!m.downloadUrl.startsWith('https://static.poly.pizza/')) {
    console.log(`${id}: manual download needed -> ${m.downloadUrl} (save as ${dest})`);
    continue;
  }
  const res = await fetch(m.downloadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`${id}: ${dest}`);
}
