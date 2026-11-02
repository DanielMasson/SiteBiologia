# Especificação do Site "Vermes que Importam"

> Documento de planejamento para guiar uma IA no desenvolvimento do site.
> Leia tudo antes de gerar código. Siga a ordem de construção da seção 12 e as regras da seção 13.

---

## 1. Contexto e objetivo

**Projeto:** trabalho escolar integrado entre Zoologia (Platelmintos, Nematelmintos e verminoses) e o Curso Técnico em Informática para Internet, do IFC.

**Objetivo do site:** divulgação científica e educação ambiental sobre os filos Platyhelminthes e Nematoda, os principais parasitas e as verminoses que causam, com foco em **prevenção, saneamento e saúde ambiental**.

**Uso principal:** vitrine na Mostra de Educação Ambiental do IFC. O público acessa por **celular, via QR Code** colocado nos estandes.

**Público-alvo:** visitantes da Mostra (estudantes de outras turmas, famílias, comunidade). Linguagem clara, sem jargão desnecessário. Termos técnicos sempre com explicação curta.

---

## 2. Escopo

### Fase 1 (obrigatória)
- Páginas: Início, Platelmintos, Nematelmintos, Verminoses (lista), Doença (ficha individual), Prevenção e Meio Ambiente, Galeria, Sobre.
- Layout responsivo, mobile-first.
- Fichas geradas a partir de dados em JSON (um template único).
- Gerador de QR Codes (um por ficha e um para a página inicial).
- Acessibilidade básica (seção 9).

### Fase 2 (se sobrar tempo)
- Quiz educativo.
- Busca/filtro por agente, sintoma e forma de prevenção.
- Modo escuro.
- Mapa interativo de condições ambientais de risco.

### Fora do escopo
- Back-end, login, banco de dados em servidor, formulários que enviem dados pessoais.
- Qualquer conteúdo de diagnóstico, dose ou tratamento medicamentoso.

---

## 3. Stack técnica

| Item | Decisão |
|---|---|
| Linguagens | HTML5, CSS3, JavaScript (ES6+) puro |
| Frameworks | Nenhum (sem React, sem bibliotecas CSS pesadas) |
| Dados | Arquivos JSON em `/data` |
| Renderização das fichas | JavaScript lê o JSON e preenche um template único (`doenca.html?id=...`) |
| Hospedagem alvo | GitHub Pages (site estático) ou servidor da instituição |
| Versionamento | Git/GitHub |
| QR Code | Biblioteca JS leve, incluída localmente em `/assets/js/vendor/` (não depender de CDN na Mostra) |
| Teste local | Servidor local (ex.: `python -m http.server`), pois `fetch` de JSON não funciona via `file://` |

Todos os caminhos de arquivos devem ser **relativos** (para funcionar em subpasta do GitHub Pages).

---

## 4. Estrutura de pastas

```
vermes-que-importam/
├── index.html
├── platelmintos.html
├── nematelmintos.html
├── verminoses.html
├── doenca.html              # template único das fichas (?id=teniase)
├── prevencao.html
├── galeria.html
├── sobre.html
├── qrcodes.html             # página de apoio: gera/imprime QR Codes
├── 404.html
├── data/
│   ├── doencas.json         # todas as fichas
│   ├── galeria.json         # imagens, legendas, créditos, licenças
│   └── referencias.json     # fontes bibliográficas
├── assets/
│   ├── css/
│   │   ├── tokens.css       # variáveis (cores, fontes, espaçamentos)
│   │   ├── base.css         # reset e tipografia
│   │   ├── layout.css       # grid, header, footer
│   │   └── components.css   # cards, botões, tabelas, alertas
│   ├── js/
│   │   ├── main.js          # menu mobile, utilidades
│   │   ├── doenca.js        # renderiza a ficha a partir do JSON
│   │   ├── verminoses.js    # renderiza a lista/cards de doenças
│   │   ├── galeria.js       # renderiza a galeria
│   │   ├── qrcodes.js       # gera QR Codes
│   │   └── vendor/          # bibliotecas de terceiros (local)
│   └── img/
│       ├── ciclos/          # esquemas SVG dos ciclos de vida
│       ├── galeria/
│       └── logo/
└── README.md
```

