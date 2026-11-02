/* Lista de verminoses gerada a partir de data/doencas.json, com filtro por filo. */

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
  let doencas = [];

  function grupoAtualDaURL() {
    const valor = new URLSearchParams(location.search).get("grupo");
    return GRUPOS_FILO[valor] ? valor : "todos";
  }

  function atualizarURL(grupo) {
    const url = new URL(location.href);
    if (grupo === "todos") {
      url.searchParams.delete("grupo");
    } else {
      url.searchParams.set("grupo", grupo);
    }
    history.replaceState(null, "", url);
  }

  function textoContagem(quantidade) {
    return quantidade === 1 ? "Mostrando 1 doença" : "Mostrando " + quantidade + " doenças";
  }

  function aplicarFiltro(grupo, atualizarURLDaPagina) {
    const filoEsperado = GRUPOS_FILO[grupo];
    const filtradas = filoEsperado
      ? doencas.filter(function (doenca) {
          return nomeFilo(doenca.filo) === filoEsperado;
        })
      : doencas;

    lista.textContent = "";
    filtradas.forEach(function (doenca) {
      lista.appendChild(montarCardDoenca(doenca));
    });

    let mensagemVazia = document.getElementById("lista-vazia");
    if (filtradas.length === 0) {
      if (!mensagemVazia) {
        mensagemVazia = criarElemento("p", {
          classe: "estado-mensagem",
          texto: "Nenhuma doença cadastrada neste grupo ainda.",
          atributos: { id: "lista-vazia" }
        });
        lista.insertAdjacentElement("afterend", mensagemVazia);
      }
    } else if (mensagemVazia) {
      mensagemVazia.remove();
    }

    botoes.forEach(function (botao) {
      botao.setAttribute("aria-pressed", botao.dataset.grupo === grupo ? "true" : "false");
    });

    if (resultadoFiltro) resultadoFiltro.textContent = textoContagem(filtradas.length);
    if (atualizarURLDaPagina) atualizarURL(grupo);
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
      aplicarFiltro(grupoAtualDaURL(), false);
    })
    .catch(function (erro) {
      console.warn(erro.message);
      mostrarErro();
    });
}

document.addEventListener("DOMContentLoaded", iniciarVerminoses);
