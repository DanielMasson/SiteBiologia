# Parte 2: Dados, Ficha de Doença e Lista de Verminoses

> Instrução detalhada para a IA. Esta parte cobre os itens 5, 6 e 7 da "Ordem de construção" do `planejamento-site.md`.
> **Pré-requisito:** a Parte 1 (`instrucoes-parte-1-base-e-inicio.md`) deve estar concluída e aprovada pela equipe.
> Leia também a seção 8 (modelo de dados) e a seção 10 (regras de conteúdo científico) do `planejamento-site.md`. Elas continuam valendo.
> Não construa nada das partes seguintes (Platelmintos, Nematelmintos, Prevenção, Galeria, Sobre, QR Codes).

---

## 0. O que esta parte entrega

1. `data/doencas.json` com **2 fichas de exemplo** (uma de cada filo), validando o esquema.
2. `doenca.html` + `assets/js/doenca.js`: ficha individual gerada a partir do JSON, via `doenca.html?id=<id>`.
3. `verminoses.html` + `assets/js/verminoses.js`: lista de cards gerada do JSON, com filtro por filo.
4. Novos componentes de CSS necessários para essas páginas (em `components.css`).
5. Tratamento de erros: `id` inválido, JSON que não carrega, JavaScript desativado.

Ao final, a equipe deve conseguir **adicionar uma doença nova editando só o `doencas.json`**, sem mexer em HTML ou JavaScript.

---

## 1. Ajustes ao esquema de dados (leia antes de codar)

O esquema da seção 8 do `planejamento-site.md` continua valendo, com **duas alterações** que esta parte introduz e que a IA deve registrar no `README.md`:

| Alteração | Motivo |
|---|---|
| Novo campo `statusConteudo` (`"rascunho"` ou `"validado"`) | Permite publicar o site de teste sem fingir que o texto já foi revisado pela equipe. Fichas em rascunho mostram um aviso visível. |
| Valores de texto podem ser `"A_PREENCHER"` | Marca o que ainda falta. O site deve exibir esses campos de forma visível (ver seção 5.4). |

Também ficam definidas estas regras de consistência:
- Os `id` das fichas seguem **exatamente** a lista da seção 10 do planejamento (ex.: `teniase-cisticercose`, `ascaridiase`). Usar só letras minúsculas, números e hífen, sem acentos.
- `hospedeiroIntermediario` é `null` quando a doença não tem hospedeiro intermediário. O site deve **omitir** essa linha do quadro rápido nesse caso (e não mostrar "null").
- `agentes` é sempre uma lista, mesmo com um só agente.
- `referencias` é uma lista de ids que apontam para `data/referencias.json`.

---

## 2. Passo 1: `data/doencas.json` com 2 fichas de exemplo

### 2.1 Regra de ouro

**A IA não deve escrever de memória os textos científicos de transmissão, ciclo, sintomas e prevenção.** Esses campos entram como `"A_PREENCHER"` (ou lista com um único item `"A_PREENCHER"`), com `statusConteudo: "rascunho"`. A equipe de conteúdo preenche com base em fontes confiáveis e depois muda para `"validado"`.

Podem ser preenchidos pela IA apenas os dados **estruturais e básicos** abaixo (nome, agente, classificação e hospedeiros), por serem amplamente estabelecidos. A equipe deve conferir também esses campos.

### 2.2 Conteúdo inicial do arquivo

```json
[
  {
    "id": "teniase-cisticercose",
    "statusConteudo": "rascunho",
    "nomePopular": "Teníase e cisticercose",
    "agentes": ["Taenia solium", "Taenia saginata"],
    "filo": "Platyhelminthes",
    "classe": "Cestoda",
    "resumo": "A_PREENCHER",
    "hospedeiroDefinitivo": "Ser humano",
    "hospedeiroIntermediario": "A_PREENCHER",
    "transmissao": "A_PREENCHER",
    "cicloDeVida": ["A_PREENCHER"],
    "imagemCiclo": null,
    "sintomas": ["A_PREENCHER"],
    "prevencao": ["A_PREENCHER"],
    "referencias": []
  },
  {
    "id": "ascaridiase",
    "statusConteudo": "rascunho",
    "nomePopular": "Ascaridíase",
    "agentes": ["Ascaris lumbricoides"],
    "filo": "Nematoda",
    "classe": null,
    "resumo": "A_PREENCHER",
    "hospedeiroDefinitivo": "Ser humano",
    "hospedeiroIntermediario": null,
    "transmissao": "A_PREENCHER",
    "cicloDeVida": ["A_PREENCHER"],
    "imagemCiclo": null,
    "sintomas": ["A_PREENCHER"],
    "prevencao": ["A_PREENCHER"],
    "referencias": []
  }
]
```

