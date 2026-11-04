/* Ficha individual da doença: lê o id na URL e monta a partir de data/doencas.json. */

const TEXTO_ALERTA =
  "Conteúdo educativo. Não substitui avaliação médica. Em caso de sintomas, procure uma unidade de saúde.";
const TEXTO_RASCUNHO =
  "Esta ficha está em revisão pela equipe. Algumas informações ainda serão adicionadas.";
const TEXTO_PENDENTE = "A preencher pela equipe";
const TEXTO_SEM_REFERENCIAS =
  "Referências desta ficha serão adicionadas após a revisão da equipe.";

function criarPendente() {
  return criarElemento("span", { classe: "pendente", texto: TEXTO_PENDENTE });
}

function criarSecao(titulo) {
  const secao = criarElemento("section", { classe: "ficha__secao" });
  secao.appendChild(criarElemento("h2", { texto: titulo }));
  return secao;
}

function criarListaAgentes(agentes) {
  const paragrafo = criarElemento("p", { classe: "ficha__agentes" });
  agentes.forEach(function (agente, indice) {
    if (indice > 0) paragrafo.appendChild(document.createTextNode(", "));
    paragrafo.appendChild(criarElemento("em", { texto: agente }));
  });
  return paragrafo;
}

function criarListaItens(itens, pendenteVisivel) {
  if (ehPendente(itens)) {
    const lista = criarElemento("ul", { classe: "ficha__lista" });
    if (pendenteVisivel) {
      const item = criarElemento("li");
      item.appendChild(criarPendente());
      lista.appendChild(item);
    }
    return lista;
  }
  const lista = criarElemento("ul", { classe: "ficha__lista" });
  itens.forEach(function (texto) {
    lista.appendChild(criarElemento("li", { texto: texto }));
  });
  return lista;
}

function criarQuadroRapido(doenca, pendenteVisivel) {
  const dl = criarElemento("dl", { classe: "quadro-rapido" });

  function adicionarLinha(rotulo, valor) {
    if (valor === null || valor === undefined) return;
    if (ehPendente(valor)) {
      if (!pendenteVisivel) return;
      dl.appendChild(criarElemento("dt", { texto: rotulo }));
      const ddPendente = criarElemento("dd");
      ddPendente.appendChild(criarPendente());
      dl.appendChild(ddPendente);
      return;
    }
    dl.appendChild(criarElemento("dt", { texto: rotulo }));
    dl.appendChild(criarElemento("dd", { texto: String(valor) }));
  }

  adicionarLinha("Grupo", nomeFilo(doenca.filo));
  adicionarLinha("Classe", doenca.classe);
  adicionarLinha("Hospedeiro definitivo", doenca.hospedeiroDefinitivo);
  adicionarLinha("Hospedeiro intermediário", doenca.hospedeiroIntermediario);
  if (!ehPendente(doenca.transmissao)) {
    adicionarLinha("Forma de transmissão", doenca.transmissao);
  }
  return dl;
}

function criarSecaoCiclo(doenca, pendenteVisivel) {
  const secao = criarSecao("Ciclo de vida");

  if (doenca.imagemCiclo) {
    secao.appendChild(
      criarElemento("img", {
        atributos: {
          src: doenca.imagemCiclo,
          alt: "Esquema do ciclo de vida de " + doenca.nomePopular + ", descrito nos passos abaixo",
          loading: "lazy"
        }
      })
    );
  }

  const passos = criarElemento("ol", { classe: "passos" });
  if (ehPendente(doenca.cicloDeVida)) {
    if (pendenteVisivel) {
      const item = criarElemento("li");
      item.appendChild(criarPendente());
      passos.appendChild(item);
    }
  } else {
    doenca.cicloDeVida.forEach(function (texto) {
      passos.appendChild(criarElemento("li", { texto: texto }));
    });
  }
  secao.appendChild(passos);
  return secao;
}

function criarSecaoAlerta() {
  const secao = criarSecao("Alerta de saúde");
  const caixa = criarElemento("div", { classe: "alerta-saude", atributos: { role: "note" } });
  caixa.appendChild(criarElemento("span", { classe: "alerta-saude__icone", texto: "⚠", atributos: { "aria-hidden": "true" } }));
  caixa.appendChild(document.createTextNode(TEXTO_ALERTA));
  secao.appendChild(caixa);
  return secao;
}

