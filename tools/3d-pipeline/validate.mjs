import validator from 'gltf-validator';
import fs from 'fs';
const res = {};
for (const f of fs.readdirSync('out').filter((f) => f.endsWith('.glb'))) {
  const r = await validator.validateBytes(new Uint8Array(fs.readFileSync('out/' + f)), { maxIssues: 50 });
  const i = r.issues;
  res[f] = {
    errors: i.numErrors,
    warnings: i.numWarnings,
    infos: i.numInfos,
    msgs: i.messages
      .filter((m) => m.severity <= 1)
      .map((m) => `${m.severity ? 'W' : 'E'} ${m.code} ${m.pointer || ''}`)
      .slice(0, 6),
    info: r.info,
  };
  console.log(
    f.padEnd(14),
    'E',
    i.numErrors,
    'W',
    i.numWarnings,
    'I',
    i.numInfos,
    'tris',
    r.info.totalTriangleCount,
    'mat',
    r.info.materialCount,
    'anim',
    r.info.animationCount,
    'ext',
    JSON.stringify(r.info.extensionsUsed || []),
    res[f].msgs.join(' ; '),
  );
}
fs.writeFileSync('out/_validation.json', JSON.stringify(res, null, 1));