Observações:
- O campo `filo` guarda o nome científico (`Platyhelminthes`, `Nematoda`). O site exibe os nomes populares "Platelmintos" e "Nematelmintos" por meio de um **mapa de nomes** em `assets/js/main.js` ou em um módulo próprio (`nomesFilos = { Platyhelminthes: "Platelmintos", Nematoda: "Nematelmintos" }`).
- `classe` pode ser `null` (nematódeos não usam classe neste projeto). O site omite a linha quando for `null`.
- `imagemCiclo: null` significa "ainda sem esquema". O site mostra um espaço reservado (ver 5.3).
- `referencias: []` vazio é válido. O site mostra a mensagem de referências pendentes.

---

## 3. Passo 2: Funções utilitárias (em `main.js` ou `assets/js/utils.js`)

Criar funções pequenas e reutilizáveis por `doenca.js` e `verminoses.js`. Se criar `utils.js`, carregar antes dos demais scripts, com `defer`.

| Função | Descrição |
|---|---|
| `carregarJSON(caminho)` | Faz `fetch`, verifica `response.ok`, retorna o JSON. Em caso de falha, lança erro com mensagem clara. |
| `criarElemento(tag, opcoes)` | Cria um elemento com `classe`, `texto` e atributos, **usando `textContent`** (nunca `innerHTML` com dados do JSON). |
| `nomeFilo(filoCientifico)` | Retorna "Platelmintos" ou "Nematelmintos" a partir do mapa de nomes. Se o valor for desconhecido, retorna o próprio texto. |
| `ehPendente(valor)` | Retorna `true` se o valor for `"A_PREENCHER"`, vazio, ou lista só com `"A_PREENCHER"`. |
| `validarDoenca(obj)` | Confere se os campos obrigatórios existem e tem o tipo certo. Retorna lista de problemas. Usar para `console.warn` durante o desenvolvimento, sem quebrar a página. |

**Regras de segurança e robustez:**
- Dados do JSON entram na página **somente** via `textContent` ou atributos controlados. Nunca montar HTML concatenando strings com dados do JSON.
- Para itálico nos nomes científicos, criar elementos `<em>` por código.
- O caminho do JSON é **relativo** (`data/doencas.json`).

---

## 4. Passo 3: `verminoses.html` + `verminoses.js` (lista)

### 4.1 Estrutura do HTML

Dentro de `<main id="conteudo">`:

1. `h1`: "Verminoses".
2. Parágrafo introdutório curto (1 a 2 frases) explicando que cada card leva a uma ficha com agente, transmissão, sintomas e prevenção.
3. **Filtro por filo** (ver 4.2).
4. Texto de status para leitores de tela: `<p id="resultado-filtro" class="sr-only" aria-live="polite"></p>`.
5. Contêiner da lista: `<div id="lista-doencas" class="grade grade--3"></div>`.
6. Bloco de mensagens (carregando/erro), ver 6.

### 4.2 Filtro por filo

Grupo de três botões, em um `div` com `role="group"` e `aria-label="Filtrar por grupo"`:

- **Todos** (padrão, ativo)
- **Platelmintos**
- **Nematelmintos**

Regras:
- Cada botão usa `aria-pressed="true"` ou `"false"`. Apenas um fica `true`.
- Ao filtrar, atualizar `#resultado-filtro` com o texto "Mostrando N doenças" (singular quando N = 1), para leitores de tela.
- Se o filtro resultar em zero cards, mostrar a mensagem "Nenhuma doença cadastrada neste grupo ainda."
- Salvar o filtro na URL (`verminoses.html?grupo=platelmintos`), para que o link possa ser compartilhado e o botão Voltar funcione. Valores aceitos: `platelmintos`, `nematelmintos`. Valor ausente ou inválido equivale a "todos".
- Os botões devem ter alvo de toque mínimo de 44×44 px.

### 4.3 Estrutura do card de doença

Cada card é **um link inteiro** para `doenca.html?id=<id>`:

```html
<a class="card card--link" href="doenca.html?id=teniase-cisticercose">
  <span class="etiqueta">Platelmintos</span>
  <h2 class="card__titulo">Teníase e cisticercose</h2>
  <p class="card__texto"><em>Taenia solium</em>, <em>Taenia saginata</em></p>
  <span class="card__acao">Ver ficha</span>
</a>
```

