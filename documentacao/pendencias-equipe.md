# Pendências para a equipe

Estado atual do site após a primeira rodada de preenchimento. O conteúdo científico (10 fichas, páginas dos grupos, curiosidades e quiz) foi pesquisado em fontes oficiais e está em `"rascunho"`: **a equipe precisa revisar e só depois mudar para `"validado"`**.

Para encontrar tudo de novo a qualquer momento, procure por `A_PREENCHER` nos arquivos do projeto.

## 1. Revisão do conteúdo científico (feito, falta validar)

Tudo abaixo já foi escrito com base em fontes verificadas (Ministério da Saúde, Fiocruz, OMS/OPAS, DIVE/SES-SC, Embrapa, livros didáticos), com a URL de cada fonte conferida.

| Item | Situação | O que a equipe faz |
|---|---|---|
| `data/doencas.json` | 10 fichas completas (Fase 1), todas `"rascunho"` | Ler campo a campo, conferir nas fontes e mudar para `"validado"` quando concordar |
| `data/referencias.json` | 26 referências, todas com URL verificada | Conferir autoria/ano e completar o que faltar (ex.: artigos do IFC) |
| `data/quiz.json` | 8 perguntas, todas `"validado"` pela pesquisa | Revisar pergunta, alternativas e explicação; manter em rascunho até a equipe confirmar |
| `platelmintos.html` | Quadro das classes e glossário preenchidos | Conferir as definições e as fontes citadas nos comentários |
| `nematelmintos.html` | Importância ecológica/médica e glossário preenchidos | Idem |
| `prevencao.html` | Realidade regional (SC) preenchida | Conferir com a vigilância do campus/território |
| `index.html` | 3 curiosidades com fonte visível | Conferir as fontes; **data e local da Mostra** ainda pendentes (seção 2) |
| `sobre.html` | Metodologia e 5 etapas do trabalho preenchidas | Conferir se as etapas descrevem o trabalho real da equipe |

Antes de qualquer mudança para `"validado"`:

- nenhum campo pode estar pendente (`A_PREENCHER`, vazio ou "A preencher pela equipe");
- relembrar: **sem diagnóstico, sem dose e sem indicação de medicamento**;
- `imagemCiclo` está `null` em todas as fichas: se a equipe desenhar/esquematizar o ciclo de uma doença, salve em `assets/img/ciclos/` e preencha o campo.

## 2. Informações do projeto

Preenchido com os dados enviados pela equipe: integrantes e funções, orientador (Professor Jóse Adelson), IFC Campus Concordia e amostragem (27/10/2026).

| Arquivo | O que falta |
|---|---|
| `index.html` | Data e local da Mostra (a amostragem já está registrada) |
| `sobre.html` | Contato institucional do campus (sem dados pessoais sensíveis) |
| `sobre.html` e rodapé (`assets/js/main.js`) | Turma (opcional — só exibir se a equipe quiser) |
| `qrcodes.html` | URL base de publicação: deixada em espera; a página já está pronta e auto-preenche com o endereço atual — basta publicar e conferir |
| `data/galeria.json` | Nenhuma imagem cadastrada ainda: `alt`, autor, licença e fonte. Priorize esquemas e fotos próprias ou de bancos livres |
| Todas as páginas (`<head>`) | O ícone é provisório (`assets/img/logo/favicon.svg`). Trocar pelo logo definitivo |
| `assets/img/ciclos/` | Pasta vazia: esquemas de ciclo (SVG/PNG) das doenças |

Conferir também: a página Sobre diz "Instituto Federal Catarinense (IFC). Campus Concordia" — confirme a grafia oficial do campus e do nome do orientador antes de publicar.

## 3. Decisões da equipe (seção 15 do planejamento)

- Nome definitivo do site e identidade visual (logo e cores finais).
- **URL base de publicação** (GitHub Pages ou servidor do IFC). Sem ela não dá para gerar os QR Codes finais em `qrcodes.html`.
- Quem valida cada ficha científica (hoje tudo está em `"rascunho"`).
- Quais recursos da Fase 2 entram na entrega. Prontos: busca, modo escuro e quiz (com 8 perguntas no menu). Não feito: mapa de incidência (depende de dados oficiais e de decisão da equipe).

## 4. Antes da Mostra

- [ ] Revisar as 10 fichas e o quiz e mudar o que estiver certo para `"validado"`.
- [ ] Preencher equipe, orientadores, campus/turma, contato, data/local e rodapé.
- [ ] Publicar o site e testar a URL final no celular.
- [ ] Gerar os QR Codes em `qrcodes.html` **com a URL final** (o aviso na página alerta se o endereço for local) e imprimir.
- [ ] Ler cada QR Code com um celular e conferir se abre a ficha certa.
- [ ] Confirmar que nenhuma ficha `"validado"` tem campo pendente.
- [ ] Conferir se toda imagem da galeria tem autoria e licença.
