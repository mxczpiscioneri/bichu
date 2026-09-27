# Pipeline 3D do Bichu

Ferramenta offline que transforma os modelos-fonte licenciados nos GLBs de `assets/animals/models/`. Tem `package.json` próprio: nada daqui entra no app.

Saída: glTF 2.0 núcleo (sem Draco/Meshopt/KTX2, que o ViroReact 3.0.1 não lê), metros, +Y para cima, frente em +Z, pivô no chão (Y = 0) e centralizado em X/Z, texturas ≤ 1024 px, sem câmeras/luzes.

## Uso

```bash
cd tools/3d-pipeline
npm install
npm run fetch      # baixa os modelos do Poly Pizza para ./sources
# Quaternius (Google Drive, manual): baixe a pasta glTF do pack
# https://quaternius.com/packs/ultimateanimatedanimals.html e copie
# Cow.gltf, Horse.gltf, ShibaInu.gltf e Wolf.gltf para ./sources/quaternius/
npm run build      # gera ./out/<id>.glb  (ou: node normalize.mjs lion elephant)
npm run validate   # Khronos glTF Validator
npm run render     # ./out/lineup.png (three.js no Google Chrome, via Playwright)
cp out/*.glb ../../assets/animals/models/
rm -rf node_modules  # evita que o Metro do app indexe esta pasta
```

Com as mesmas fontes, `npm run build` reproduz byte a byte os arquivos versionados.

## Arquivos

- `config.json`: por animal, arquivo-fonte, rotação em Y (`rotateY`), medida de referência para a escala real (`target`) e se os materiais de cor sólida viram uma paleta (`palette`).
- `normalize.mjs`: limpa, orienta, escala, assenta no chão, reduz texturas e exporta.
- `validate.mjs`, `inspect.mjs`: validação e inspeção (triângulos, materiais, texturas, animações).
- `render.mjs` + `viewer.html`: renderização headless para conferência visual.

Metadados, licenças e decisões: `assets/animals/models/models.json`, `docs/3D_ATTRIBUTIONS.md`, `docs/3D_ASSET_REPORT.md`.

## Adicionando ou trocando um modelo

1. Confirme a licença na página de origem (CC0 ou CC BY; nunca NC/ND/editorial/desconhecida).
2. Adicione a entrada em `config.json` e rode `build`, `validate` e `render`.
3. Confira na imagem: animal de frente para +Z, patas em Y = 0, tamanho plausível.
4. Atualize `models.json`, `docs/3D_ATTRIBUTIONS.md` e `docs/3D_ASSET_REPORT.md`.