Regras:
- O título do card é um `h2` (a página tem um único `h1`).
- Se a ficha estiver em rascunho, adicionar uma etiqueta extra "Em revisão" (`.etiqueta--rascunho`).
- Ordenar os cards pelo nome popular (`localeCompare` com `"pt-BR"`), mantendo a ordem estável.
- Não mostrar o `resumo` no card se for `A_PREENCHER`.

---

## 5. Passo 4: `doenca.html` + `doenca.js` (ficha individual)

### 5.1 Fluxo do script

1. Ler o parâmetro `id` com `new URLSearchParams(location.search).get("id")`.
2. Se não houver `id`: mostrar o estado de erro "ficha não informada" (seção 6) e parar.
3. Carregar `data/doencas.json` e, em paralelo, `data/referencias.json`.
4. Procurar a doença pelo `id`. Se não existir: mostrar o estado de erro "ficha não encontrada" (seção 6) e parar.
5. Rodar `validarDoenca` e registrar avisos no console (sem interromper).
6. Atualizar `document.title` para `"<nomePopular> | Vermes que Importam"` e a meta `description` com o `resumo` (se não for pendente).
7. Renderizar a ficha (5.2 e 5.3).
8. Calcular e renderizar a navegação anterior/próxima (5.5).
9. Mover o foco para o `h1` da ficha (com `tabindex="-1"`), para leitores de tela perceberem o conteúdo carregado.

### 5.2 Estrutura da ficha (ordem fixa)

A ficha usa o `h1` com o nome popular. Cada seção abaixo vira um `section` com `h2`, **nesta ordem**:

| # | Seção | Conteúdo |
|---|---|---|
| 1 | Cabeçalho da ficha | `h1` (nome popular), nomes científicos dos agentes em `<em>`, etiqueta do filo (e da classe, se houver), aviso de rascunho (se `statusConteudo` for `"rascunho"`) |
| 2 | Resumo | Parágrafo curto (2 a 3 linhas) |
| 3 | Quadro rápido | Lista de definição `<dl>` (ver 5.2.1) |
| 4 | Ciclo de vida | Esquema (SVG) + passos numerados (ver 5.3) |
| 5 | Como se pega (transmissão) | Parágrafo(s) |
| 6 | Sintomas comuns | Lista `<ul>` |
| 7 | Prevenção | Lista `<ul>` |
| 8 | Alerta de saúde | Componente `.alerta-saude` (texto fixo, ver 5.2.2) |
| 9 | Referências | Lista de referências da ficha (ver 5.2.3) |
| 10 | Navegação | Ficha anterior / próxima + link "Voltar para todas as verminoses" |

#### 5.2.1 Quadro rápido (`<dl>`)

Linhas (cada uma com `dt` e `dd`), exibidas **somente se houver valor**:
- Grupo (filo, em nome popular)
- Classe (omitir se `null`)
- Hospedeiro definitivo
- Hospedeiro intermediário (omitir se `null`)
- Forma de transmissão (versão curta, só se o campo `transmissao` não for pendente; caso contrário omitir aqui)

Valores `A_PREENCHER` seguem a regra 5.4.

#### 5.2.2 Alerta de saúde (texto fixo)

*"Conteúdo educativo. Não substitui avaliação médica. Em caso de sintomas, procure uma unidade de saúde."*

Usar `role="note"`. Este texto aparece em **todas** as fichas, independentemente do status.

#### 5.2.3 Referências

- Para cada id em `referencias`, procurar em `referencias.json` e mostrar: título, instituição, ano e link (`target="_blank"` com `rel="noopener noreferrer"`).
- Ids que não existirem no arquivo: ignorar e registrar `console.warn`.
- Lista vazia: mostrar "Referências desta ficha serão adicionadas após a revisão da equipe."

### 5.3 Ciclo de vida

- Os passos de `cicloDeVida` aparecem em uma **lista ordenada** `<ol class="passos">`. Essa lista é também o texto equivalente do esquema para acessibilidade.
- Se `imagemCiclo` tiver valor: mostrar `<img>` com o caminho relativo, `alt` curto ("Esquema do ciclo de vida de <nomePopular>, descrito nos passos abaixo") e `loading="lazy"`.
- Se `imagemCiclo` for `null`: mostrar um bloco `.espaco-esquema` com o texto "Esquema do ciclo de vida em preparação."
- Se a lista só tiver `A_PREENCHER`: mostrar um único item pendente (regra 5.4).

### 5.4 Como exibir campos pendentes (`A_PREENCHER`)

