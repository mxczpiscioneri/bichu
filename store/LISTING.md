# Bichu — ficha das lojas

Fonte da verdade dos textos e respostas usados na App Store e no Google Play.
Status em 28/09/2026: ✅ preenchido no console · ⬜ falta fazer (manual).
Atualizado em 12/10/2026 (branch `feat/google-analytics`): estatísticas anônimas (GA4/Firebase). As respostas de App
Privacy e Segurança dos dados abaixo **mudaram** e precisam ser atualizadas nos consoles antes do primeiro build com
Firebase (detalhes em `docs/ANALYTICS.md`).

## Identidade

| Campo | Valor |
|---|---|
| Nome | Bichu |
| Bundle / pacote | `br.com.techhands.bichu` |
| Apple ID do app | 6817090414 (SKU `bichu`, Team `GD2JNB5JH9`) |
| Play Console | conta Matheus Piscioneri · app 4975937660493413133 |
| Idioma principal | Português (Brasil) |
| Versão | 1.0.1 — aviso de segurança no AR (build numbers incrementados pelo EAS); anterior: 1.0.0 (iOS build 3 · Android versionCode 5) |
| Preço | Grátis, sem compras no app |
| Publicador / copyright | 2026 TechHands |

## URLs

| Uso | URL |
|---|---|
| Site / suporte / marketing | https://bichu-app.vercel.app |
| Política de privacidade | https://bichu-app.vercel.app/privacidade.html |
| Termos de uso | https://bichu-app.vercel.app/termos.html |
| Créditos (atribuições CC BY) | https://bichu-app.vercel.app/creditos.html |
| E-mail público de contato | contato@techhands.com.br |

## Textos

**Subtítulo (Apple, máx. 30)** — `Sons e nomes dos animais`

**Descrição curta (Google, máx. 80)** —
`Descubra os animais brincando: sons reais, nomes, desafios e realidade aumentada`

**Texto promocional (Apple, máx. 170)** —
`Descubra os animais brincando: sons reais, nomes em sílabas, desafios e realidade aumentada. Sem anúncios e sem rastreamento.`

**Palavras-chave (Apple, máx. 100)** —
`animais,sons,bichos,infantil,criança,educativo,fazenda,zoológico,aprender,sílabas,bebê,jogo`

**Descrição completa (Apple e Google, ~1.350 caracteres)**

```text
Bichu é um jeito divertido de a criança descobrir o mundo animal: ver, ouvir, brincar e colecionar.

OUÇA E APRENDA
• 22 animais com ilustrações exclusivas, da fazenda à savana e ao oceano
• Sons reais de cada bicho
• Nome falado e separado em sílabas (ca-chor-ro), para apoiar a fala e a leitura
• Curiosidades curtas e fáceis, com áudio para quem ainda não lê

BRINQUE
• Que animal é esse? Ouça o som e descubra quem faz
• O que ele come? Arraste a comida certa até o animal
• Onde ele vive? Leve o animal até o seu habitat
• Como ele se move, o que cobre o corpo e como nascem os filhotes
• Erros viram novas tentativas, com incentivo e sem pressão

VEJA NO SEU MUNDO
• Realidade aumentada: coloque o animal em 3D na sala e veja o tamanho real (em aparelhos compatíveis)

MONTE SUA BICHUPÉDIA
• Cada animal descoberto ganha estrela e entra na coleção
• Animal do dia para ter sempre uma novidade

FEITO PARA CRIANÇAS DE 2 A 8 ANOS
• Modo Explorador (2 a 4 anos): toques simples, muito áudio e imagem
• Modo Aventureiro (5 a 8 anos): mais desafios e informações
• Botões grandes, textos grandes e funciona sem saber ler

SEGURO PARA A FAMÍLIA
• Sem anúncios, sem compras e sem cadastro
• Sem dados pessoais: o progresso fica só no aparelho
• Só estatísticas anônimas de uso (que os pais podem desligar)
• Funciona offline
• Área dos pais protegida para ajustes
```

## Imagens (`store/screenshots/`, geradas por `tools/store-screenshots/compose.py`)

| Loja | Tipo | Tamanho | Pasta / arquivo | Status |
|---|---|---|---|---|
| Apple | iPhone 6.5" (aceito pelo console) | 1284×2778 | `ios-iphone-6.5/` (6) | ⬜ upload |
| Apple | iPad 13" | 2064×2752 | `ios-ipad-13/` (6) | ⬜ upload |
| Google | Ícone | 512×512 PNG | exportar de `assets/brand/icon.png` | ⬜ upload |
| Google | Feature graphic | 1024×500 | `android-feature-graphic-1024x500.png` | ⬜ upload |
| Google | Celular | 1080×1920 | `android-phone/` (6) | ⬜ upload |
| Google | Tablet 7" e 10" | 1440×2560 | `android-tablet-10/` (6) | ⬜ upload |

Ordem das telas: 01 Início · 02 Animal · 03 Desafio · 04 Acerto · 05 Explorar · 06 Bichupédia.

## App Store Connect

| Seção | Resposta | Status |
|---|---|---|
| Categoria | Educação (sem secundária) | ✅ |
| Classificação etária | 4+ (Livre no Brasil) — tudo "Nenhum/Não" | ✅ |
| Kids | Made for Kids · 5 anos ou menos | ✅ |
| Content Rights | Sim, usa conteúdo de terceiros e tem os direitos | ✅ |
| App Privacy | **Mudou**: Yes, coleta (veja "App Privacy" abaixo). Antes: Data Not Collected | ⬜ atualizar antes do build com Firebase |
| Preço / disponibilidade | Grátis · 175 países | ✅ |
| Sign-in required | Não | ✅ |
| Contato da revisão | Matheus Piscioneri · +55 16 99748-8817 · mxczpiscioneri@gmail.com | ✅ |
| Build | 1.0.0 (3) | ⬜ selecionar na versão |
| Digital Services Act (UE) | status de comerciante | ⬜ |
| Enviar | Add for Review | ⬜ |

