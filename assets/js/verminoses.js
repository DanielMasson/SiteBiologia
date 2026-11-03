/* Lista de verminoses gerada a partir de data/doencas.json, com filtro por filo e busca por texto. */

const GRUPOS_FILO = {
  platelmintos: "Platelmintos",
  nematelmintos: "Nematelmintos"
};

function iniciarVerminoses() {
  const lista = document.getElementById("lista-doencas");
  if (!lista) return;

  const estado = document.getElementById("lista-estado");
  const resultadoFiltro = document.getElementById("resultado-filtro");
  const botoes = Array.prototype.slice.call(document.querySelectorAll(".filtro__botao"));
  const campoBusca = document.getElementById("busca");
  let doencas = [];
  let grupoAtual = "todos";

  function grupoAtualDaURL() {
    const valor = new URLSearchParams(location.search).get("grupo");
    return GRUPOS_FILO[valor] ? valor : "todos";
  }

  function termoDaURL() {
    return new URLSearchParams(location.search).get("q") || "";
  }

  function atualizarURL(grupo, termo) {
    const url = new URL(location.href);
    if (grupo === "todos") {
      url.searchParams.delete("grupo");
    } else {
      url.searchParams.set("grupo", grupo);
    }
    if (termo.trim() === "") {
      url.searchParams.delete("q");
    } else {
      url.searchParams.set("q", termo.trim());
    }
    history.replaceState(null, "", url);
  }

  function textoContagem(quantidade) {
    return quantidade === 1 ? "Mostrando 1 doença" : "Mostrando " + quantidade + " doenças";
  }

  function aplicarFiltro(grupo, atualizarURLDaPagina) {
    grupoAtual = grupo;
    const termo = campoBusca ? campoBusca.value : "";
    const termoNormalizado = normalizarTexto(termo);
    const filoEsperado = GRUPOS_FILO[grupo];

    const filtradas = doencas.filter(function (doenca) {
      if (filoEsperado && nomeFilo(doenca.filo) !== filoEsperado) return false;
      return termoNormalizado === "" || textoBuscavel(doenca).indexOf(termoNormalizado) !== -1;
    });

    lista.textContent = "";
    filtradas.forEach(function (doenca) {
      lista.appendChild(montarCardDoenca(doenca));
    });

    let mensagemVazia = document.getElementById("lista-vazia");
    if (filtradas.length === 0) {
      const texto =
        termoNormalizado !== ""
          ? "Nenhuma doença encontrada para essa busca. Tente outra palavra ou limpe o campo."
          : "Nenhuma doença cadastrada neste grupo ainda.";
      if (!mensagemVazia) {
        mensagemVazia = criarElemento("p", {
          classe: "estado-mensagem",
          atributos: { id: "lista-vazia" }
        });
        lista.insertAdjacentElement("afterend", mensagemVazia);
      }
      mensagemVazia.textContent = texto;
    } else if (mensagemVazia) {
      mensagemVazia.remove();
    }

    botoes.forEach(function (botao) {
      botao.setAttribute("aria-pressed", botao.dataset.grupo === grupo ? "true" : "false");
    });

    if (resultadoFiltro) resultadoFiltro.textContent = textoContagem(filtradas.length);
    if (atualizarURLDaPagina) atualizarURL(grupo, termo);
  }

  function mostrarErro() {
    if (estado) montarErroCarregamento(estado);
    lista.remove();
  }

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      aplicarFiltro(botao.dataset.grupo, true);
    });
  });

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      if (doencas.length === 0) return; /* dados ainda não carregaram */
      aplicarFiltro(grupoAtual, true);
    });
  }

  carregarJSON("data/doencas.json")
    .then(function (dados) {
      doencas = ordenarPorNome(dados);
      doencas.forEach(function (doenca) {
        const problemas = validarDoenca(doenca);
        if (problemas.length) {
          console.warn("validarDoenca [" + doenca.id + "]: " + problemas.join("; "));
        }
      });
      if (estado) estado.remove();
      if (campoBusca) campoBusca.value = termoDaURL();
      aplicarFiltro(grupoAtualDaURL(), false);
    })
    .catch(function (erro) {
      console.warn(erro.message);
      mostrarErro();
    });
}

document.addEventListener("DOMContentLoaded", iniciarVerminoses);
