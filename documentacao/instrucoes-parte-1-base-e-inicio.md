# Parte 1: Base do Site e Página Inicial

> Instrução detalhada para a IA. Esta parte cobre os itens 1 a 4 da "Ordem de construção" do `planejamento-site.md`.
> Leia primeiro o `planejamento-site.md` completo. Este documento detalha **apenas** a Parte 1. Não construa nada das partes seguintes (fichas, listas, galeria, QR Codes).

---

## 0. O que esta parte entrega

Ao final, deve existir um site estático que:

1. Tem a estrutura de pastas completa criada.
2. Tem um sistema de design funcional (variáveis, tipografia, layout, componentes).
3. Tem cabeçalho, menu mobile e rodapé funcionando e reutilizáveis.
4. Tem a página `index.html` pronta, com navegação para as demais páginas.
5. Tem páginas "em construção" para os links do menu ainda não desenvolvidos, para que nenhum link dê erro 404.
6. Abre sem erros no console, no celular (360 px) e no computador (1280 px).

---

## 1. Passo 1: Criar a estrutura de pastas e arquivos

Criar exatamente esta estrutura (arquivos vazios ou com o mínimo indicado):

```
vermes-que-importam/
├── index.html
├── platelmintos.html        # mínimo: página "em construção"
├── nematelmintos.html       # mínimo: página "em construção"
├── verminoses.html          # mínimo: página "em construção"
├── doenca.html              # mínimo: página "em construção"
├── prevencao.html           # mínimo: página "em construção"
├── galeria.html             # mínimo: página "em construção"
├── sobre.html               # mínimo: página "em construção"
├── qrcodes.html             # mínimo: página "em construção"
├── 404.html
├── data/
│   ├── doencas.json         # conteúdo inicial: []
│   ├── galeria.json         # conteúdo inicial: []
│   └── referencias.json     # conteúdo inicial: []
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── js/
│   │   ├── main.js
│   │   └── vendor/          # vazia por enquanto (.gitkeep)
│   └── img/
│       ├── ciclos/          # .gitkeep
│       ├── galeria/         # .gitkeep
│       └── logo/            # .gitkeep
└── README.md                # versão mínima (ver seção 8)
```

**Regras:**
- Todos os caminhos nos HTML devem ser **relativos** (`assets/css/base.css`, nunca `/assets/...`), para funcionar em subpasta do GitHub Pages.
- Os arquivos `.gitkeep` servem para o Git versionar pastas vazias.
- Criar um `.gitignore` simples (ignorar arquivos de sistema como `.DS_Store` e `Thumbs.db`).

---

## 2. Passo 2: Sistema de design (CSS)

Ordem de carregamento em **todas** as páginas, dentro do `<head>`:

```html
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/layout.css">
<link rel="stylesheet" href="assets/css/components.css">
```

### 2.1 `tokens.css` (somente variáveis)

Usar `:root` com as variáveis abaixo. Os valores são a **proposta inicial** da paleta; a equipe pode trocar depois alterando só este arquivo.

```css
:root {
  /* Cores */
  --cor-primaria: #0F5C5A;        /* verde-água escuro */
  --cor-primaria-escura: #0A4240;
  --cor-apoio: #DCEFE6;           /* verde claro */
  --cor-destaque: #F2A93B;        /* âmbar (usar em bordas, ícones, fundos) */
  --cor-destaque-fundo: #FFF3D6;
  --cor-alerta: #9B2C2C;          /* vermelho suave, só para avisos de saúde */
  --cor-alerta-fundo: #FDECEC;
  --cor-texto: #1F2A33;
  --cor-texto-suave: #4A5963;
  --cor-fundo: #F7F9F8;
  --cor-superficie: #FFFFFF;
  --cor-borda: #D5DEDA;
  --cor-foco: #1A73E8;            /* anel de foco visível */

  /* Tipografia */
  --fonte-texto: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  --fonte-titulo: "Trebuchet MS", system-ui, sans-serif;
  --tamanho-base: 1rem;           /* 16px */
  --altura-linha: 1.6;
  --tamanho-h1: clamp(1.9rem, 5vw, 2.8rem);
  --tamanho-h2: clamp(1.5rem, 3.5vw, 2rem);
  --tamanho-h3: 1.25rem;

  /* Espaçamentos (escala) */
  --esp-1: 0.25rem;
  --esp-2: 0.5rem;
  --esp-3: 0.75rem;
  --esp-4: 1rem;
  --esp-5: 1.5rem;
  --esp-6: 2rem;
  --esp-7: 3rem;
  --esp-8: 4.5rem;

  /* Forma e sombra */
  --raio: 12px;
  --raio-pequeno: 6px;
  --sombra-card: 0 2px 8px rgba(15, 50, 48, 0.08);
  --largura-max: 1100px;
  --largura-texto: 70ch;
}
```