---

## 5. Identidade visual

- **Tom:** educativo, acolhedor, científico. Nada de visual "assustador".
- **Paleta (definir em `tokens.css`):**
  - Verde-água escuro (primária, ligada a saúde e meio ambiente)
  - Verde-claro (apoio)
  - Âmbar (destaques e alertas de atenção)
  - Cinza-azulado escuro (texto) sobre fundo off-white
  - Vermelho suave só para avisos de saúde
  - Contraste mínimo WCAG AA (4.5:1 para texto).
- **Tipografia:** uma fonte sem serifa legível para o texto e uma de destaque para títulos. Preferir fontes do sistema ou incluídas localmente.
- **Componentes:** cards com cantos arredondados, ícones simples, tabelas legíveis em celular (rolagem horizontal ou empilhamento).
- **Ilustrações:** esquemas em SVG, estilo limpo e didático. Evitar fotos chocantes de pacientes.

---

## 6. Elementos globais

### Cabeçalho
- Logo/nome "Vermes que Importam".
- Menu: Início, Platelmintos, Nematelmintos, Verminoses, Prevenção, Galeria, Sobre.
- No celular: menu hambúrguer acessível (botão com `aria-expanded`).

### Rodapé
- Créditos: IFC, curso, turma, ano.
- Link para referências e página Sobre.
- Aviso fixo: *"Conteúdo educativo. Não substitui avaliação médica. Em caso de sintomas, procure uma unidade de saúde."*

### Componente "Alerta de saúde"
Caixa destacada reutilizável com o aviso acima, usada nas fichas de doença.

---

## 7. Especificação das páginas

### 7.1 `index.html` (Início)
- Hero com título, frase de impacto e botão "Conheça as verminoses".
- Três cards de entrada: Platelmintos, Nematelmintos, Prevenção.
- Faixa "Você sabia?" com 3 curiosidades curtas (conferidas nas fontes).
- Destaque da Mostra de Educação Ambiental do IFC.
- Link para o quiz (se existir).

### 7.2 `platelmintos.html`
- O que são: vermes de corpo achatado, sem celoma (acelomados), simetria bilateral.
- Classes: **Turbellaria** (vida livre, ex.: planárias), **Trematoda** (ex.: esquistossomo, fasciola), **Cestoda** (ex.: tênias).
- Quadro comparativo das classes (hábitat, exemplos, importância).
- Cards com links para as doenças ligadas ao grupo.
- Esquema do corpo (SVG) e glossário curto.

### 7.3 `nematelmintos.html`
- O que são: vermes de corpo cilíndrico, pseudocelomados, com tubo digestório completo, sexos separados na maioria.
- Importância ecológica e médica (parasitas e espécies de vida livre).
- Cards com links para as doenças ligadas ao grupo.
- Esquema do corpo (SVG) e glossário curto.

### 7.4 `verminoses.html` (lista)
- Cards gerados do `doencas.json`, com: nome da doença, agente, grupo (filo), ícone.
- Filtro simples por filo (Platelmintos / Nematelmintos). Busca textual na Fase 2.
- Cada card leva a `doenca.html?id=<id>`.

### 7.5 `doenca.html` (ficha individual, template único)
Lê o parâmetro `id` da URL, busca no `doencas.json` e renderiza as seções abaixo. Se o `id` não existir, mostrar mensagem amigável e link para a lista.

Seções da ficha, nesta ordem:
1. Título (nome popular) e nome científico do agente (em itálico).
2. Resumo em 2 a 3 linhas.
3. Quadro rápido: filo/classe, hospedeiro definitivo, hospedeiro intermediário (se houver), forma de transmissão.
4. Ciclo de vida: esquema SVG + passos numerados em texto.
5. Como se pega (transmissão).
6. Sintomas comuns.
7. Prevenção (lista de ações práticas).
8. Alerta de saúde (componente global).
9. Referências da ficha.
10. Navegação: ficha anterior / próxima.

