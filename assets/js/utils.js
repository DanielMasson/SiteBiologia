/* Utilitários compartilhados por verminoses.js, doenca.js, doencas-do-grupo.js e prevencao.js. */

const NOMES_FILOS = {
  Platyhelminthes: "Platelmintos",
  Nematoda: "Nematelmintos"
};

function carregarJSON(caminho) {
  return fetch(caminho).then(function (resposta) {
    if (!resposta.ok) {
      throw new Error("Não foi possível carregar " + caminho + " (HTTP " + resposta.status + ").");
    }
    return resposta.json();
  });
}

function criarElemento(tag, opcoes) {
  const op = opcoes || {};
  const elemento = document.createElement(tag);
  if (op.classe) elemento.className = op.classe;
  if (op.texto !== undefined && op.texto !== null) {
    elemento.textContent = op.texto;
  }
  const atributos = op.atributos || {};
  Object.keys(atributos).forEach(function (nome) {
    elemento.setAttribute(nome, atributos[nome]);
  });
  return elemento;
}

function nomeFilo(filoCientifico) {
  return NOMES_FILOS[filoCientifico] || filoCientifico || "";
}

function ehPendente(valor) {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === "string") {
    const limpo = valor.trim();
    return limpo === "" || limpo === "A_PREENCHER";
  }
  if (Array.isArray(valor)) {
    return valor.length === 0 || valor.every(ehPendente);
  }
  return false;
}

function validarDoenca(doenca) {
  const problemas = [];
  if (!doenca || typeof doenca !== "object" || Array.isArray(doenca)) {
    return ["a ficha não é um objeto"];
  }

  function textoNaoVazio(campo) {
    const valor = doenca[campo];
    if (typeof valor !== "string" || valor.trim() === "") {
      problemas.push(campo + " deveria ser uma string não vazia");
    }
  }

  function listaDeTextos(campo) {
    const valor = doenca[campo];
    if (!Array.isArray(valor) || valor.length === 0) {
      problemas.push(campo + " deveria ser uma lista não vazia");
      return;
    }
    valor.forEach(function (item, indice) {
      if (typeof item !== "string" || item.trim() === "") {
        problemas.push(campo + "[" + indice + "] deveria ser uma string não vazia");
      }
    });
  }

  function textoOuNulo(campo) {
    const valor = doenca[campo];
    if (valor !== null && typeof valor !== "string") {
      problemas.push(campo + " deveria ser string ou null");
    }
  }

  if (typeof doenca.id !== "string" || !/^[a-z0-9-]+$/.test(doenca.id)) {
    problemas.push("id deveria conter apenas letras minúsculas, números e hífen");
  }
  if (doenca.statusConteudo !== "rascunho" && doenca.statusConteudo !== "validado") {
    problemas.push('statusConteudo deveria ser "rascunho" ou "validado"');
  }

  textoNaoVazio("nomePopular");
  listaDeTextos("agentes");
  textoNaoVazio("filo");
  textoOuNulo("classe");
  textoNaoVazio("resumo");
  textoNaoVazio("hospedeiroDefinitivo");
  textoOuNulo("hospedeiroIntermediario");
  textoNaoVazio("transmissao");
  listaDeTextos("cicloDeVida");
  textoOuNulo("imagemCiclo");
  listaDeTextos("sintomas");
  listaDeTextos("prevencao");

  if (!Array.isArray(doenca.referencias)) {
    problemas.push("referencias deveria ser uma lista");
  } else {
    doenca.referencias.forEach(function (ref, indice) {
      if (typeof ref !== "string" || ref.trim() === "") {
        problemas.push("referencias[" + indice + "] deveria ser um id (string)");
      }
    });
  }

  return problemas;
}

function ordenarPorNome(doencas) {
  return doencas.slice().sort(function (a, b) {
    return a.nomePopular.localeCompare(b.nomePopular, "pt-BR");
  });
}

function temCampoPendente(doenca) {
  return (
    ehPendente(doenca.nomePopular) ||
    ehPendente(doenca.agentes) ||
    ehPendente(doenca.resumo) ||
    ehPendente(doenca.hospedeiroDefinitivo) ||
    ehPendente(doenca.transmissao) ||
    ehPendente(doenca.cicloDeVida) ||
    ehPendente(doenca.sintomas) ||
    ehPendente(doenca.prevencao)
  );
}

/* Card inteiro clicável que leva à ficha da doença.
   `tagTitulo` permite usar h2 (páginas cujo título principal é o h1 da lista)
   ou h3 (quando os cards ficam dentro de uma seção com h2). */
function montarCardDoenca(doenca, tagTitulo) {
  const link = criarElemento("a", {
    classe: "card card--link",
    atributos: { href: "doenca.html?id=" + encodeURIComponent(doenca.id) }
  });

  link.appendChild(criarElemento("span", { classe: "etiqueta", texto: nomeFilo(doenca.filo) }));
  if (doenca.statusConteudo === "rascunho") {
    link.appendChild(criarElemento("span", { classe: "etiqueta etiqueta--rascunho", texto: "Em revisão" }));
  }

  link.appendChild(criarElemento(tagTitulo || "h2", { classe: "card__titulo", texto: doenca.nomePopular }));

  const agentes = criarElemento("p", { classe: "card__texto" });
  doenca.agentes.forEach(function (agente, indice) {
    if (indice > 0) agentes.appendChild(document.createTextNode(", "));
    agentes.appendChild(criarElemento("em", { texto: agente }));
  });
  link.appendChild(agentes);

  if (!ehPendente(doenca.resumo)) {
    link.appendChild(criarElemento("p", { classe: "card__texto", texto: doenca.resumo }));
  }

  link.appendChild(criarElemento("span", { classe: "card__acao", texto: "Ver ficha" }));
  return link;
}

function montarErroCarregamento(estado) {
  estado.removeAttribute("role");
  estado.setAttribute("role", "alert");
  estado.classList.add("estado-mensagem--erro");
  estado.textContent = "Não foi possível carregar os dados. Tente novamente em instantes.";
  const botao = criarElemento("button", {
    classe: "botao",
    texto: "Recarregar a página",
    atributos: { type: "button" }
  });
  botao.addEventListener("click", function () {
    location.reload();
  });
  estado.insertAdjacentElement("afterend", botao);
}
