# Especificação Técnica — Bichu

## 1. Objetivo técnico

Construir uma aplicação nova em React Native, mantendo o conteúdo valioso do AnimalSounds e removendo dependência da arquitetura Android Kotlin antiga.

O domínio deve ser independente da UI e do renderer AR.

**Regra estrutural:**
`Animal + Taxonomias + Challenge Engine` são a fonte de verdade.
Tela, áudio e AR apenas representam esse domínio.

---

## 2. Stack alvo

### Core
- React Native
- Expo
- TypeScript
- Expo Router

### Áudio
- `expo-audio`

### Interação
- `react-native-gesture-handler`
- `react-native-reanimated`

### Persistência MVP
- store local;
- AsyncStorage ou equivalente simples para progresso/configuração;
- conteúdo distribuído junto ao app.

### Estado
Sugestão: Zustand para estado de sessão/progresso simples.
Evitar Redux no MVP sem necessidade real.

### AR
Hipótese técnica inicial:
- `@reactvision/react-viro`
- Expo Dev Client
- iOS via ARKit
- Android via ARCore

O AR exige build nativa customizada; não planejar desenvolvimento final apenas em Expo Go.

---

## 3. Estrutura de repositório sugerida

```text
bichu/
├── app/
│   ├── (tabs)/
│   ├── animal/
│   ├── challenge/
│   ├── ar/
│   └── parents/
├── src/
│   ├── components/
│   ├── domain/
│   ├── content/
│   ├── challenges/
│   ├── audio/
│   ├── ar/
│   ├── progress/
│   ├── analytics/
│   └── theme/
├── assets/
│   ├── animals/
│   │   ├── images/
│   │   ├── sounds/
│   │   ├── names/
│   │   └── models/
│   ├── brand/
│   └── ui/
├── docs/
└── scripts/
```

---

## 4. Modelo de domínio

O modelo está em `src/domain/animal.ts`.

Separar:
- identidade;
- mídia;
- classificação;
- habitat;
- dieta;
- características;
- conteúdo editorial;
- capacidades de gameplay.

Nunca transformar caminho de arquivo ou componente React em fonte de verdade do domínio.

---

## 5. Conteúdo local

MVP:
- JSON/TS versionado no app;
- sem CMS;
- sem banco;
- sem API.

Motivo:
- volume pequeno;
- offline;
- baixa complexidade;
- feedback rápido;
- fácil revisão em PR.

Posteriormente, um CMS pode publicar pacotes versionados.

---

## 6. IDs estáveis

Todos os animais usam slug estável em inglês:

```text
lion
elephant
dolphin
...
```

UI usa `pt-BR`.

Assets seguem o mesmo ID:
```text
assets/animals/images/lion.png
assets/animals/sounds/lion.mp3
assets/animals/names/lion_name.mp3
assets/animals/models/lion.glb
```

Isso simplifica migração e lookup.

---

## 7. Challenge Engine

### Input
- Animal;
- nível;
- tipo de desafio;
- conjunto de animais disponíveis;
- histórico recente.

### Output
```ts
type Challenge = {
  id: string;
  type: ChallengeType;
  prompt: string;
  promptAudioKey?: string;
  options: ChallengeOption[];
  correctOptionIds: string[];
  explanation: string;
  interaction: 'tap' | 'drag';
};
```

### Regras
- gerar distractors semanticamente válidos;
- não repetir resposta correta como distractor;
- evitar alternativa ambígua;
- respeitar o nível;
- não gerar questão se o dado for `unknown` ou genérico demais;
- aceitar múltiplas respostas corretas quando necessário.

Exemplo:
`lion.foods = ['meat']`
pode gerar `meat / grass / fruit`.

---

## 8. Banco de distractors

Não gerar distractors aleatoriamente de texto livre.

Usar taxonomias:
```text
food:
  meat
  grass
  leaves
  fruits
  seeds
  fish
  insects
  nectar
```

Cada opção possui:
- id;
- label;
- icon;
- categoria;
- compatibilidades.

Isso reduz ambiguidades.

---

## 9. Drag-and-drop

Implementação sugerida:
- Gesture Handler para gesto;
- Reanimated para movimento/retorno;
- hit area maior que o elemento visual;
- “snap” no alvo quando correto;
- retorno animado quando incorreto.

Para crianças:
- evitar precisão;
- aceitar interseção parcial;
- feedback imediato;
- não punir erro.

O mesmo componente deve funcionar fora e dentro da tela AR.

---

## 10. Áudio

Usar `expo-audio`.

Tipos:
- nome/silabação;
- som real;
- feedback;
- instruções futuras.

Criar um serviço simples:
```ts
AudioService.playAnimalName(id)
AudioService.playAnimalSound(id)
AudioService.playFeedback('correct')
```

Evitar iniciar dois áudios simultâneos.
Ao tocar outro som, parar/reiniciar o anterior quando fizer sentido.

Preload dos sons da tela atual pode reduzir latência.

---

## 11. Assets legados

O pacote não altera os binários originais.

Mapeamento:
- `R.drawable.<id>` -> `assets/animals/images/<id>.png`
- `R.raw.<id>` -> `assets/animals/sounds/<id>.mp3`
- `R.raw.<id>_name` -> `assets/animals/names/<id>_name.mp3`

O manifesto completo está em `legacy/ASSET_MANIFEST.json`.

Use `scripts/fetch-legacy-assets.sh` para copiar do repositório público antigo.

---

## 12. AR

