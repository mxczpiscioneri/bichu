# Atribuições dos modelos 3D

Créditos dos 22 modelos em `assets/animals/models/`. Metadados completos (URLs, tamanhos, datas) em [`assets/animals/models/models.json`](../assets/animals/models/models.json).

- **CC BY 3.0** exige atribuição visível ao usuário final (por exemplo, uma tela “Créditos” no app e a página da loja). **Enquanto essa tela não existir, os modelos CC BY não podem ser publicados.**
- **CC0 1.0** não exige atribuição; creditamos mesmo assim.
- “Poly by Google” é a conta que republica no Poly Pizza os modelos do antigo Google Poly, feitos pela equipe do Google e licenciados em CC BY 3.0. É assim que o autor aparece na fonte; não há nome individual de artista.

Texto sugerido para a tela de créditos:

```text
Modelos 3D:
• Quaternius (quaternius.com) — CC0 1.0: vaca, cachorro, cavalo, lobo, golfinho.
• Poly by Google, via Poly Pizza (poly.pizza) — CC BY 3.0 (creativecommons.org/licenses/by/3.0):
  urso, abelha, gato, pintinho, galinha, galo, pato, elefante, sapo, leão, macaco, papagaio, porco, foca, ovelha, tigre, peru.
Modelos convertidos para GLB, reorientados, redimensionados para escala real e com texturas reduzidas.
```

## Urso (`bear`)

- **Modelo:** Bear
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/0PXWfxfb0Hu
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 2,0 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Abelha (`bee`)

- **Modelo:** Bee
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/2177F_NMT--
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z) — rotação de −90° em Y
  - escala ajustada para metros (comprimento 1,5 cm)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Gato (`cat`)

- **Modelo:** Cat
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/6dM1J6f6pm9
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento total 0,55 m (cauda erguida))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Pintinho (`chick`)

- **Modelo:** Baby chick
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/fozJTmMX5yv
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 8 cm)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Galinha (`chicken`)

- **Modelo:** Hen
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/8Unya0rw9tR
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 0,40 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Galo (`cock`)

- **Modelo:** Rooster
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/6NTegstc5Jy
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 0,60 m (com crista))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Vaca (`cow`)

- **Modelo:** Ultimate Animated Animals / Cow.gltf
- **Autor:** Quaternius
- **Fonte:** https://quaternius.com/packs/ultimateanimatedanimals.html
- **Licença:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
- **Atribuição obrigatória:** não
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 2,4 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - rig e animações preservados; o modelo foi envolvido por um nó raiz `cow_root` com a escala/posição
  - materiais de cor sólida unidos em 1 material com textura-paleta
  - dados não usados removidos (prune/dedup)

## Cachorro (`dog`)

- **Modelo:** Ultimate Animated Animals / ShibaInu.gltf
- **Autor:** Quaternius
- **Fonte:** https://quaternius.com/packs/ultimateanimatedanimals.html
- **Licença:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
- **Atribuição obrigatória:** não
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 0,70 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - rig e animações preservados; o modelo foi envolvido por um nó raiz `dog_root` com a escala/posição
  - materiais de cor sólida unidos em 1 material com textura-paleta
  - dados não usados removidos (prune/dedup)

## Golfinho (`dolphin`)

- **Modelo:** Dolphin — Quaternius Animated Fish Pack (https://quaternius.com/packs/animatedfish.html)
- **Autor:** Quaternius
- **Fonte:** https://poly.pizza/m/3LzFgI3GLO
- **Licença:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
- **Atribuição obrigatória:** não
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 2,5 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - rig e animações preservados; o modelo foi envolvido por um nó raiz `dolphin_root` com a escala/posição
  - metalicidade 0,4 → 0 e rugosidade mínima 0,5 (sem mapa de ambiente no AR)
  - dados não usados removidos (prune/dedup)

## Pato (`duck`)

- **Modelo:** Mallard duck
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/frSLi6b6Vid
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 0,55 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Elefante (`elephant`)

- **Modelo:** Elephant
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/cx0-TiCjDOx
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 3,2 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Sapo (`frog`)

- **Modelo:** Frog
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/0QZHgL_V-Pj
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z) — rotação de −90° em Y
  - escala ajustada para metros (comprimento 8 cm)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Cavalo (`horse`)

- **Modelo:** Ultimate Animated Animals / Horse.gltf
- **Autor:** Quaternius
- **Fonte:** https://quaternius.com/packs/ultimateanimatedanimals.html
- **Licença:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
- **Atribuição obrigatória:** não
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 2,4 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - rig e animações preservados; o modelo foi envolvido por um nó raiz `horse_root` com a escala/posição
  - materiais de cor sólida unidos em 1 material com textura-paleta
  - dados não usados removidos (prune/dedup)

## Leão (`lion`)

- **Modelo:** Lion
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/3XAJojWxSWz
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento total 2,9 m (com cauda))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Macaco (`monkey`)

- **Modelo:** Capuchin
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/29hG1_J1Uiq
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 0,80 m (com cauda))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Papagaio (`parrot`)

- **Modelo:** Parrot
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/dfNjMLtO0pd
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 0,80 m (com cauda))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Porco (`pig`)

- **Modelo:** Pig
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/6XC3XssJIU_
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 1,5 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Foca (`seal`)

- **Modelo:** Seal
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/fudlK4rnsI-
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 1,6 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - dados não usados removidos (prune/dedup)

## Ovelha (`sheep`)

- **Modelo:** Sheep
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/dXBMV4AY2DL
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 1,3 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Tigre (`tiger`)

- **Modelo:** Tiger
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/5A3w06FXUup
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 1,1 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura mantida em 1024×1024
  - dados não usados removidos (prune/dedup)

## Peru (`turkey`)

- **Modelo:** Turkey
- **Autor:** Poly by Google
- **Fonte:** https://poly.pizza/m/4f31_AG9Iap
- **Licença:** CC BY 3.0 — https://creativecommons.org/licenses/by/3.0/
- **Atribuição obrigatória:** sim
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (altura 1,0 m)
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - transformações aplicadas nos vértices (nós sem transformação)
  - textura reduzida de 2048×2048 para 1024×1024
  - dados não usados removidos (prune/dedup)

## Lobo (`wolf`)

- **Modelo:** Ultimate Animated Animals / Wolf.gltf
- **Autor:** Quaternius
- **Fonte:** https://quaternius.com/packs/ultimateanimatedanimals.html
- **Licença:** CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/
- **Atribuição obrigatória:** não
- **Baixado em:** 2026-09-27
- **Alterações:**
  - convertido/reexportado como GLB (glTF 2.0) pelo pipeline `tools/3d-pipeline`
  - orientação normalizada (+Y para cima, frente em +Z)
  - escala ajustada para metros (comprimento 1,7 m (com cauda))
  - pivô movido para o chão (Y = 0) e centralizado em X/Z
  - rig e animações preservados; o modelo foi envolvido por um nó raiz `wolf_root` com a escala/posição
  - materiais de cor sólida unidos em 1 material com textura-paleta
  - dados não usados removidos (prune/dedup)