**Regras:**
- Nenhuma cor, tamanho ou espaçamento fixo fora deste arquivo. Os outros CSS só usam `var(--...)`.
- Fontes do sistema (sem Google Fonts), para funcionar offline na Mostra.
- Verificar contraste: texto `--cor-texto` sobre `--cor-fundo`, e branco sobre `--cor-primaria`, devem passar WCAG AA (4.5:1).

### 2.2 `base.css`

Conteúdo obrigatório:
- Reset leve: `box-sizing: border-box` em tudo, margens zeradas em `body`, `h1-h6`, `p`.
- `html { scroll-behavior: smooth; }` envolvido em `@media (prefers-reduced-motion: no-preference)`.
- `body`: fonte, cor, fundo, `line-height` usando os tokens.
- Títulos com `--fonte-titulo` e os tamanhos dos tokens.
- Links: cor `--cor-primaria`, sublinhado visível, estado `:hover` e `:focus-visible` com contorno de 3px em `--cor-foco`.
- `img, svg { max-width: 100%; height: auto; display: block; }`.
- Classe `.sr-only` (texto visível só para leitores de tela).
- Classe `.pular-conteudo` (link "Pular para o conteúdo": fica fora da tela e aparece ao receber foco).
- `@media (prefers-reduced-motion: reduce)` zerando animações e transições.

### 2.3 `layout.css`

Conteúdo obrigatório:
- `.container`: `max-width: var(--largura-max)`, centralizado, padding lateral `var(--esp-4)`.
- `.secao`: padding vertical `var(--esp-7)`, com variante `.secao--apoio` (fundo `--cor-apoio`).
- `.grade`: CSS Grid responsivo, 1 coluna no celular, 2 a partir de 700 px, 3 a partir de 1000 px (`.grade--3`), com `gap: var(--esp-5)`.
- **Cabeçalho** (`.site-header`): barra com fundo `--cor-primaria`, texto branco, logo/nome à esquerda, menu à direita. `position: sticky; top: 0` com `z-index` adequado.
- **Menu**:
  - Desktop (≥ 900 px): links em linha, botão hambúrguer escondido.
  - Mobile (< 900 px): lista escondida; botão hambúrguer visível; ao abrir, a lista aparece em coluna, ocupando a largura toda abaixo do cabeçalho.
  - Link da página atual com destaque (`aria-current="page"` estilizado).
- **Rodapé** (`.site-footer`): fundo `--cor-primaria-escura`, texto claro, grade com 2 colunas no desktop (créditos / links) e 1 no celular.
- Layout de página: `body` com `display: flex; flex-direction: column; min-height: 100vh;` e `main { flex: 1; }`, para o rodapé ficar no fim mesmo em páginas curtas.

### 2.4 `components.css`

Componentes reutilizáveis (todos usando tokens):

| Classe | Descrição |
|---|---|
| `.botao` | Botão/link com visual de botão, padding generoso (alvo de toque mínimo 44×44 px), fundo `--cor-primaria`, texto branco |
| `.botao--secundario` | Variante com contorno e fundo transparente |
| `.card` | Superfície branca, borda `--cor-borda`, `--raio`, `--sombra-card`, padding `--esp-5`; quando for link inteiro, efeito sutil de elevação no `:hover` |
| `.card__titulo`, `.card__texto` | Elementos internos do card |
| `.etiqueta` | Pequena etiqueta arredondada (ex.: "Platelmintos") |
| `.alerta-saude` | Caixa com fundo `--cor-alerta-fundo`, borda esquerda de 4px em `--cor-alerta`, ícone e texto |
| `.destaque-curiosidade` | Caixa "Você sabia?" com fundo `--cor-destaque-fundo` e borda `--cor-destaque` |
| `.hero` | Bloco de abertura (ver seção 5) |
| `.em-construcao` | Bloco centralizado para as páginas ainda não desenvolvidas |

---

## 3. Passo 3: Cabeçalho, menu e rodapé

### 3.1 Decisão de implementação

Como o site é estático e sem framework, o cabeçalho e o rodapé serão **injetados por JavaScript** (`main.js`) a partir de funções que geram o HTML, evitando repetir o mesmo bloco em 10 arquivos. Cada página terá apenas:

```html
<body>
  <a class="pular-conteudo" href="#conteudo">Pular para o conteúdo</a>
  <div id="cabecalho"></div>
  <main id="conteudo" tabindex="-1">
    ...
  </main>
  <div id="rodape"></div>
  <script src="assets/js/main.js" defer></script>
</body>
```