function criarSecaoReferencias(doenca, referencias) {
  const secao = criarSecao("Referências");
  const ids = Array.isArray(doenca.referencias) ? doenca.referencias : [];

  if (ids.length === 0) {
    secao.appendChild(criarElemento("p", { texto: TEXTO_SEM_REFERENCIAS }));
    return secao;
  }

  const lista = criarElemento("ul", { classe: "ficha__lista" });
  let alguma = false;

  ids.forEach(function (idReferencia) {
    const referencia = referencias.find(function (item) {
      return item.id === idReferencia;
    });
    if (!referencia) {
      console.warn("Referência não encontrada em referencias.json: " + idReferencia);
      return;
    }
    alguma = true;
    const item = criarElemento("li");
    item.appendChild(
      document.createTextNode(
        referencia.titulo + " — " + referencia.instituicao + " (" + referencia.ano + ")."
      )
    );
    if (referencia.url) {
      item.appendChild(document.createTextNode(" "));
      item.appendChild(
        criarElemento("a", {
          texto: "Link",
          atributos: { href: referencia.url, target: "_blank", rel: "noopener noreferrer" }
        })
      );
    }
    lista.appendChild(item);
  });

  secao.appendChild(alguma ? lista : criarElemento("p", { texto: TEXTO_SEM_REFERENCIAS }));
  return secao;
}

function criarNavegacao(doenca, doencas) {
  const indice = doencas.findIndex(function (item) {
    return item.id === doenca.id;
  });

  const nav = criarElemento("nav", {
    classe: "ficha-nav",
    atributos: { "aria-label": "Navegação entre fichas" }
  });

  function linkFicha(doencaAlvo, rotulo) {
    const link = criarElemento("a", {
      classe: "ficha-nav__link",
      atributos: { href: "doenca.html?id=" + encodeURIComponent(doencaAlvo.id) }
    });
    link.appendChild(criarElemento("span", { classe: "ficha-nav__rotulo", texto: rotulo }));
    link.appendChild(criarElemento("span", { classe: "ficha-nav__nome", texto: doencaAlvo.nomePopular }));
    return link;
  }

  if (indice > 0) nav.appendChild(linkFicha(doencas[indice - 1], "Anterior"));
  if (indice > -1 && indice < doencas.length - 1) nav.appendChild(linkFicha(doencas[indice + 1], "Próxima"));

  const wrapper = criarElemento("div", { classe: "ficha__navegacao" });
  wrapper.appendChild(nav);

  const voltar = criarElemento("p");
  voltar.appendChild(
    criarElemento("a", {
      texto: "Voltar para todas as verminoses",
      atributos: { href: "verminoses.html" }
    })
  );
  wrapper.appendChild(voltar);
  return wrapper;
}

