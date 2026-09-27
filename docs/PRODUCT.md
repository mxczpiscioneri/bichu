# Especificação de Produto — Bichu

## 1. Resumo executivo

**Bichu** é um aplicativo infantil de descoberta do mundo animal. A proposta é começar no nível mais simples — reconhecer uma imagem, ouvir o som e aprender o nome do animal — e crescer em profundidade conforme a criança evolui.

O produto nasce da experiência prévia do Zoo Babies / AnimalSounds, que já possuía um acervo de imagens, sons reais, locução de nomes e minigames. O novo Bichu reorganiza esse legado em torno de uma base estruturada de conhecimento e de um motor de experiências reutilizáveis.

O diferencial conceitual não é “ter AR”. A realidade aumentada é uma camada de encantamento sobre um produto que deve funcionar muito bem sem ela.

**Tese central:** uma única base estruturada de animais pode alimentar aprendizagem, áudio, desafios, coleção, comparação e AR, permitindo que o app cresça em conteúdo sem exigir experiências customizadas para cada animal.

---

## 2. Proposta de valor

### Para a criança
Descobrir animais brincando: ouvir, reconhecer, comparar, responder desafios e, quando disponível, trazer o animal para o ambiente real em AR.

### Para pais e responsáveis
Um app simples, visual e educativo, com conteúdo progressivo, sem exigir que a criança saiba ler e com potencial para continuar relevante por vários anos.

### Promessa da marca
**Um app que cresce com a criança enquanto ela descobre o mundo animal.**

### Tagline
**Descubra o mundo animal.**

---

## 3. Público

### Primário
Crianças aproximadamente de 2 a 8 anos.

### Faixas de experiência

#### Explorador — aproximadamente 2 a 4 anos
- foco em reconhecimento;
- nome;
- silabação;
- som real;
- imagem;
- associações simples;
- duas opções em desafios;
- instruções preferencialmente narradas.

#### Aventureiro — aproximadamente 5 a 8 anos
- habitat;
- alimentação;
- classe do animal;
- locomoção;
- reprodução;
- cobertura corporal;
- comparações;
- três ou quatro alternativas;
- curiosidades e explicações curtas.

As idades são referências de UX, não rótulos rígidos. O produto deve permitir configurar dificuldade sem expor necessariamente “idade” para a criança.

---

## 4. Princípios do produto

1. **Áudio primeiro para os menores.** A experiência deve funcionar sem leitura.
2. **AR é bônus, não fundação.**
3. **Um animal é conteúdo, não uma tela.** A mesma entidade alimenta todas as experiências.
4. **Data-driven.** Novos animais devem exigir principalmente cadastro de conteúdo e assets.
5. **Poucas mecânicas, muito reaproveitamento.**
6. **Interações grandes e tolerantes.** Alvos pequenos não são adequados ao público.
7. **Sem depender de animação 3D específica.**
8. **Baixa fricção.** O MVP não precisa de conta.
9. **Offline por padrão para o núcleo.**
10. **Sem IA como requisito de valor.** IA pode ser adicionada depois, por exemplo em voz, mas não deve ser o motor pedagógico inicial.
11. **Conteúdo confiável.** Fatos devem ser estruturados e revisáveis.
12. **Privacidade infantil desde o desenho.**

---

## 5. Identidade do produto

### Nome
**Bichu**

Curto, pronunciável por crianças, brasileiro e amplo o suficiente para não limitar o produto a sons, bebês, zoológico ou realidade aumentada.

### Mascote
**Bichu, Guardião da Floresta**

Criatura fantástica original, simpática e ligada à natureza. O imaginário pode lembrar guardiões da mata brasileira e a energia do folclore nacional, mas o personagem não deve ser uma cópia ou representação literal de personagem folclórico existente.

Funções do mascote:
- onboarding;
- feedback positivo;
- feedback de tentativa;
- carregamento;
- guia de missões;
- coleções;
- conteúdo institucional;
- social media;
- futuro merchandising.

---

## 6. Arquitetura da experiência

O produto se organiza em quatro pilares:

### Explorar
Descoberta livre de animais.

Cada animal pode apresentar:
- imagem;
- nome;
- áudio do nome;
- silabação na locução;
- som real;
- categoria;
- habitat;
- alimentação;
- locomoção;
- reprodução;
- cobertura corporal;
- curiosidades;
- comparação de tamanho;
- “ver no meu mundo” quando houver asset 3D.

### Brincar
Desafios gerados a partir da base estruturada:
- Que animal é esse pelo som?
- O que ele come?
- Onde ele vive?
- Como ele se movimenta?
- Tem pelo, penas, pele ou escamas?
- Nasce de ovo?
- É mamífero, ave, réptil etc.?
- Qual destes animais é maior?
- Quem vive aqui?
- Leve o alimento ao animal correto.