Para não deixar a página sem menu caso o JS falhe, incluir dentro de `<div id="cabecalho">` um `<noscript>` com uma lista simples de links para as páginas principais.

### 3.2 Estrutura HTML gerada para o cabeçalho

```html
<header class="site-header">
  <div class="container site-header__interno">
    <a class="site-header__marca" href="index.html">Vermes que Importam</a>
    <button class="menu-botao" type="button"
            aria-expanded="false" aria-controls="menu-principal">
      <span class="sr-only">Abrir menu</span>
      <span aria-hidden="true">☰</span>
    </button>
    <nav aria-label="Principal">
      <ul id="menu-principal" class="menu">
        <li><a href="index.html">Início</a></li>
        <li><a href="platelmintos.html">Platelmintos</a></li>
        <li><a href="nematelmintos.html">Nematelmintos</a></li>
        <li><a href="verminoses.html">Verminoses</a></li>
        <li><a href="prevencao.html">Prevenção</a></li>
        <li><a href="galeria.html">Galeria</a></li>
        <li><a href="sobre.html">Sobre</a></li>
      </ul>
    </nav>
  </div>
</header>
```

### 3.3 Comportamento do menu (em `main.js`)

- Ao clicar no botão: alternar `aria-expanded` entre `"true"`/`"false"`, abrir/fechar o menu, trocar o texto do `sr-only` entre "Abrir menu" e "Fechar menu".
- Fechar o menu ao pressionar `Esc` (devolvendo o foco ao botão).
- Fechar o menu ao clicar em um link.
- Fechar o menu automaticamente se a janela for ampliada para o layout desktop.
- Marcar com `aria-current="page"` o link correspondente à página atual (comparar o nome do arquivo em `location.pathname`; tratar `/` e vazio como `index.html`).
- Todo o código dentro de uma função `iniciar()` chamada em `DOMContentLoaded`.

### 3.4 Estrutura HTML gerada para o rodapé

Conteúdo do rodapé:
- Coluna 1: nome do site, "Projeto desenvolvido por estudantes do Curso Técnico em Informática para Internet, IFC", ano (gerado por `new Date().getFullYear()`).
- Coluna 2: links "Referências e equipe" (`sobre.html`) e "Prevenção" (`prevencao.html`).
- Linha final com o aviso em destaque:
  *"Conteúdo educativo. Não substitui avaliação médica. Em caso de sintomas, procure uma unidade de saúde."*

Deixar o nome do campus e da turma como `A_PREENCHER` em comentário no código, para a equipe completar.

---

## 4. Passo 4a: Páginas "em construção" e 404

Para cada página ainda não desenvolvida (`platelmintos`, `nematelmintos`, `verminoses`, `doenca`, `prevencao`, `galeria`, `sobre`, `qrcodes`):
- `<head>` completo (seção 6), `<title>` próprio, `h1` com o nome da página.
- Dentro de `<main>`, um bloco `.em-construcao` com: texto "Esta página está em construção." e um botão "Voltar ao início".

`404.html`: mesma estrutura, `h1` "Página não encontrada", texto amigável e botão para o início.

---

## 5. Passo 4b: `index.html`

### 5.1 Estrutura da página (de cima para baixo)

**Hero** (`.hero`)
- `h1`: "Vermes que Importam" (única ocorrência de `h1` na página).
- Subtítulo curto (1 a 2 frases): o site explica os vermes platelmintos e nematelmintos, as doenças que causam e como preveni-las.
- Dois botões: **"Conheça as verminoses"** (`verminoses.html`, `.botao`) e **"Como prevenir"** (`prevencao.html`, `.botao--secundario`).
- Fundo com `--cor-apoio` ou degradê sutil com os tokens. Sem imagens obrigatórias nesta etapa.

**Seção "Explore o tema"** (`.secao`, `h2`)
Três cards (`.grade--3`), cada um sendo um link inteiro:
1. **Platelmintos**: "Os vermes de corpo achatado: tênias, esquistossomo e outros." → `platelmintos.html`
2. **Nematelmintos**: "Os vermes de corpo cilíndrico: lombriga, ancilóstomo e outros." → `nematelmintos.html`
3. **Prevenção**: "Saneamento, água, higiene: o que realmente evita as verminoses." → `prevencao.html`

**Seção "Você sabia?"** (`.secao--apoio`, `h2`)
- Três blocos `.destaque-curiosidade`.
- **Regra:** o conteúdo das curiosidades deve vir da equipe, com fonte. Gerar a estrutura com três blocos contendo o texto `A_PREENCHER (curiosidade verificada, com fonte)` e um comentário HTML indicando o local da fonte. **Não inventar curiosidades nem números.**