function renderizarFicha(alvo, doenca, doencas, referencias) {
  alvo.textContent = "";
  const pendenteVisivel = doenca.statusConteudo !== "validado";

  const cabecalho = criarElemento("div", { classe: "ficha__cabecalho" });
  cabecalho.appendChild(
    criarElemento("h1", {
      texto: doenca.nomePopular,
      atributos: { id: "ficha-titulo", tabindex: "-1" }
    })
  );
  cabecalho.appendChild(criarListaAgentes(doenca.agentes));

  const etiquetas = criarElemento("p", { classe: "ficha__etiquetas" });
  etiquetas.appendChild(criarElemento("span", { classe: "etiqueta", texto: nomeFilo(doenca.filo) }));
  if (doenca.classe) {
    etiquetas.appendChild(criarElemento("span", { classe: "etiqueta", texto: doenca.classe }));
  }
  cabecalho.appendChild(etiquetas);

  if (doenca.statusConteudo === "rascunho") {
    const aviso = criarElemento("p", { classe: "aviso-rascunho" });
    aviso.appendChild(
      criarElemento("span", { classe: "aviso-rascunho__icone", texto: "ℹ", atributos: { "aria-hidden": "true" } })
    );
    aviso.appendChild(document.createTextNode(TEXTO_RASCUNHO));
    cabecalho.appendChild(aviso);
  }
  alvo.appendChild(cabecalho);

  const secaoResumo = criarSecao("Resumo");
  if (ehPendente(doenca.resumo)) {
    if (pendenteVisivel) secaoResumo.appendChild(criarPendente());
  } else {
    secaoResumo.appendChild(criarElemento("p", { texto: doenca.resumo }));
  }
  alvo.appendChild(secaoResumo);

  const secaoQuadro = criarSecao("Quadro rápido");
  secaoQuadro.appendChild(criarQuadroRapido(doenca, pendenteVisivel));
  alvo.appendChild(secaoQuadro);

  alvo.appendChild(criarSecaoCiclo(doenca, pendenteVisivel));

  const secaoTransmissao = criarSecao("Como se pega (transmissão)");
  if (ehPendente(doenca.transmissao)) {
    if (pendenteVisivel) secaoTransmissao.appendChild(criarPendente());
  } else {
    secaoTransmissao.appendChild(criarElemento("p", { texto: doenca.transmissao }));
  }
  alvo.appendChild(secaoTransmissao);

  const secaoSintomas = criarSecao("Sintomas comuns");
  secaoSintomas.appendChild(criarListaItens(doenca.sintomas, pendenteVisivel));
  alvo.appendChild(secaoSintomas);

  const secaoPrevencao = criarSecao("Prevenção");
  secaoPrevencao.appendChild(criarListaItens(doenca.prevencao, pendenteVisivel));
  alvo.appendChild(secaoPrevencao);

  alvo.appendChild(criarSecaoAlerta());
  alvo.appendChild(criarSecaoReferencias(doenca, referencias));
  alvo.appendChild(criarNavegacao(doenca, doencas));
}

function atualizarMeta(doenca) {
  document.title = doenca.nomePopular + " | Vermes que Importam";
  if (!ehPendente(doenca.resumo)) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", doenca.resumo);
  }
}

function exibirErro(alvo, mensagem, opcaoRecarregar) {
  alvo.textContent = "";
  alvo.appendChild(
    criarElemento("h1", { texto: "Ficha da doença", atributos: { id: "ficha-titulo", tabindex: "-1" } })
  );

  const bloco = criarElemento("div", {
    classe: "estado-mensagem estado-mensagem--erro",
    atributos: { role: "alert" }
  });
  bloco.appendChild(criarElemento("p", { texto: mensagem }));

  if (opcaoRecarregar) {
    const botao = criarElemento("button", {
      classe: "botao",
      texto: "Recarregar a página",
      atributos: { type: "button" }
    });
    botao.addEventListener("click", function () {
      location.reload();
    });
    bloco.appendChild(botao);
  } else {
    bloco.appendChild(
      criarElemento("a", {
        classe: "botao",
        texto: "Ver todas as verminoses",
        atributos: { href: "verminoses.html" }
      })
    );
  }
  alvo.appendChild(bloco);
}

function iniciarDoenca() {
  const alvo = document.getElementById("ficha");
  if (!alvo) return;

  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    exibirErro(alvo, "Nenhuma ficha foi informada.");
    return;
  }

  Promise.all([carregarJSON("data/doencas.json"), carregarJSON("data/referencias.json")])
    .then(function (resultado) {
      const doencas = ordenarPorNome(resultado[0]);
      const referencias = resultado[1];
      const doenca = doencas.find(function (item) {
        return item.id === id;
      });

      if (!doenca) {
        exibirErro(alvo, "Não encontramos essa ficha.");
        return;
      }

      validarDoenca(doenca).forEach(function (problema) {
        console.warn("validarDoenca [" + doenca.id + "]: " + problema);
      });
      if (doenca.statusConteudo === "validado" && temCampoPendente(doenca)) {
        console.warn("ficha validada com campo pendente: " + doenca.id);
      }

      atualizarMeta(doenca);
      renderizarFicha(alvo, doenca, doencas, referencias);

      const titulo = document.getElementById("ficha-titulo");
      if (titulo) titulo.focus();
    })
    .catch(function (erro) {
      console.warn(erro.message);
      exibirErro(alvo, "Não foi possível carregar os dados. Tente novamente em instantes.", true);
    });
}

document.addEventListener("DOMContentLoaded", iniciarDoenca);
