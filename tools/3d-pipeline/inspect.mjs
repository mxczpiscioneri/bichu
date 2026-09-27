import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
import fs from 'fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const d = await io.read(f);
  const r = d.getRoot();
  let tris = 0;
  for (const m of r.listMeshes())
    for (const p of m.listPrimitives()) {
      const i = p.getIndices(),
        pos = p.getAttribute('POSITION');
      const n = i ? i.getCount() : pos.getCount();
      if (p.getMode() === 4) tris += n / 3;
    }
  const b = getBounds(r.getDefaultScene() || r.listScenes()[0]);
  const tex = r.listTextures().map((t) => {
    const s = t.getSize();
    return `${t.getMimeType()} ${s ? s.join('x') : '?'}`;
  });
  const col = r
    .listMeshes()
    .flatMap((m) => m.listPrimitives())
    .some((p) => p.getAttribute('COLOR_0'));
  console.log(
    f.split('/').pop().padEnd(30),
    'tris',
    tris,
    'mesh',
    r.listMeshes().length,
    'nodes',
    r.listNodes().length,
    'mat',
    r.listMaterials().length,
    'skins',
    r.listSkins().length,
    'cams',
    r.listCameras().length,
    'ext',
    r
      .listExtensionsUsed()
      .map((e) => e.extensionName)
      .join(',') || '-',
    'vcol',
    col,
    'tex',
    JSON.stringify(tex),
    'size',
    b.max.map((v, i) => (v - b.min[i]).toFixed(2)).join('x'),
    'min',
    b.min.map((v) => v.toFixed(2)).join(','),
    'anims',
    JSON.stringify(r.listAnimations().map((a) => a.getName())),
    'KB',
    (fs.statSync(f).size / 1024) | 0,
  );
}