**Notas para o revisor**

```text
Bichu é um app infantil (2 a 8 anos), sem login, sem anúncios, sem compras e sem dados pessoais. Todo o conteúdo funciona offline.

Analytics: usamos Firebase Analytics só para contagens anônimas e agregadas (brincadeiras iniciadas/concluídas, animais descobertos, toques em botões). O app é compilado SEM AdSupport/IDFA (FirebaseAnalyticsCore, sem IdentitySupport), com a coleta de IDFV desligada, consentimento de anúncios negado, sem ID de usuário e sem dados pessoais. Os pais podem desligar na Área dos pais → "Estatísticas anônimas de uso".

Como testar:
1. Na primeira abertura, toque em "Vamos descobrir!".
2. Início: toque no Animal do dia ou em qualquer animal para ouvir nome e som.
3. Aba Brincar: escolha uma brincadeira (tocar ou arrastar).
4. Realidade aumentada: na tela de um animal, toque em "Ver no meu mundo" (requer aparelho com ARKit/ARCore).
   O app primeiro mostra um aviso de segurança pedindo supervisão de um adulto
   e atenção ao ambiente. Somente após tocar em "Entendi, continuar" a câmera
   é solicitada e a experiência de AR é iniciada. A câmera é usada só para
   mostrar o animal em 3D; nenhuma imagem é salva ou enviada. Não é necessário
   nenhum headset (Daydream, Oculus etc.).
5. Área dos pais: engrenagem no canto superior direito, depois mantenha o botão pressionado (gesto de adulto). Links externos (créditos) só existem dentro dessa área protegida.

Política de privacidade: https://bichu-app.vercel.app/privacidade.html
```

## Google Play Console

| Seção | Resposta | Status |
|---|---|---|
| Tipo / categoria | App · Educação | ✅ |
| Contato | contato@techhands.com.br · https://bichu-app.vercel.app | ✅ |
| Política de privacidade | URL acima | ✅ |
| Acesso ao app | Sem restrições (sem login) | ✅ |
| Anúncios | Não tem | ✅ |
| ID de publicidade | Não usa | ✅ |
| Classificação (IARC) | "Outros apps", educativo · Livre (ClassInd), Livre (ESRB), PEGI 3 | ✅ |
| Público-alvo | Menores de 5 e 6–8 · Feito para Família · Aprovado por Professores (inscrito) | ✅ |
| Segurança dos dados | **Mudou**: coleta, não compartilha (veja "Segurança dos dados" abaixo) · selo Política para famílias | ⬜ atualizar antes do build com Firebase |
| Governamental / financeiro / saúde | Não / nenhum / nenhum | ✅ |
| Detalhes do app | textos salvos como rascunho | ⬜ imagens |
| Versão | `.aab` 1.0.0 (5) em Teste interno | ⬜ primeiro upload manual |
| Produção | promover do Teste interno | ⬜ |

### App Privacy (App Store Connect) — respostas novas

"Do you or your third-party partners collect data from this app?" → **Yes**.

| Tipo | Ligado à identidade | Rastreamento | Finalidade |
|---|---|---|---|
| Usage Data → Product Interaction | Não | Não | Analytics |
| Identifiers → Device ID (ID aleatório da instalação do Firebase, não o IDFA) | Não | Não | Analytics |
| Location → Coarse Location (país/região deduzidos do IP) | Não | Não | Analytics |

Todo o resto: **não coletado** (Contact Info, Health, Financial, Precise Location, Sensitive Info, Contacts, User
Content, Browsing/Search History, User ID, Purchases, Diagnostics — não há Crashlytics —, Other).

### Segurança dos dados (Play Console) — respostas novas

- O app coleta ou compartilha dados? **Sim**. Criptografados em trânsito? **Sim**.
- Os usuários podem pedir a exclusão? Não há conta. Explicação: "Não há conta nem dado pessoal. Os pais podem desligar
  as estatísticas na Área dos pais; ao desinstalar, o identificador da instalação é apagado e o Google apaga o resto
  em até 2 meses."
- Tipos (todos: coletado, **não compartilhado**, **não** processado de forma efêmera, **opcional** — interruptor dos
  pais —, finalidade **Análise**):
  - Atividade no app → **Interações com o app**
  - Dispositivo ou outros IDs → **Dispositivo ou outros IDs** (ID da instalação do Firebase)
  - Local → **Local aproximado** (país/região pelo IP)
- ID de publicidade: **não usa** (permissão `AD_ID` removida).

## Permissões

| Plataforma | Permissão | Uso |
|---|---|---|
| iOS | Câmera (`NSCameraUsageDescription`) | "O Bichu usa a câmera apenas para mostrar animais no seu ambiente. Nenhuma imagem é salva ou enviada." — pedida só ao abrir o AR, depois do aviso de segurança |
| Android | `CAMERA` | só no AR, pedida em tempo de execução depois do aviso de segurança; ARCore opcional |
| Android | bloqueadas | microfone, localização, armazenamento, mídia, contatos, AD_ID, ACCESS_ADSERVICES_AD_ID/ATTRIBUTION/TOPICS |
| Android | `INTERNET` | estatísticas anônimas (Google Analytics) e atualizações do app |

## Antes de enviar para revisão

- ⬜ Confirmar por escrito os direitos das imagens, sons e locuções do Zoo Babies / AnimalSounds (`legacy/ASSET_RIGHTS_CHECKLIST.md`).