### Ver em AR
Animal inserido no ambiente usando ARKit/ARCore.

A criança:
1. aponta o aparelho para uma superfície;
2. posiciona o animal;
3. observa em 3D;
4. ouve nome/som;
5. completa desafios usando elementos flutuantes ou slots próximos ao animal.

O animal não precisa “comer” ou executar uma animação especial. O gameplay acontece na camada de UI/AR ao redor dele.

### Bichupédia
Coleção dos animais descobertos.

Pode ser organizada por:
- fazenda;
- savana;
- floresta;
- oceano;
- regiões polares;
- animais brasileiros;
- aves;
- mamíferos;
- répteis;
- anfíbios;
- futuros pacotes temáticos.

---

## 7. Loop principal

1. Criança escolhe ou recebe sugestão de animal.
2. O app apresenta o animal.
3. Toca a locução do nome.
4. Oferece o som real.
5. Apresenta 1–3 informações adequadas ao nível.
6. Entrega um desafio curto.
7. Acerto gera feedback visual e sonoro.
8. Ao completar o conjunto mínimo de desafios, o animal entra na coleção.
9. Sugere próximo animal.

O loop deve ter sessões curtas: 1 a 5 minutos por animal.

---

## 8. Tela inicial

Objetivo: não repetir a antiga home com muitos ícones de minigames.

Estrutura sugerida:
- saudação do Bichu;
- “Animal do dia”;
- “Continue explorando”;
- progresso de uma coleção;
- quatro destinos principais:
  - Explorar;
  - Brincar;
  - Ver em AR;
  - Bichupédia.

A home deve ter pouco texto e alto apelo visual.

---

## 9. Tela do animal

Exemplo: Leão.

Componentes:
- imagem/ilustração;
- nome grande;
- botão de ouvir nome;
- botão de ouvir som;
- chips simples: mamífero, carnívoro, savana;
- curiosidade curta;
- botão “Brincar”;
- botão “Ver no meu mundo” quando houver AR;
- progresso de descoberta.

Para criança pequena, conteúdo textual pode ficar oculto ou ser narrado.

---

## 10. Sistema de desafios

O objetivo é evitar criar gameplay específico por animal.

### Mecânica base
- uma pergunta;
- 2 a 4 alternativas;
- toque ou drag-and-drop;
- área alvo grande;
- resposta correta “encaixa”;
- resposta errada retorna suavemente;
- feedback do Bichu;
- uma frase curta de aprendizado após a resposta.

### Tipos prioritários do MVP
1. Som → animal.
2. Alimentação.
3. Habitat.
4. Locomoção.
5. Cobertura corporal.

### Evoluções
- reprodução;
- classe;
- comparação;
- continente/região;
- animal → som;
- cenário → animais compatíveis;
- montagem simplificada de habitat.

---

## 11. “Montar o habitat”

Mecânica futura de alto potencial.

Exemplo:
“Ajude o leão a montar seu lar.”

Itens:
- capim;
- árvore;
- água;
- gelo;
- coral.

A criança escolhe/arrasta os elementos coerentes. O ambiente é composto visualmente ao redor do animal.

A mesma engine atende vários animais sem exigir animação específica do modelo 3D.

---

## 12. Progressão

### Unidade básica
**Descoberta de animal**

Exemplo:
- ouviu o nome;
- ouviu o som;
- concluiu 2 desafios;
- animal descoberto.

### Recompensas
- estrelas;
- selo do animal;
- progresso de coleção;
- novas regiões;
- itens cosméticos do mascote em versões futuras.

Evitar moedas complexas no MVP.

---

## 13. Bichupédia

Objetivos:
- gerar sensação de coleção;
- estimular retorno;
- mostrar progresso;
- dar significado aos desafios.

Estados:
- desconhecido;
- encontrado;
- descoberto;
- mestre (futuro).

Exemplo:
**Savana 7/12**
**Fazenda 10/10**
**Oceano 4/15**

---

## 14. Conteúdo progressivo

Cada Animal possui conteúdo em níveis.

### `preschool`
Frases de uma ideia:
- “O leão é um grande felino.”
- “Ele gosta de carne.”
- “Ele vive em lugares quentes e abertos.”

### `kids`
Explicações curtas:
- vida em grupo;
- habitat;
- dieta;
- comportamento;
- adaptações.

### `curiosities`
Fatos opcionais, curtos e memoráveis.

O mesmo conteúdo estruturado deve poder ser renderizado como:
- texto;
- narração futura;
- quiz;
- comparativo;
- cards.

---

## 15. Realidade aumentada

