import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const root = process.cwd();
const srv = http
  .createServer((q, s) => {
    const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
    if (!fs.existsSync(p)) {
      s.writeHead(404);
      return s.end();
    }
    s.writeHead(200, {
      'content-type': p.endsWith('.js')
        ? 'text/javascript'
        : p.endsWith('.html')
          ? 'text/html'
          : 'application/octet-stream',
    });
    fs.createReadStream(p).pipe(s);
  })
  .listen(8765);
const [out, views, ...files] = process.argv.slice(2);
const V = views.split(',');
const b = await chromium.launch({
  channel: 'chrome',
  args: ['--use-angle=metal', '--enable-webgl', '--ignore-gpu-blocklist'],
});
const pg = await b.newPage();
pg.on('console', (m) => {
  if (m.type() === 'error') console.error('console', m.text());
});
await pg.goto('http://localhost:8765/viewer.html');
await pg.waitForFunction('window.ready');
if (process.env.NOGRID) await pg.evaluate('window.noGrid=true');
const tiles = [];
for (const f of files) {
  const res = await pg.evaluate(([u, v]) => window.render(u, v), ['/' + f, V]);
  console.log(
    path.basename(f),
    res.clip || '',
    'size',
    res.size.map((x) => x.toFixed(2)).join('x'),
    'min',
    res.min.map((x) => x.toFixed(2)).join(','),
  );
  const imgs = res.out.map((d) => Buffer.from(d.split(',')[1], 'base64'));
  const label = Buffer.from(
    `<svg width="${360 * V.length}" height="24"><rect width="100%" height="100%" fill="#fff"/><text x="4" y="17" font-size="15" font-family="Arial">${path.basename(f)}  ${V.join(' | ')}</text></svg>`,
  );
  tiles.push(
    await sharp({ create: { width: 360 * V.length, height: 324, channels: 3, background: '#fff' } })
      .composite([{ input: label, left: 0, top: 0 }, ...imgs.map((im, i) => ({ input: im, left: i * 360, top: 24 }))])
      .png()
      .toBuffer(),
  );
}
const cols = Number(process.env.COLS || 2);
const rows = Math.ceil(tiles.length / cols);
const TW = 360 * V.length;
await sharp({ create: { width: TW * cols, height: 324 * rows, channels: 3, background: '#fff' } })
  .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * TW, top: Math.floor(i / cols) * 324 })))
  .png()
  .toFile(out);
await b.close();
srv.close();
