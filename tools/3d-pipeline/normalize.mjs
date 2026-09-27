// Bichu 3D pipeline: source GLB -> clean, oriented (+Z forward, +Y up), grounded (minY=0),
// centered on X/Z, real-world metres, textures <= 1024, no cameras/lights/compression.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  prune,
  getBounds,
  clearNodeTransform,
  flatten,
  palette,
  textureCompress,
  transformMesh,
  unpartition,
} from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'fs';

const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const only = process.argv.slice(2);
const report = {};

function quatY(deg) {
  const r = (deg * Math.PI) / 180 / 2;
  return [0, Math.sin(r), 0, Math.cos(r)];
}
function mat4(t, q, s) {
  const [x, y, z, w] = q;
  const x2 = x + x,
    y2 = y + y,
    z2 = z + z;
  const xx = x * x2,
    xy = x * y2,
    xz = x * z2,
    yy = y * y2,
    yz = y * z2,
    zz = z * z2,
    wx = w * x2,
    wy = w * y2,
    wz = w * z2;
  return [
    (1 - (yy + zz)) * s,
    (xy + wz) * s,
    (xz - wy) * s,
    0,
    (xy - wz) * s,
    (1 - (xx + zz)) * s,
    (yz + wx) * s,
    0,
    (xz + wy) * s,
    (yz - wx) * s,
    (1 - (xx + yy)) * s,
    0,
    t[0],
    t[1],
    t[2],
    1,
  ];
}

for (const [id, c] of Object.entries(cfg)) {
  if (only.length && !only.includes(id)) continue;
  const doc = await io.read(c.src);
  const root = doc.getRoot();
  const skinned = root.listSkins().length > 0;

  // 1. Remove what AR does not need.
  root.listCameras().forEach((x) => x.dispose());
  for (const n of root.listNodes()) {
    if (n.getCamera()) n.setCamera(null);
  }
  const lights = root.listExtensionsUsed().find((e) => e.extensionName === 'KHR_lights_punctual');
  if (lights) lights.dispose();

  // 2. Materials: no metallic (renderer has no env map), keep colours untouched.
  for (const m of root.listMaterials()) {
    m.setMetallicFactor(0);
    if (m.getRoughnessFactor() < 0.5) m.setRoughnessFactor(0.5);
  }

  const scene = root.getDefaultScene() || root.listScenes()[0];
  const rot = quatY(c.rotateY || 0);

  if (!skinned) {
    // Static meshes: bake every node transform + orientation into vertices.
    await doc.transform(flatten());
    for (const n of scene.listChildren()) {
      n.traverse((node) => {
        if (node.getMesh()) {
          const wm = node.getWorldMatrix();
          node.setMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
          transformMesh(node.getMesh(), wm);
        }
      });
    }
    for (const n of root.listNodes()) {
      if (n.getMesh()) transformMesh(n.getMesh(), mat4([0, 0, 0], rot, 1));
    }
    const b = getBounds(scene);
    const size = [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]];
    const s = c.target.value / size[c.target.axis === 'y' ? 1 : c.target.axis === 'x' ? 0 : 2];
    const t = [-(b.min[0] + size[0] / 2) * s, -b.min[1] * s, -(b.min[2] + size[2] / 2) * s];
    for (const n of root.listNodes()) {
      if (n.getMesh()) transformMesh(n.getMesh(), mat4(t, [0, 0, 0, 1], s));
    }
  } else {
    // Skinned meshes: keep the rig intact, wrap everything in one root node.
    const wrapper = doc.createNode(`${id}_root`);
    for (const n of scene.listChildren()) {
      scene.removeChild(n);
      wrapper.addChild(n);
    }
    scene.addChild(wrapper);
    wrapper.setRotation(rot);
    const b = getBounds(scene);
    const size = [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]];
    const s = c.target.value / size[c.target.axis === 'y' ? 1 : c.target.axis === 'x' ? 0 : 2];
    wrapper.setScale([s, s, s]);
    const b2 = getBounds(scene);
    const sz2 = [b2.max[0] - b2.min[0], 0, b2.max[2] - b2.min[2]];
    wrapper.setTranslation([-(b2.min[0] + sz2[0] / 2), -b2.min[1], -(b2.min[2] + sz2[2] / 2)]);
  }

  // 3. Flat-colour multi-material rigs -> one palette material (fewer draw calls).
  if (c.palette) await doc.transform(palette({ min: 2 }));

  // 4. Textures: cap at 1024 px, keep format.
  await doc.transform(textureCompress({ encoder: sharp, resize: [1024, 1024] }));

  await doc.transform(dedup(), prune(), unpartition());
  root.getAsset().generator = 'Bichu 3D pipeline (glTF-Transform)';
  const out = `out/${id}.glb`;
  fs.mkdirSync('out', { recursive: true });
  await io.write(out, doc);

  const fb = getBounds((await io.read(out)).getRoot().listScenes()[0]);
  report[id] = {
    bytes: fs.statSync(out).size,
    min: fb.min.map((v) => +v.toFixed(4)),
    max: fb.max.map((v) => +v.toFixed(4)),
  };
  console.log(id.padEnd(9), report[id].bytes, 'min', report[id].min.join(','), 'max', report[id].max.join(','));
}
fs.writeFileSync('out/_bounds.json', JSON.stringify(report, null, 1));