### 7.6 `prevencao.html`
- Saneamento básico, água tratada e filtrada, destino do esgoto.
- Higiene pessoal e dos alimentos (lavar mãos, frutas e verduras, cozinhar bem as carnes).
- Cuidados com solo e calçados (ancilostomose, estrongiloidíase).
- Controle de caramujos e cuidados com água parada de rios e lagoas (esquistossomose), quando aplicável à realidade regional.
- Tabela "Doença x principal medida de prevenção".
- Seção "O que eu posso fazer" com ações simples para o público.

### 7.7 `galeria.html`
- Grade responsiva de imagens do `galeria.json`.
- Cada item: imagem, legenda, **crédito e licença obrigatórios**.
- Visualização ampliada (lightbox acessível) opcional.
- Prioridade para esquemas e fotos próprias ou de bancos livres.

### 7.8 `sobre.html`
- Equipe (nomes, funções), orientadores, instituição.
- Metodologia e lista de referências (do `referencias.json`).
- Contato institucional, sem dados pessoais sensíveis.

### 7.9 `qrcodes.html` (apoio à Mostra)
- Gera QR Code para a página inicial e para cada ficha, a partir da lista do `doencas.json` e de uma URL base configurável em um campo no topo da página.
- Botão para imprimir (CSS de impressão: um QR por card, com nome da doença embaixo).
- Botão para baixar cada QR em PNG.

---

## 8. Modelo de dados

### `data/doencas.json`
Cada item segue este esquema:

```json
{
  "id": "teniase",
  "nomePopular": "Teníase",
  "agentes": ["Taenia solium", "Taenia saginata"],
  "filo": "Platyhelminthes",
  "classe": "Cestoda",
  "resumo": "Texto curto de 2 a 3 linhas.",
  "hospedeiroDefinitivo": "Ser humano",
  "hospedeiroIntermediario": "Porco (T. solium) e boi (T. saginata)",
  "transmissao": "Texto sobre como a infecção ocorre.",
  "cicloDeVida": [
    "Passo 1...",
    "Passo 2..."
  ],
  "imagemCiclo": "assets/img/ciclos/teniase.svg",
  "sintomas": ["Sintoma 1", "Sintoma 2"],
  "prevencao": ["Medida 1", "Medida 2"],
  "referencias": ["ref-ms-teniase", "ref-fiocruz-teniase"]
}
```

### `data/galeria.json`
```json
{
  "id": "gal-001",
  "arquivo": "assets/img/galeria/exemplo.jpg",
  "legenda": "Descrição curta",
  "alt": "Texto alternativo descritivo",
  "autor": "Nome ou instituição",
  "licenca": "CC BY 4.0 / foto própria / domínio público",
  "fonte": "URL ou 'acervo da equipe'"
}
```

### `data/referencias.json`
```json
{
  "id": "ref-ms-teniase",
  "titulo": "Título do documento",
  "instituicao": "Ministério da Saúde",
  "ano": 2024,
  "url": "https://..."
}
```

---

## 9. Acessibilidade e responsividade

- Mobile-first. Testar larguras de 360 px, 768 px e 1280 px.
- HTML semântico (`header`, `nav`, `main`, `section`, `footer`), um único `h1` por página, hierarquia de títulos correta.
- Todas as imagens com `alt` descritivo; esquemas de ciclo com descrição em texto (a lista de passos já cumpre esse papel).
- Navegação completa por teclado, foco visível, link "Pular para o conteúdo".
- Contraste AA, texto redimensionável sem quebrar o layout.
- `lang="pt-BR"` em todas as páginas.
- Respeitar `prefers-reduced-motion` em animações.
- Tabelas com `th` e `scope` corretos.

---

## 10. Regras de conteúdo científico

1. **Não inventar dados.** Quando faltar informação, deixar o campo marcado com `"A_PREENCHER"` e avisar a equipe, em vez de preencher de memória.
2. Os textos científicos devem ser **redigidos e validados pela equipe de conteúdo**, com base em fontes confiáveis (Ministério da Saúde, Fiocruz, OMS, livros didáticos, artigos). A IA pode gerar rascunho estrutural, mas o conteúdo final precisa de revisão humana.
3. Nomes científicos em itálico, com gênero em maiúscula e espécie em minúscula (*Ascaris lumbricoides*).
4. **Sem diagnóstico, sem dose, sem indicação de medicamento.** Sempre orientar a procurar atendimento de saúde.
5. Evitar imagens chocantes de pacientes; priorizar esquemas e ilustrações.
6. Toda imagem de terceiros deve ter autoria e licença registradas no `galeria.json`.
7. Linguagem de divulgação científica: frases curtas, termos técnicos explicados na primeira vez.

