# Vermes que Importam

Site educativo estático sobre os filos Platyhelminthes e Nematoda, as verminoses que causam e as medidas de prevenção, feito para a Mostra de Educação Ambiental do IFC.

## Como rodar localmente

Abra um terminal na pasta do projeto e execute:

```bash
python -m http.server 8000
```

Depois acesse <http://localhost:8000>.

> O servidor local é necessário porque páginas abertas por `file://` não conseguem ler os arquivos JSON da pasta `data/`.

## Estrutura de pastas

```
.
├── index.html            # página inicial
├── *.html                # demais páginas (qrcodes.html ainda em construção)
├── 404.html
├── data/                 # dados em JSON (doenças, galeria, referências)
├── assets/
│   ├── css/              # tokens, base, layout, componentes
│   ├── js/               # utils, main, verminoses, doenca, doencas-do-grupo, prevencao, galeria, sobre
│   └── img/              # ciclos, galeria e logo
└── documentacao/         # planejamento e instruções do projeto
```

## Modelo de dados (alterações em relação ao planejamento)

O esquema de `data/doencas.json` descrito no planejamento vale com estas duas mudanças:

1. **Novo campo `statusConteudo`**, com valores `"rascunho"` ou `"validado"`. Fichas em rascunho mostram o aviso "Esta ficha está em revisão pela equipe" na página.
2. **Qualquer campo de texto pode ser `"A_PREENCHER"`**. O site exibe esses campos com o estilo de pendência (fundo âmbar, borda tracejada) e o texto "A preencher pela equipe", para a equipe ver o que falta. Quando a ficha muda para `"validado"`, nenhum campo pendente deve existir.

Outras regras de consistência:

- `id`: apenas letras minúsculas, números e hífen (ex.: `teniase-cisticercose`), seguindo a lista de doenças do planejamento.
- `hospedeiroIntermediario`: `null` quando a doença não tem; a linha é omitida do quadro rápido.
- `classe`: pode ser `null` (nematódeos); a linha também é omitida.
- `agentes` e `referencias`: sempre listas, mesmo com um item.
- `referencias` guarda ids que apontam para `data/referencias.json`.
- `imagemCiclo`: caminho do SVG em `assets/img/ciclos/` ou `null` (o site mostra um espaço reservado).

## Como adicionar uma doença

1. Abra `data/doencas.json`.
2. Copie uma ficha existente e altere todos os campos (o `id` deve ser único, minúsculo, sem acentos, com hífens).
3. Mantenha `statusConteudo` como `"rascunho"` até a equipe de conteúdo revisar; depois mude para `"validado"`.
4. Se a ficha tiver referências, cadastre-as antes em `data/referencias.json` e use os ids na ficha.
5. Se houver esquema do ciclo de vida, salve o SVG em `assets/img/ciclos/` e preencha `imagemCiclo`.
6. Abra `verminoses.html` e `doenca.html?id=<novo-id>` no servidor local para conferir.

## Como adicionar uma imagem à galeria

1. Salve a imagem em `assets/img/galeria/` (peso sugerido: até 300 KB).
2. Abra `data/galeria.json` e adicione um item com `id`, `arquivo`, `legenda`, `alt`, `autor`, `licenca` e `fonte` (use `"acervo da equipe"` em `fonte` para material próprio).
3. Toda imagem precisa de `alt` descritivo, autoria e licença. Se `autor`, `licenca` ou `fonte` faltarem, o site mostra "A preencher pela equipe" e registra um aviso no console.
4. Abra `galeria.html` no servidor local para conferir.

## Como adicionar uma referência

1. Abra `data/referencias.json` e adicione um item com `id`, `titulo`, `instituicao`, `ano` e `url`.
2. A página `sobre.html` lista todas as referências em ordem alfabética de título. Para vinculá-la a uma ficha, use o `id` em `referencias` da doença.

## Aviso

O conteúdo científico está em desenvolvimento e passa por validação da equipe. Textos marcados com `A_PREENCHER` precisam ser completados e conferidos em fontes confiáveis antes da publicação.