- Todo campo pendente aparece com o estilo `.pendente` (fundo `--cor-destaque-fundo`, borda tracejada `--cor-destaque`) e o texto **"A preencher pela equipe"**.
- Nunca esconder o campo pendente, para a equipe ver o que falta ao testar.
- Quando `statusConteudo` for `"validado"`, **nenhum** campo pendente deve ser exibido. Se existir algum, a IA deve registrar `console.warn` ("ficha validada com campo pendente").

### 5.5 Navegação anterior/próxima

- A ordem é a **ordem de ordenação por nome popular** usada na lista (a mesma da seção 4.3).
- A primeira ficha não tem "anterior" e a última não tem "próxima": nesses casos omitir o link (sem criar link vazio).
- Cada link mostra o rótulo ("Anterior" / "Próxima") e o nome popular da ficha.
- `nav` com `aria-label="Navegação entre fichas"`.

### 5.6 Aviso de rascunho

Para `statusConteudo: "rascunho"`, mostrar no topo da ficha uma caixa `.aviso-rascunho`:

*"Esta ficha está em revisão pela equipe. Algumas informações ainda serão adicionadas."*

---

## 6. Estados de carregamento e erro (comuns às duas páginas)

Criar um componente `.estado-mensagem` com variantes. Elementos com `role="status"` (carregando) ou `role="alert"` (erro):

| Situação | Mensagem | Ação sugerida |
|---|---|---|
| Carregando | "Carregando..." | nenhuma |
| `id` ausente | "Nenhuma ficha foi informada." | Botão "Ver todas as verminoses" |
| `id` inexistente | "Não encontramos essa ficha." | Botão "Ver todas as verminoses" |
| Falha ao carregar o JSON | "Não foi possível carregar os dados. Tente novamente em instantes." | Botão "Recarregar a página" (`location.reload()`) |
| JavaScript desativado | `<noscript>` com "Esta página precisa de JavaScript para mostrar o conteúdo." e link para o início | |

Dica para a equipe, no `README.md`: abrir o site com `file://` faz o `fetch` do JSON falhar. É obrigatório usar o servidor local (`python -m http.server`).

---

## 7. Novos componentes de CSS (`components.css`)

Todos usando tokens (nenhuma cor ou medida fixa):

| Classe | Descrição |
|---|---|
| `.card--link` | Variante do card para link inteiro (sem sublinhado, `:hover` e `:focus-visible` visíveis) |
| `.card__acao` | Texto de chamada no card ("Ver ficha"), em cor primária e negrito |
| `.etiqueta--rascunho` | Etiqueta em âmbar (`--cor-destaque-fundo` com borda `--cor-destaque`) |
| `.filtro`, `.filtro__botao` | Grupo de botões do filtro; botão ativo (`aria-pressed="true"`) com fundo `--cor-primaria` e texto branco |
| `.quadro-rapido` | `<dl>` em grade de duas colunas no desktop (termo / valor) e empilhado no celular |
| `.passos` | Lista ordenada com numeração destacada, espaçamento confortável |
| `.espaco-esquema` | Caixa tracejada com texto centralizado, proporção de imagem (ex.: `aspect-ratio: 16 / 9`) |
| `.pendente` | Estilo do campo a preencher (ver 5.4) |
| `.aviso-rascunho` | Caixa informativa em âmbar, com ícone |
| `.ficha-nav` | Navegação anterior/próxima: dois blocos lado a lado no desktop, empilhados no celular |
| `.estado-mensagem` | Bloco centralizado para carregando/erro, com botão de ação |
| `.ficha` | Contêiner de leitura com `max-width: var(--largura-texto)` para textos longos |

Regras de CSS:
- Seções da ficha com espaçamento vertical de `var(--esp-6)` entre elas.
- Texto da ficha com boa legibilidade (largura máxima de linha e `line-height` dos tokens).
- Layout validado em 360 px, 768 px e 1280 px, sem rolagem horizontal.
- Conferir contraste AA nos novos componentes (principalmente `.pendente`, `.aviso-rascunho` e `.etiqueta--rascunho`).

---

## 8. Atualização do `README.md`

Adicionar uma seção "Como adicionar uma doença":

1. Abrir `data/doencas.json`.
2. Copiar uma ficha existente e alterar todos os campos (o `id` deve ser único, minúsculo, sem acentos, com hífens).
3. Manter `statusConteudo` como `"rascunho"` até a equipe de conteúdo revisar e então mudar para `"validado"`.
4. Se a ficha tiver referências, cadastrá-las antes em `data/referencias.json` e usar os ids na ficha.
5. Se houver esquema do ciclo de vida, salvar o SVG em `assets/img/ciclos/` e preencher `imagemCiclo`.
6. Abrir `verminoses.html` e `doenca.html?id=<novo-id>` no servidor local para conferir.