### Doenças da Fase 1 (ids sugeridos)
- **Platelmintos:** `teniase-cisticercose`, `esquistossomose`, `fasciolose`, `hidatidose`.
- **Nematelmintos:** `ascaridiase`, `ancilostomose`, `oxiuriase`, `tricuriase`, `filariose`, `estrongiloidiase`.

A equipe pode reduzir essa lista; o site deve funcionar com qualquer quantidade de fichas.

---

## 11. Qualidade de código

- Código comentado onde a lógica não for óbvia, nomes de variáveis em português ou inglês de forma consistente (escolher um e manter).
- CSS organizado com variáveis em `tokens.css`; evitar estilos inline.
- JavaScript sem dependências, funções pequenas, tratamento de erro no `fetch` (mensagem amigável se o JSON falhar).
- Nenhuma chave de API, nenhum dado pessoal no repositório.
- HTML validado e sem erros no console.
- Imagens otimizadas (peso máximo sugerido: 300 KB cada).

---

## 12. Ordem de construção (para a IA seguir)

1. Criar a estrutura de pastas e arquivos vazios da seção 4.
2. Implementar `tokens.css`, `base.css`, `layout.css`, `components.css`.
3. Criar cabeçalho, rodapé e menu mobile reutilizáveis (repetidos em cada HTML ou injetados por `main.js`; manter consistente).
4. Criar `index.html`.
5. Criar `doencas.json` com **2 fichas de exemplo** (uma de cada filo) e validar o esquema com a equipe.
6. Criar `doenca.html` + `doenca.js` e testar com as duas fichas.
7. Criar `verminoses.html` + `verminoses.js` com filtro por filo.
8. Criar `platelmintos.html` e `nematelmintos.html`.
9. Criar `prevencao.html`.
10. Criar `galeria.html` + `galeria.js` + `galeria.json`.
11. Criar `sobre.html` + `referencias.json`.
12. Criar `qrcodes.html` + `qrcodes.js`.
13. Revisão de acessibilidade, responsividade e links quebrados.
14. Preparar `README.md` com instruções de uso local e de publicação no GitHub Pages.
15. (Fase 2) Quiz, busca, modo escuro, mapa.

**A cada etapa:** entregar o código completo dos arquivos alterados e uma lista curta do que testar.

---

## 13. Regras para a IA

- Responder e escrever textos do site em **português do Brasil**.
- Não adicionar bibliotecas, frameworks ou serviços externos sem pedir confirmação.
- Não alterar o esquema de dados da seção 8 sem avisar.
- Não preencher conteúdo científico por conta própria quando faltar fonte (usar `"A_PREENCHER"`).
- Perguntar antes de decidir qualquer ponto não definido neste documento (nome final do site, paleta exata, URL base de publicação).
- Manter o site funcionando a cada etapa (nada de entregar código quebrado "para completar depois").

---

## 14. Critérios de aceite

- [ ] Todas as páginas da Fase 1 abrem sem erros no console.
- [ ] O menu funciona no celular e no computador.
- [ ] A ficha individual carrega qualquer doença pelo `id` e trata `id` inválido.
- [ ] Cada ficha tem as 10 seções da seção 7.5 preenchidas ou marcadas como `A_PREENCHER`.
- [ ] Todas as imagens têm `alt`, autoria e licença.
- [ ] O aviso de saúde aparece em todas as fichas e no rodapé.
- [ ] QR Codes gerados abrem a ficha correta no celular.
- [ ] Contraste e navegação por teclado verificados.
- [ ] Site publicado e acessível pela URL final.
- [ ] Referências listadas na página Sobre.

---

## 15. Pendências para a equipe decidir

- Nome definitivo do site e identidade visual (logo, cores finais).
- Lista final de doenças da Fase 1.
- URL base de publicação (GitHub Pages ou servidor do IFC).
- Quem redige e valida cada ficha científica.
- Se haverá quiz e mapa na entrega ou apenas como expansão.