**Seção "Por que isso importa?"** (`.secao`)
- Parágrafo curto (máx. 4 linhas, em `--largura-texto`) ligando verminoses a saneamento, água e saúde pública, **sem estatísticas**. Se a equipe quiser dados, virão depois, com referência.
- Link para a página de Prevenção.

**Seção "Mostra de Educação Ambiental do IFC"** (`.secao--apoio`)
- Texto curto explicando que o site faz parte do trabalho apresentado na Mostra, e que os QR Codes nos estandes levam às fichas.
- Deixar data e local como `A_PREENCHER`.

**Seção do Quiz (Fase 2)**
- Não criar nesta etapa. Deixar apenas um comentário HTML: `<!-- Fase 2: chamada para o quiz -->`.

### 5.2 Textos

- Português do Brasil, frases curtas, tom acolhedor e educativo.
- Termos técnicos explicados na primeira ocorrência (ex.: "platelmintos, os vermes de corpo achatado").
- Não afirmar nada científico além do que está descrito neste documento.

---

## 6. Modelo de `<head>` (todas as páginas)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Título da página | Vermes que Importam</title>
  <meta name="description" content="Descrição de 1 frase da página.">
  <meta name="theme-color" content="#0F5C5A">
  <!-- <link rel="icon" href="assets/img/logo/favicon.png"> A_PREENCHER quando houver logo -->
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
</head>
```

---

## 7. Regras gerais desta parte

- HTML semântico: `header`, `nav`, `main`, `section`, `footer`. Um único `h1` por página; `h2` para seções; sem pular níveis.
- Sem frameworks, sem bibliotecas, sem CDN, sem fontes externas.
- Sem estilos inline e sem `!important` (exceto no bloco `prefers-reduced-motion`).
- Sem imagens de terceiros. Se precisar de ícones, usar caracteres Unicode simples ou SVG inline feito por você.
- Todo texto a ser completado pela equipe deve estar marcado com `A_PREENCHER`.
- Não criar JSON de doenças, galeria, quiz ou QR Codes nesta parte.
- Comentar no código apenas o que não for óbvio.
- Perguntar à equipe antes de decidir qualquer coisa que não esteja definida aqui.

---

## 8. README mínimo (nesta etapa)

Incluir:
1. Nome do projeto e uma frase de descrição.
2. Como rodar localmente: abrir um terminal na pasta do projeto e executar `python -m http.server 8000`, depois acessar `http://localhost:8000`.
3. Estrutura de pastas resumida.
4. Aviso de que o conteúdo científico está em desenvolvimento e passa por validação da equipe.

---

## 9. Testes e critérios de aceite da Parte 1

A IA deve conferir cada item e informar o resultado ao final:

**Estrutura**
- [ ] Todas as pastas e arquivos da seção 1 existem.
- [ ] Todos os links do menu e do rodapé abrem uma página existente (nenhum 404).

**Visual e responsividade**
- [ ] Layout correto em 360 px, 768 px e 1280 px, sem rolagem horizontal.
- [ ] Rodapé fica no fim da página mesmo nas páginas "em construção".
- [ ] Cards e botões têm alvo de toque de pelo menos 44×44 px.

**Menu**
- [ ] Hambúrguer abre e fecha no celular; `aria-expanded` muda corretamente.
- [ ] `Esc` fecha o menu e devolve o foco ao botão.
- [ ] O link da página atual está marcado com `aria-current="page"`.
- [ ] Com JavaScript desativado, o `<noscript>` mostra links de navegação.

**Acessibilidade**
- [ ] Link "Pular para o conteúdo" funciona com a tecla Tab.
- [ ] Foco visível em links, botões e cards.
- [ ] Contraste AA nas combinações principais (texto/fundo, branco/primária).
- [ ] Um único `h1` por página; hierarquia de títulos sem saltos.
- [ ] `lang="pt-BR"` em todas as páginas.

**Código**
- [ ] Console do navegador sem erros ou avisos.
- [ ] Todos os caminhos são relativos.
- [ ] Nenhuma cor ou medida fixa fora de `tokens.css`.

---

## 10. Formato da entrega da IA

1. Listar os arquivos criados ou alterados.
2. Entregar o código completo de cada arquivo (não trechos).
3. Informar o resultado do checklist da seção 9, marcando o que não foi possível testar.
4. Listar os itens `A_PREENCHER` que a equipe precisa completar.
5. Fazer as perguntas pendentes, se houver, antes de seguir para a Parte 2.

**A Parte 2 só começa após a equipe aprovar esta parte.**
