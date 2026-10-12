# Estatísticas anônimas de uso (Google Analytics / Firebase)

O Bichu usa **Google Analytics 4 via Firebase Analytics** (`@react-native-firebase/analytics` 26.4) só para ver
números agregados: usuários totais e ativos, "online agora" (Realtime), toques nos botões principais e quantas
crianças iniciam, concluem ou abandonam cada brincadeira. É um app **Made for Kids** (Apple Kids, 5 anos ou menos;
Google Play Famílias / Aprovado por Professores): nada de dado pessoal, ID de usuário, publicidade ou rastreamento.

## Projeto Firebase / GA4

| Item | Valor |
|---|---|
| Projeto Firebase / GCP | `bichu-techhands` (número 289363210595) |
| App iOS | `1:289363210595:ios:717af3bf12fc2df8002356` (bundle `br.com.techhands.bichu`) |
| App Android | `1:289363210595:android:afeb0550338d1f93002356` (pacote `br.com.techhands.bichu`) |
| Conta GA | "Apps Android" (51289826) |
| Propriedade GA4 | 558491080 |
| Streams | 16108890812 · 16109034541 (iOS / Android; confira o rótulo de cada um em Admin → Data streams) |
| GA no Firebase | https://console.firebase.google.com/project/bichu-techhands/settings/integrations/analytics |

### Arquivos de configuração (versionados)

