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
├── *.html                # demais páginas (grupos, verminoses, prevenção, sobre, qrcodes, quiz)
├── 404.html
├── data/                 # dados em JSON (doenças, referências, quiz)
├── assets/
│   ├── css/              # tokens, base, layout, componentes
│   ├── js/               # utils, main, verminoses, doenca, doencas-do-grupo, prevencao, sobre, qrcodes, qrcode-gerador, tema, quiz
│   └── img/              # ciclos e logo
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


## Como adicionar uma referência

1. Abra `data/referencias.json` e adicione um item com `id`, `titulo`, `instituicao`, `ano` e `url`.
2. A página `sobre.html` lista todas as referências em ordem alfabética de título. Para vinculá-la a uma ficha, use o `id` em `referencias` da doença.

## Como adicionar perguntas ao quiz

A página `quiz.html` lê `data/quiz.json` (hoje com 8 perguntas, todas `"validado"` após a pesquisa em fontes oficiais — a equipe ainda precisa revisar). Cada pergunta é um objeto:

```json
{
  "id": "q-exemplo",
  "pergunta": "Texto da pergunta?",
  "alternativas": ["Opção A", "Opção B", "Opção C", "Opção D"],
  "correta": 1,
  "explicacao": "Por que essa é a resposta certa, com base nas fontes da equipe.",
  "statusConteudo": "rascunho"
}
```

- `correta` é a **posição** da alternativa certa, começando em 0 (no exemplo, `1` é a "Opção B"). Use de 2 a 6 alternativas.
- Só perguntas com `"statusConteudo": "validado"` aparecem no site. Mantenha `"rascunho"` até a equipe de conteúdo conferir a pergunta e a explicação em fontes confiáveis.
- Uma pergunta validada não pode ter `A_PREENCHER` nem campos vazios. Perguntas com erro de formato são ignoradas, e o motivo aparece no console do navegador.
- O quiz já está no menu (`PAGINAS_MENU` em `assets/js/main.js` e os links `<noscript>` das páginas), porque há perguntas validadas. Se o quiz um dia ficar sem perguntas validadas, remova esses links para não mostrar a página vazia.

## Tema claro e escuro

O site segue o tema do sistema (claro ou escuro). O botão com a lua no cabeçalho alterna o tema, e a escolha fica guardada no navegador (`localStorage`, chave `vermes-tema`). Para mudar as cores, edite só os blocos de `assets/css/tokens.css`: o tema claro está em `:root` e o escuro aparece duas vezes (seguindo o sistema e pela escolha manual), então altere os dois. Ao imprimir, o site sempre usa cores claras.

Regra para novos estilos: use `--cor-link` para texto colorido sobre a superfície e `--cor-primaria` apenas como fundo de elementos com texto `--cor-texto-claro`.

## Como publicar no GitHub Pages

O site é estático e usa só caminhos relativos, então funciona dentro de uma subpasta do GitHub Pages.

1. Envie o projeto para o repositório no GitHub (branch `main`).
2. No repositório, abra **Settings > Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`, e salve.
4. Aguarde alguns minutos. O endereço será `https://<usuario>.github.io/<repositorio>/`.
5. Abra o endereço no celular e navegue pelas páginas antes de gerar os QR Codes.

## QR Codes para a Mostra

1. Com o site publicado, abra `qrcodes.html`.
2. No campo "Endereço do site publicado", confira o endereço final (o campo vem preenchido com o endereço da página atual).
3. A página gera um QR Code para a página inicial e um para cada ficha. Use **Imprimir cartões** (um QR por cartão, com o nome embaixo) ou **Baixar PNG** em cada cartão.
4. Se o endereço for `localhost` ou de rede local, a página avisa: esses endereços não funcionam nos celulares dos visitantes.
5. Leia cada QR Code com um celular e confira se abre a ficha certa.

O gerador de QR Code é código próprio em `assets/js/qrcode-gerador.js`, sem bibliotecas externas e sem internet. Ele aceita endereços de até 213 bytes.

## O que ainda falta preencher

Veja `documentacao/pendencias-equipe.md`: revisão e validação do conteúdo científico , dados da equipe (equipe, orientadores, campus/turma, data/local, contato), logo/favicon, esquemas de ciclo e a URL final de publicação.

