# Privacidade na próxima versão (estatísticas anônimas)

A 1.0.1 publicada não coleta nada e está declarada assim nas lojas. A próxima versão passa a
enviar **estatísticas anônimas** para o nosso Aptabase self-hosted (`src/analytics/`, app
"Bichu", App Key `A-SH-9587199788`), com interruptor em Área dos pais → "Estatísticas
anônimas de uso". **Só troque as declarações e o site quando essa versão for enviada.**

## O que o app envia

- Eventos: `app_open`, `first_open`, `animal_opened`, `animal_first_opened`,
  `challenge_completed` (animal, modelo do desafio, estrelas), `animal_discovered` (uma vez
  por animal) e `heartbeat` (a cada 60 s com o app aberto).
- Dados técnicos: sistema e versão principal, idioma sem país, versão do app, número de
  sessão aleatório só em memória. No servidor: país/estado pelo IP (IP não gravado).
- Nada de ID de aparelho/instalação/usuário, modelo do aparelho ou dado pessoal. Retenção
  de 13 meses. Na web e no Jest não envia nada. O manifesto iOS (`app.config.ts`) já declara
  Product Interaction + Coarse Location.

## Checklist ao enviar

1. **App Store Connect → App Privacy**: Product Interaction e Coarse Location, não ligados,
   sem rastreamento, finalidade Analytics (igual ao Bichos Raros).
2. **Play Console → Segurança dos dados**: Local aproximado e Interações no app (coletados,
   não compartilhados, opcionais, Análise). Se o app usar EAS Update, também Identificadores
   do dispositivo (Funcionalidade do app + Análise).
3. **Site**: `site/privacidade.html` e `site/index.html` **já estão reescritos** no repo
   (seção "Estatísticas anônimas de uso"), mas não publicados. Ao enviar: trocar a data de
   "Última atualização" e publicar a pasta `site/` na Vercel (projeto já linkado em `site/.vercel`).
4. **Notas para o revisor da Apple** (regra 1.3, Kids): sem SDK de terceiros; contagens só
   para o nosso servidor, sem identificadores; os pais podem desligar.