### Spike obrigatório antes de expandir
1. Expo Dev Client;
2. ViroReact;
3. detectar plano;
4. colocar um `lion.glb`;
5. tocar áudio;
6. renderizar slot de desafio;
7. validar em iPhone e Android real.

### Cena mínima
```text
ViroARScene
  Plane detection
  Anchor
    Animal node
    Optional label
    Challenge target
```

### Estado
O estado do desafio não deve viver dentro do renderer AR.

```text
Challenge Engine
       |
       v
Challenge state
       |
       +---- UI normal
       |
       +---- AR renderer
```

Assim a mesma pergunta pode ser executada em 2D ou AR.

---

## 13. Modelos 3D

Formato preferencial:
- GLB/GLTF.

Metadados por modelo:
- license;
- author;
- sourceUrl;
- version;
- fileSize;
- triangleCount se conhecido;
- textureResolution;
- animations;
- defaultScale;
- pivot/ground offset.

O app não deve assumir animações.

```ts
capabilities: {
  static: true,
  idle: false,
  walk: false
}
```

Gameplay deve continuar funcionando com `static: true`.

---

## 14. Escala real

Não confiar apenas na escala visual importada.

No conteúdo do modelo:
```ts
ar: {
  realWorldHeightMeters: 1.2,
  displayScale: 1,
  groundOffset: 0
}
```

Modelos precisam ser normalizados em pipeline antes de publicação.

---

## 15. Performance AR

Metas iniciais:
- modelos mobile-ready;
- texturas comprimidas;
- evitar 4K/8K sem necessidade;
- lazy-load;
- carregar um animal principal por cena;
- não manter múltiplos GLBs pesados residentes;
- medir memória em aparelhos intermediários Android.

A qualidade percebida depende mais de iluminação, escala e material consistente do que de polígonos excessivos.

---

## 16. Navegação

Rotas conceituais:
```text
/
 /explore
 /animal/[id]
 /play
 /challenge/[type]
 /collection
 /ar/[animalId]
 /parents
```

---

## 17. Progresso local

```ts
type AnimalProgress = {
  animalId: string;
  opened: boolean;
  heardName: boolean;
  heardSound: boolean;
  challengesCompleted: string[];
  discoveredAt?: string;
  stars: number;
};
```

Persistir apenas informações necessárias.

Sem conta no MVP.

---

## 18. Analytics

Criar interface própria:
```ts
Analytics.track(event, properties)
```

Não acoplar screens diretamente a Firebase/SDK.

Isso permite trocar provider e aplicar restrições de privacidade.

Eventos mínimos descritos no PRODUCT.md.

Antes da versão infantil pública, revisar SDKs para conformidade com políticas de apps infantis.

---

## 19. Permissões

MVP 2D:
- nenhuma permissão sensível.

AR:
- câmera.

Não pedir:
- microfone;
- localização;
- contatos;
- fotos;
- tracking publicitário.

A menos que uma funcionalidade futura justifique explicitamente.

---

## 20. Offline

Conteúdo base deve funcionar sem internet:
- imagens;
- sons;
- textos;
- desafios;
- progresso.

AR com modelos incluídos também pode funcionar offline.

Pacotes futuros podem ser baixáveis.

---

## 21. Internacionalização

Mesmo o MVP sendo `pt-BR`, não hardcodar texto no domínio.

Estrutura:
```ts
name: {
  ptBR: 'Leão'
}
```

Narrativas e assets de locução podem ter locale:
```text
names/pt-BR/lion.mp3
names/en-US/lion.mp3
```

---

## 22. Segurança e legado

O repositório antigo contém `keystore.jks`.

Não copiar keystore para o novo repositório.
Adicionar padrões sensíveis ao `.gitignore`.
Verificar Play App Signing e status da antiga upload key.

`google-services.json` deve ser recriado/revisado na nova aplicação em vez de simplesmente copiado.

---

## 23. Testes

### Unitários
- validadores do Animal;
- geração de desafios;
- distractors;
- progressão.

### Componentes
- card de animal;
- opção de desafio;
- drag target;
- audio controls.

### Device
- áudio com modo silencioso;
- tablets;
- low-end Android;
- ARKit;
- ARCore.

### Conteúdo
Schema validation obrigatório em CI.

---

## 24. CI

Pipeline recomendado:
1. lint;
2. TypeScript;
3. schema validation;
4. unit tests;
5. asset manifest validation;
6. build quando necessário.

---

## 25. Migração do legado

Fase automatizável:
1. baixar PNG;
2. baixar `animal.mp3`;
3. baixar `animal_name.mp3`;
4. renomear para estrutura nova;
5. validar que os 22 conjuntos estão completos;
6. gerar checksum;
7. revisar direitos.

Não migrar código Kotlin.

---

## 26. Ordem de implementação

### Sprint técnico 0
- scaffold Expo;
- tema;
- domínio;
- seed;
- asset migration;
- audio service.

### Sprint 1
- home;
- explorar;
- detalhe;
- nome/som;
- progresso.

### Sprint 2
- Challenge Engine;
- som -> animal;
- food;
- habitat;
- locomotion;
- collection.

### Spike AR
- 1 GLB;
- plane detection;
- placement;
- desafio.

Somente depois decidir expansão 3D.

---

## 27. Decisões explícitas

- React Native: sim.
- Expo: sim.
- Backend inicial: não.
- Auth inicial: não.
- Vector DB: não.
- LLM: não.
- AR obrigatório para usar o app: não.
- Animações individuais por animal: não.
- Conteúdo estruturado e local: sim.
