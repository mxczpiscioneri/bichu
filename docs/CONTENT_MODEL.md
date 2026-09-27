# Modelo de Conteúdo — Bichu

## Objetivo
Uma única entidade `Animal` deve alimentar todas as superfícies do produto.

## Regra editorial
Fatos zoológicos mudam pouco, mas nomes genéricos podem representar muitas espécies. Não inventar precisão.

Exemplos:
- `bear` representa “urso” genericamente, não uma espécie;
- `frog` representa “sapo/rã” de forma genérica;
- `monkey` representa macacos genericamente.

Para esses casos:
- usar fatos amplos;
- marcar `scope: generic`;
- evitar peso/tamanho exato;
- evitar distribuição específica demais;
- não gerar desafio baseado em informação ambígua.

## Campos essenciais
- id;
- nome;
- sílabas;
- mídia;
- classe;
- habitat;
- dieta;
- alimentos;
- locomoção;
- cobertura corporal;
- reprodução;
- período de atividade;
- domesticação;
- conteúdo por nível.

## Taxonomias fechadas
Taxonomias alimentam desafios e filtros.

### diet
- herbivore
- carnivore
- omnivore
- insectivore
- nectar_pollen
- varies

### habitat
- farm
- home
- forest
- savanna
- grassland
- wetland
- freshwater
- ocean
- coast
- desert
- mountains
- urban
- mixed

### locomotion
- walk
- run
- jump
- climb
- swim
- fly
- slither

### bodyCovering
- fur
- feathers
- scales
- skin
- exoskeleton
- wool

### reproduction
- eggs
- live_birth

### class
- mammal
- bird
- reptile
- amphibian
- fish
- insect
- arachnid
- other

## Conteúdo por idade
`preschool` deve caber em áudio curto.
`kids` pode explicar relações causais simples.
`curiosities` é opcional e não deve ser usado como fato fundamental de desafio.

## Revisão
Antes de publicação pública:
- revisão zoológica/pedagógica;
- checagem de linguagem;
- checagem dos áudios;
- validação de direitos de mídia.
