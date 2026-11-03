# Pendências para a equipe

Lista de tudo que ainda está marcado como `A_PREENCHER` (ou "A preencher pela equipe") no site. Nada disso foi escrito de memória: o planejamento exige que o conteúdo científico venha de fontes confiáveis (Ministério da Saúde, Fiocruz, OMS, livros didáticos) e seja validado pela equipe.

Para encontrar tudo de novo a qualquer momento, procure por `A_PREENCHER` nos arquivos do projeto.

## 1. Conteúdo científico

### Fichas das doenças (`data/doencas.json`)

Cada ficha começa em `"statusConteudo": "rascunho"`. Só mude para `"validado"` quando **nenhum** campo estiver pendente.

| Ficha | Campos pendentes |
|---|---|
| `teniase-cisticercose` | `resumo`, `hospedeiroIntermediario`, `transmissao`, `cicloDeVida`, `sintomas`, `prevencao` |
| `ascaridiase` | `resumo`, `transmissao`, `cicloDeVida`, `sintomas`, `prevencao` |

Para cada ficha, a equipe também precisa:

- cadastrar as fontes em `data/referencias.json` e listar os ids em `referencias`;
- conferir `agentes`, `filo`, `classe` e `hospedeiroDefinitivo` (preenchidos só com dados básicos);
- se houver, salvar o esquema do ciclo em `assets/img/ciclos/` e preencher `imagemCiclo`;
- lembrar: **sem diagnóstico, sem dose e sem indicação de medicamento**.

As demais doenças da Fase 1 do planejamento (`esquistossomose`, `fasciolose`, `hidatidose`, `ancilostomose`, `oxiuriase`, `tricuriase`, `filariose`, `estrongiloidiase`) ainda não têm ficha. A equipe decide quais entram (ver seção 3).

### Páginas dos grupos

| Arquivo | O que falta |
|---|---|
| `platelmintos.html` | Quadro das classes: importância de Turbellaria, Trematoda e Cestoda; hábitat de Trematoda e Cestoda. Glossário: definição de **celoma** e de **simetria bilateral**. |
| `nematelmintos.html` | Detalhes da importância ecológica e médica. Glossário: definição de **pseudoceloma** e de **tubo digestório completo**. |
| `prevencao.html` | O que se aplica à realidade regional sobre água parada, rios, lagoas e caramujos. |
| `index.html` | Três curiosidades verificadas, cada uma com fonte. Data e local da Mostra. |

### Quiz (`data/quiz.json`)

O mecanismo está pronto, mas o arquivo está vazio: nenhuma pergunta foi escrita de memória. A equipe escreve as perguntas e as explicações com base nas fontes das fichas e marca como `"validado"` depois da revisão. O formato e o passo para colocar o quiz no menu estão no README ("Como adicionar perguntas ao quiz").

## 2. Informações do projeto

| Arquivo | O que falta |
|---|---|
| `sobre.html` | Equipe (nomes e funções), orientadores, campus e turma, etapas da metodologia, contato institucional (sem dados pessoais sensíveis). |
| `assets/js/main.js` (rodapé) | Campus e turma. |
| `data/referencias.json` | Todas as referências (a página Sobre lista o que estiver aqui). |
| `data/galeria.json` | Imagens com `alt`, autor, licença e fonte. Priorize esquemas e fotos próprias ou de bancos livres. |
| Todas as páginas (`<head>`) | O ícone do site é provisório (`assets/img/logo/favicon.svg`). Trocar pelo logo definitivo. |

Conferir também: a página Sobre diz "Instituto Federal Catarinense (IFC)". Confirme se é essa a forma que a equipe quer usar.

## 3. Decisões da equipe (seção 15 do planejamento)

- Nome definitivo do site e identidade visual (logo e cores finais).
- Lista final de doenças da Fase 1.
- **URL base de publicação** (GitHub Pages ou servidor do IFC). Ela é necessária para gerar os QR Codes finais em `qrcodes.html`.
- Quem redige e valida cada ficha científica.
- Quais recursos da Fase 2 entram na entrega. Prontos: busca e modo escuro. Pronto, mas sem perguntas: quiz. Não feito: mapa de incidência (depende de dados oficiais e de decisão da equipe).

## 4. Antes da Mostra

- [ ] Publicar o site e testar a URL final no celular.
- [ ] Gerar os QR Codes em `qrcodes.html` **com a URL final** (o aviso na página alerta se o endereço for local) e imprimir.
- [ ] Ler cada QR Code com um celular e conferir se abre a ficha certa.
- [ ] Confirmar que nenhuma ficha `"validado"` tem campo pendente.
- [ ] Conferir se toda imagem da galeria tem autoria e licença.