`GoogleService-Info.plist` (iOS) e `google-services.json` (Android) ficam na **raiz** e **são commitados**: são a
configuração pública do cliente Firebase (ids do projeto e uma chave de API que identifica o projeto, não um
segredo; https://firebase.google.com/docs/projects/api-keys). O `.gitignore` antes os listava junto com as
credenciais; isso foi revertido. As contas de serviço e chaves das lojas continuam fora, em `credentials/`.

O `prebuild` (e o EAS Build) **precisa** desses dois arquivos: o plugin `@react-native-firebase/app` falha se o
caminho em `app.config.ts` (`ios.googleServicesFile` / `android.googleServicesFile`) não existir. **Nenhum
`.easignore` pode excluí-los** (nem `firebase.json`): se um `.easignore` for criado copiando o `.gitignore` antigo,
remova as linhas `google-services.json` e `GoogleService-Info.plist`.

Para baixar de novo: https://console.firebase.google.com/project/bichu-techhands/settings/general → "Seus apps" →
app iOS → **GoogleService-Info.plist**; app Android → **google-services.json**. Substitua na raiz, faça commit e gere
um build novo (não vai por `eas update`).

O plist tem `IS_ANALYTICS_ENABLED = false` mesmo com o GA ligado. **Nada depende dessa chave**: o FirebaseCore lê só
`IS_MEASUREMENT_ENABLED` e as chaves `FIREBASE_ANALYTICS_COLLECTION_*`; o vínculo com a propriedade GA4 é feito no
servidor pelo `GOOGLE_APP_ID` / `mobilesdk_app_id`.

## Configuração no app

### Plugins (`app.config.ts`)

- `@react-native-firebase/app`: copia os dois arquivos, chama `FirebaseApp.configure()` no `AppDelegate` e aplica o
  plugin `com.google.gms.google-services` no Android.
- `@react-native-firebase/analytics` com `{ ios: { withoutAdIdSupport: true } }`: escreve
  `$RNFirebaseAnalyticsWithoutAdIdSupport = true` no Podfile. O RNFB usa então o produto SPM **FirebaseAnalyticsCore**,
  **sem** `GoogleAppMeasurementIdentitySupport` (IDFA/AdSupport) e sem `GoogleAdsOnDeviceConversion`.
- `expo-build-properties` com `ios.useFrameworks = "dynamic"`: o RNFB 26 resolve o SDK da Apple por Swift Package
  Manager, que exige frameworks dinâmicos (https://rnfirebase.io/ios-spm). **Plano B** se o build iOS falhar:
  `['@react-native-firebase/app', { ios: { disableSPM: true } }]` + `useFrameworks: 'static'` +
  `forceStaticLinking: ['RNFBApp', 'RNFBAnalytics']`. Nunca SPM com `static`.
- Os plugins do Firebase vêm **depois** do ViroReact (`@reactvision/react-viro`) e do `./plugins/withChildPrivacy`.
  O plugin do Viro reescreve o Podfile de forma assíncrona; nos prebuilds de verificação (AR ligado e desligado) o
  Podfile final tinha **as duas coisas** (pods do Viro e a flag sem ID de publicidade). Se um dia a flag sumir, o
  build volta a incluir AdSupport: confira sempre (`grep RNFirebaseAnalyticsWithoutAdIdSupport ios/Podfile`).
- `android.blockedPermissions` já removia `AD_ID`, microfone, localização etc.; agora remove também
  `ACCESS_ADSERVICES_AD_ID`, `ACCESS_ADSERVICES_ATTRIBUTION` e `ACCESS_ADSERVICES_TOPICS` (Privacy Sandbox), que o
  `play-services-measurement` pode trazer.
- `ios.privacyManifests`: `NSPrivacyTracking: false`, sem domínios de rastreamento, e
  `NSPrivacyCollectedDataTypes` = Product Interaction, Device ID e Coarse Location, todos **não ligados** à
  identidade, **sem** rastreamento, finalidade Analytics. As `NSPrivacyAccessedAPITypes` do template (UserDefaults
  CA92.1, FileTimestamp C617.1, SystemBootTime 35F9.1) foram repetidas; o Expo faz *merge* com o arquivo do template.
  As frases de propósito do AR (câmera; microfone, fotos e localização "não usados", exigidas pelo binário do Viro,
  ITMS-90683) ficam no `Info.plist` e **não mudaram**.

### `firebase.json` (lido pelo RNFB no build)

| Chave | Valor | Vira (iOS Info.plist / Android meta-data) |
|---|---|---|
| `analytics_auto_collection_enabled` | `true` | `FIREBASE_ANALYTICS_COLLECTION_ENABLED` / `firebase_analytics_collection_enabled` |
| `google_analytics_automatic_screen_reporting_enabled` | `false` | `FirebaseAutomaticScreenReportingEnabled` / `google_analytics_automatic_screen_reporting_enabled` (usamos `screen_view` manual) |
| `google_analytics_adid_collection_enabled` | `false` | Android `google_analytics_adid_collection_enabled` (AAID) |
| `google_analytics_ssaid_collection_enabled` | `false` | Android `google_analytics_ssaid_collection_enabled` (ANDROID_ID) |
| `analytics_idfv_collection_enabled` | `false` | iOS `GOOGLE_ANALYTICS_IDFV_COLLECTION_ENABLED` (IDFV). A chave **não** tem o prefixo `google_` |
| `google_analytics_registration_with_ad_network_enabled` | `false` | iOS `GOOGLE_ANALYTICS_REGISTRATION_WITH_AD_NETWORK_ENABLED` (SKAdNetwork) |
| `analytics_default_allow_analytics_storage` | `true` | `GOOGLE_ANALYTICS_DEFAULT_ALLOW_ANALYTICS_STORAGE` / `google_analytics_default_allow_analytics_storage` |
| `analytics_default_allow_ad_storage` | `false` | `..._AD_STORAGE` / `..._ad_storage` |
| `analytics_default_allow_ad_user_data` | `false` | `..._AD_USER_DATA` / `..._ad_user_data` |
| `analytics_default_allow_ad_personalization_signals` | `false` | `..._AD_PERSONALIZATION_SIGNALS` / `..._ad_personalization_signals` |

Nomes conferidos em `node_modules/@react-native-firebase/app/firebase-schema.json`, `app/ios_config.sh` (fase de
build do pod RNFBApp, roda no `xcodebuild`, não no prebuild) e `analytics/android/build.gradle` +
`AndroidManifest.xml`. No JS, `setConsent` repete o Consent Mode. **Nunca** usar `setUserId`,
`setUserProperty(ies)` nem `initiateOnDeviceConversionMeasurement*`.

## Código (`src/analytics/`)

- `events.ts`: catálogo fechado de eventos e de botões (`BUTTON_NAMES`); `sanitizeParams` só deixa passar números e
  ids `[a-z0-9_]{1,40}` (nada de texto livre).
- `screens.ts`: rota do Expo Router (padrão, ex. `animal/[id]`) → nome fixo da tela. Nunca usa a URL, então nenhum
  id entra no nome da tela; rotas fora da lista não são enviadas.
- `index.ts`: `track(evento, params)`, `trackScreen(nome)`, `setAnalyticsEnabled(bool)`. Até o save carregar, até 20
  eventos esperam numa fila; se os pais desligaram, a fila é descartada.
- `backend.native.ts`: carrega o RNFB só se `NativeRNFBTurboApp` e `NativeRNFBTurboAnalytics` existirem. No Expo Go,
  no Jest e num binário antigo sem Firebase que receba este JS por `eas update`, vira no-op. `backend.ts` (web) é
  sempre no-op.
- `app/_layout.tsx`: `app_open` uma vez por abertura, `screen_view` a cada troca de rota (`useSegments`) e
  sincronização do interruptor com `setAnalyticsCollectionEnabled` depois que o save carregou. O Firebase guarda essa
  escolha no aparelho entre aberturas.
- Interruptor **"Estatísticas anônimas de uso"** na Área dos pais (`app/parents.tsx`, atrás do parent gate),
  `settings.analyticsEnabled` no zustand/AsyncStorage, padrão **ligado**. Saves antigos ganham o padrão pelo `merge`
  do store (teste em `src/stores/__tests__/settingsStore.test.ts`).

### Eventos

"Fase" no Bichu = uma **brincadeira** (sessão de 3 a 5 rodadas): `level_id` é o tipo de desafio (template) quando a
criança escolhe uma brincadeira, ou `animal` quando toca em "Brincar" na página de um animal (com `animal_id`).

| Evento | Parâmetros | Onde |
|---|---|---|
| `first_open`, `session_start`, `user_engagement` | automáticos do GA (usuários ativos e Realtime) | SDK |
| `app_open` | nenhum | `app/_layout.tsx`, uma vez por abertura |
| `screen_view` | `screen_name` ∈ `Home`, `Explore`, `Play`, `Collection`, `Animal`, `Challenge`, `Ar`, `Parents`, `Credits`, `Welcome`, `ChooseLevel`, `NotFound` | `app/_layout.tsx` |
| `level_start` | `level_id` (`sound_to_animal`, `food`, `habitat`, `locomotion`, `body_covering`, `reproduction`, `class`, `animal`), `mode` (`explorer`/`adventurer`), `surface` (`screen`/`ar`), `animal_id`?, `rounds` | `useChallengeSession` (também em "Brincar de novo") |
| `level_complete` | mesmos + `rounds`, `stars` (estrelas novas), `mistakes` (escolhas erradas na sessão), `discovered` (animais novos na Bichupédia) | `useChallengeSession`, ao terminar a última rodada |
| `level_quit` | mesmos + `round` (rodada em que saiu, 1 = primeira) | `useChallengeSession`, ao sair antes do fim (botão fechar, voltar do Android, sair do AR) |
| `level_retry` | `level_id`, `mode`, `surface`, `animal_id`? | "Brincar de novo" no resumo |
| `animal_view` | `animal_id` | página do animal |
| `animal_discovered` | `animal_id`, `discovered_total` (descobertos neste aparelho) | `progressStore.record`, uma vez por animal |
| `mode_selected` | `mode` | "Modo padrão" (`app/choose-level.tsx`) |
| `ar_start` | `animal_id` | AR iniciado (aviso aceito, aparelho compatível, câmera permitida) |
| `ar_animal_placed` | `animal_id` | animal colocado numa superfície (uma vez por sessão de AR) |
| `ar_unavailable` | `reason` (`unsupported`, `denied`, `test`) | tela "AR indisponível" |
| `button_click` | `button` ∈ `welcome_start`, `open_parents`, `home_animal_of_day`, `home_game_shortcut`, `home_place_shortcut`, `home_collection`, `animal_play`, `animal_ar`, `challenge_close`, `result_again`, `result_back`, `ar_safety_continue`, `ar_safety_back`, `ar_challenge`, `parents_choose_mode`, `parents_credits`, `parents_privacy_policy`, `parents_reset_progress` | telas |

Não contamos toques de alta frequência (cada escolha, arraste, botão de som), gestos, posições nem tempo por toque.
A troca de abas aparece como `screen_view`.

Relatórios (Explorations): "quantos chegam / concluem cada brincadeira" = usuários com `level_start` /
`level_complete` por `level_id`; "onde desistem" = `level_quit` por `level_id` e `round`; "animais favoritos" =
`animal_view` e `animal_discovered` por `animal_id`. Para isso registre as **custom definitions** abaixo.

Para depurar: DebugView do Firebase (iOS: argumento `-FIRDebugEnabled` no esquema do Xcode, desfazer com
`-FIRDebugDisabled`; Android: `adb shell setprop debug.firebase.analytics.app br.com.techhands.bichu`, desfazer com
`adb shell setprop debug.firebase.analytics.app .none.`). Exige development build; no Expo Go nada é enviado (só o
log `[analytics]` no console em dev).

### Checklist manual (development build)

- [ ] `app_open` uma vez por abertura; `screen_view` com o nome certo a cada tela (incluindo o modal da Área dos pais).
- [ ] Cada evento aparece com exatamente os parâmetros da tabela (sem extras, sem texto livre).
- [ ] `level_start` → `level_complete` numa brincadeira inteira; `level_quit` ao fechar no meio; `level_retry` +
  `level_start` em "Brincar de novo"; `surface: ar` no desafio do AR.
- [ ] Desligar o interruptor → nenhum evento novo no DebugView (nem depois de reabrir o app); religar volta a enviar.
- [ ] Save antigo (sem `analyticsEnabled`) abre com o interruptor ligado.
- [ ] Expo Go (`npx expo start`) abre sem erro.
- [ ] No DebugView, nenhum `user_id` e nenhuma user property nossa.

## O que o Google Analytics coleta sozinho

Mesmo sem nada nosso, o SDK coleta (https://support.google.com/analytics/answer/11582702,
https://support.google.com/analytics/answer/10285841, https://support.google.com/analytics/answer/9234069):

- um **app-instance ID** aleatório por instalação (não é IDFA/AAID; some ao desinstalar), que continua existindo com
  tudo acima desligado;
- localização **aproximada** derivada do IP (o GA4 não guarda o IP);
- eventos de ciclo de vida (`first_open`, `session_start`, `user_engagement`, `app_update`, `os_update`,
  `app_remove` no Android) e dados do aparelho (modelo, SO, idioma, versão do app).

Tudo vai criptografado (TLS).

## Configurações no console (dono)

Já aplicado na propriedade 558491080: Google signals **desligado**; Granular location and device data collection
**desligado**; personalização de anúncios **0 de 307 regiões**; retenção de **2 meses** para eventos e usuários.

Falta conferir/fazer (https://analytics.google.com → Admin):

1. Data retention: "Reset user data on new activity" **desligado**.
2. Product links: **nenhum** vínculo (Google Ads, AdSense, Ad Manager, DV360, SA360, Merchant Center, BigQuery).
3. Account settings → Data sharing settings: tudo **desligado**.
4. Data display → Custom definitions: dimensões de evento `level_id`, `mode`, `surface`, `animal_id`, `button`,
   `reason`; métricas de evento `rounds`, `stars`, `mistakes`, `discovered`, `round`, `discovered_total`.
5. Opcional: https://console.cloud.google.com/apis/credentials?project=bichu-techhands → restringir as chaves de API
   iOS/Android ao bundle/pacote e às APIs do Firebase.

## Lojas

Atualize as duas declarações **antes** de enviar o primeiro build com Firebase (hoje estão "Data Not Collected" /
"não coleta").

### App Store Connect → App Privacy

"Do you or your third-party partners collect data from this app?" → **Yes**.

| Tipo | Ligado à identidade | Usado para rastreamento | Finalidade |
|---|---|---|---|
| Usage Data → **Product Interaction** | Não | Não | **Analytics** |
| Identifiers → **Device ID** (ID aleatório da instalação do Firebase, não o IDFA) | Não | Não | **Analytics** |
| Location → **Coarse Location** (país/região pelo IP) | Não | Não | **Analytics** |

Todo o resto: **não coletado** — Contact Info, Health & Fitness, Financial Info, Precise Location, Sensitive Info,
Contacts, User Content (inclusive Photos or Videos e Audio Data: a câmera do AR não grava nada), Browsing History,
Search History, User ID, Purchases, Diagnostics (não há Crashlytics) e Other Data.

### Play Console → Segurança dos dados

- O app coleta ou compartilha algum dos tipos de dados exigidos? **Sim**.
- Todos os dados coletados são criptografados em trânsito? **Sim**.
- Vocês oferecem uma forma de os usuários pedirem a exclusão dos dados? Não há conta. Use o campo de explicação: "Não
  há conta nem dado pessoal. Os pais podem desligar as estatísticas na Área dos pais (Estatísticas anônimas de uso);
  ao desinstalar o app, o identificador da instalação é apagado e o Google apaga os dados restantes em até 2 meses."
- Tipos de dados (cada um: **coletado**, **não compartilhado**, **não** processado de forma efêmera, **opcional** —
  o usuário pode desligar —, finalidade **Análise**):
  - Atividade no app → **Interações com o app**
  - Dispositivo ou outros IDs → **Dispositivo ou outros IDs**
  - Local → **Local aproximado**
- Nada em: Local exato, Informações pessoais, Financeiro, Saúde, Mensagens, Fotos e vídeos, Áudio, Arquivos, Agenda,
  Contatos, Histórico de navegação, Informações e desempenho do app (sem relatórios de falha).
- Declaração de ID de publicidade: **o app não usa ID de publicidade** (a permissão `AD_ID` é removida).

### Notas para o revisor (Apple e Google)

> Analytics: usamos Firebase Analytics só para contagens anônimas e agregadas (brincadeiras iniciadas/concluídas,
> animais descobertos, toques em botões). O app é compilado SEM AdSupport/IDFA (FirebaseAnalyticsCore, sem
> IdentitySupport), com a coleta de IDFV desligada, consentimento de anúncios negado, sem ID de usuário e sem dados
> pessoais. Os pais podem desligar em Área dos pais → "Estatísticas anônimas de uso".

Textos das lojas: `store/LISTING.md`. Site: `site/privacidade.html` (seção 3), `site/termos.html`, `site/index.html`.

## Regras das lojas para apps infantis e riscos

- **Apple 1.3 / 5.1.4 (Kids)**: analytics de terceiros só "in limited cases", sem IDFA nem "any identifiable
  information about children ... their location, or their devices", incluindo "device, network, or other information
  that could be used directly or combined with other information to identify users and their devices". O GA ainda
  envia o app-instance ID, modelo/SO e país pelo IP: **a revisão pode recusar**.
- **Google Play Famílias**: proíbe AAID, SIM/Build Serial, BSSID, MAC, SSID, IMEI, IMSI, `AD_ID`, localização precisa
  e SDKs "not approved for use in primarily child-directed services"
  (https://support.google.com/googleplay/android-developer/answer/9893335). Confirme o Firebase Analytics no Play SDK
  Index (Families self-certified) antes de manter o selo Famílias / Aprovado por Professores.
- **Plano B se recusarem**: padrão **desligado** (`analyticsEnabled: false` no `settingsStore` e
  `"analytics_auto_collection_enabled": false` no `firebase.json`), ligando só quando os pais ativarem; os textos
  passam a dizer "desligado por padrão". Último recurso: remover o Firebase do build.