### Objetivo
Encantamento e percepção espacial.

### MVP de AR
- encontrar plano horizontal;
- posicionar 1 animal;
- rotacionar/ajustar escala;
- ouvir som;
- exibir nome;
- executar um desafio próximo ao animal.

### Não necessário no MVP
- animal caminhar;
- física;
- animação de alimentação;
- reconhecimento de objetos;
- geolocalização estilo Pokémon Go;
- multiplayer;
- mundo persistente.

### Modelos
O produto deve aceitar:
- estático;
- idle;
- animado.

Animação é melhoria, não requisito.

---

## 16. Papel do legado Zoo Babies

O legado fornece:
- 22 animais;
- 22 imagens;
- 22 sons;
- 22 locuções de nome;
- conceito validado de “Que animal é esse?”;
- memória;
- material adicional de minigames.

### Reaproveitar
- conteúdo e assets com direitos confirmados;
- conceitos de jogos;
- package/listagem existente, se estrategicamente vantajoso.

### Reescrever
- UI;
- navegação;
- arquitetura;
- gameplay;
- analytics;
- armazenamento;
- AR.

---

## 17. Área dos pais

Não é necessária na primeira versão interna, mas deve existir no produto público.

Funções futuras:
- configurar nível;
- áudio ligado/desligado;
- tempo de uso;
- progresso;
- restaurar compra;
- política de privacidade;
- informações de conteúdo;
- controle de downloads.

A entrada pode usar um “parent gate” para impedir acesso acidental da criança.

---

## 18. Privacidade e público infantil

Princípios:
- evitar coleta desnecessária;
- sem publicidade comportamental;
- não exigir nome real da criança;
- não armazenar câmera de AR;
- câmera usada apenas para renderização AR, salvo consentimento futuro explícito;
- analytics mínimos e agregados;
- nenhum microfone necessário no MVP;
- nenhuma comunicação aberta entre usuários.

Antes de publicação, validar requisitos de Google Play Families e App Store Kids Category aplicáveis à versão distribuída.

---

## 19. Monetização — hipótese, ainda não validada

Não definir monetização como fato antes de testar comportamento e intenção de pagamento.

Hipóteses:
- app gratuito com conjunto inicial + compra única de coleção completa;
- assinatura familiar barata para conteúdo contínuo;
- pacotes temáticos;
- B2B futuro para escolas/educadores.

Evitar ads no produto infantil como estratégia central.

---

## 20. Métricas de validação

Antes de investir em grande biblioteca 3D, medir:

- criança escolhe espontaneamente outro animal?
- completa mais de um desafio?
- retorna no dia seguinte?
- volta para a coleção?
- usa áudio do nome?
- AR aumenta retenção ou apenas gera “wow” de primeira sessão?
- pais entendem o valor educacional?
- pais pagariam por mais conteúdo?

Eventos mínimos:
- animal_opened;
- name_audio_played;
- animal_sound_played;
- challenge_started;
- challenge_answered;
- challenge_completed;
- animal_discovered;
- collection_opened;
- ar_opened;
- ar_animal_placed.

---

## 21. MVP recomendado

### Fase 0 — Conteúdo + gameplay
- React Native novo;
- 22 animais legados;
- imagens e áudios;
- Explorar;
- Nome;
- Som;
- “Que animal é esse?”;
- alimentação;
- habitat;
- locomoção;
- Bichupédia simples;
- progresso local.

### Fase 1 — AR spike
- 1 animal 3D;
- posicionamento;
- som;
- 1 desafio.

### Fase 2 — AR coleção
- 5 animais 3D;
- desafios;
- escala e rotação;
- comparação visual.

### Fase 3 — Produto público
- onboarding;
- parental gate;
- conteúdo revisado;
- analytics compatível com público infantil;
- polish;
- monetização testada.

---

## 22. Não objetivos iniciais

- backend complexo;
- login;
- social;
- chat aberto;
- LLM;
- voz bidirecional;
- marketplace;
- dezenas de animações únicas;
- mundo AR persistente;
- geolocalização.

---

## 23. Hipótese mais arriscada

Não é técnica.

A principal hipótese é:
**depois do encantamento inicial, a combinação de descoberta + desafios + coleção é suficiente para gerar retorno recorrente?**

O experimento barato é colocar a versão com 5–10 animais nas mãos de crianças de diferentes idades e medir retorno e repetição de sessões antes de investir em muitos modelos 3D.

---

## 24. Critério de sucesso inicial

Avançar para biblioteca AR maior somente se:
- crianças voluntariamente escolhem continuar;
- há repetição de sessão;
- a coleção é compreendida;
- desafios não dependem de ajuda constante do adulto;
- AR adiciona valor observável à sessão.