Registrar também as duas alterações de esquema da seção 1 deste documento.

---

## 9. Regras gerais desta parte

- Continuam valendo as regras da Parte 1 (HTML semântico, sem frameworks, sem CDN, sem estilos inline, sem `!important`, tokens para tudo).
- JavaScript puro, sem dependências, em funções pequenas, com tratamento de erro no `fetch`.
- Nenhum dado do JSON entra na página por `innerHTML`.
- Não inventar conteúdo científico. Tudo que depende de fonte fica `A_PREENCHER`.
- Não criar fichas além das 2 de exemplo sem pedido da equipe.
- Não implementar busca textual nesta parte (é da Fase 2).
- Perguntar à equipe antes de decidir algo não definido aqui.

---

## 10. Testes e critérios de aceite da Parte 2

A IA deve conferir cada item e informar o resultado ao final.

**Dados**
- [ ] `doencas.json` é JSON válido, com as 2 fichas e `statusConteudo: "rascunho"`.
- [ ] Os `id` seguem o padrão (minúsculas, sem acentos, com hífens).
- [ ] `validarDoenca` não aponta problemas nas 2 fichas.

**Lista (`verminoses.html`)**
- [ ] Os 2 cards aparecem, ordenados por nome popular.
- [ ] Cada card leva à ficha correta.
- [ ] O filtro funciona para "Todos", "Platelmintos" e "Nematelmintos".
- [ ] `?grupo=platelmintos` na URL abre já filtrado; valor inválido equivale a "Todos".
- [ ] O leitor de tela recebe o texto "Mostrando N doenças" ao filtrar.
- [ ] Filtro sem resultados mostra a mensagem correta.
- [ ] Etiqueta "Em revisão" aparece nas fichas em rascunho.

**Ficha (`doenca.html`)**
- [ ] `?id=teniase-cisticercose` e `?id=ascaridiase` carregam a ficha correta.
- [ ] As 10 seções aparecem na ordem definida.
- [ ] Campos `A_PREENCHER` aparecem com o estilo `.pendente` e o texto "A preencher pela equipe".
- [ ] Linhas com valor `null` (classe, hospedeiro intermediário) são omitidas do quadro rápido.
- [ ] Nomes científicos aparecem em itálico.
- [ ] Sem `imagemCiclo`, aparece o espaço reservado; com a imagem, aparece o `<img>` com `alt`.
- [ ] Aviso de rascunho aparece nas fichas em rascunho.
- [ ] Alerta de saúde aparece em todas as fichas.
- [ ] Navegação anterior/próxima funciona e omite o link nas pontas.
- [ ] `document.title` muda conforme a ficha.

**Erros**
- [ ] Sem `id`, `id` inexistente e falha no JSON mostram as mensagens corretas, com botão de ação.
- [ ] Com JavaScript desativado, o `<noscript>` aparece.
- [ ] Nenhum erro no console em situação normal.

**Segurança e código**
- [ ] Nenhum dado do JSON passa por `innerHTML`.
- [ ] Testar adicionando temporariamente `<script>alert(1)</script>` em um campo de texto: nada deve executar (desfazer depois do teste).
- [ ] Todos os caminhos continuam relativos.

**Acessibilidade e responsividade**
- [ ] Um único `h1` por página; `h2` nas seções, sem saltos.
- [ ] Foco visível e navegação completa por teclado (filtro, cards, navegação entre fichas).
- [ ] Foco vai para o `h1` ao carregar a ficha.
- [ ] Contraste AA nos novos componentes.
- [ ] Layout correto em 360 px, 768 px e 1280 px, sem rolagem horizontal.

---

## 11. Formato da entrega da IA

1. Listar os arquivos criados ou alterados.
2. Entregar o código completo de cada arquivo (não trechos).
3. Informar o resultado do checklist da seção 10, marcando o que não foi possível testar.
4. Listar todos os campos `A_PREENCHER` que a equipe precisa completar, por ficha.
5. Confirmar que as alterações de esquema (seção 1) foram registradas no `README.md`.
6. Fazer as perguntas pendentes, se houver, antes de seguir para a Parte 3.

**A Parte 3 (páginas dos grupos zoológicos e prevenção) só começa após a equipe aprovar esta parte.**
