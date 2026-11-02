/* Cabeçalho, menu e rodapé injetados em todas as páginas. */

const PAGINAS_MENU = [
  { arquivo: "index.html", texto: "Início" },
  { arquivo: "platelmintos.html", texto: "Platelmintos" },
  { arquivo: "nematelmintos.html", texto: "Nematelmintos" },
  { arquivo: "verminoses.html", texto: "Verminoses" },
  { arquivo: "prevencao.html", texto: "Prevenção" },
  { arquivo: "galeria.html", texto: "Galeria" },
  { arquivo: "sobre.html", texto: "Sobre" }
];

function nomeDaPagina() {
  const partes = location.pathname.split("/");
  const nome = partes[partes.length - 1];
  return !nome || nome === "/" ? "index.html" : nome;
}

function montarCabecalho() {
  const atual = nomeDaPagina();
  const itens = PAGINAS_MENU.map(function (pagina) {
    const destaque = pagina.arquivo === atual ? ' aria-current="page"' : "";
    return (
      '<li><a href="' + pagina.arquivo + '"' + destaque + ">" + pagina.texto + "</a></li>"
    );
  }).join("");

  return (
    '<header class="site-header">' +
      '<div class="container site-header__interno">' +
        '<a class="site-header__marca" href="index.html">Vermes que Importam</a>' +
        '<button class="menu-botao" type="button" aria-expanded="false" aria-controls="menu-principal">' +
          '<span class="sr-only">Abrir menu</span>' +
          '<span aria-hidden="true">☰</span>' +
        "</button>" +
        '<nav aria-label="Principal">' +
          '<ul id="menu-principal" class="menu">' + itens + "</ul>" +
        "</nav>" +
      "</div>" +
    "</header>"
  );
}

function montarRodape() {
  const ano = new Date().getFullYear();
  return (
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="site-footer__grade">' +
          "<div>" +
            "<p><strong>Vermes que Importam</strong></p>" +
            /* A_PREENCHER: informar campus e turma, ex.: "Campus X — Turma Y". */
            "<p>Projeto desenvolvido por estudantes do Curso Técnico em Informática para Internet, IFC. (" + ano + ")</p>" +
          "</div>" +
          "<div>" +
            '<p><strong>Atalhos</strong></p>' +
            '<ul class="site-footer__lista">' +
              '<li><a href="sobre.html">Referências e equipe</a></li>' +
              '<li><a href="prevencao.html">Prevenção</a></li>' +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<p class="site-footer__aviso">Conteúdo educativo. Não substitui avaliação médica. Em caso de sintomas, procure uma unidade de saúde.</p>' +
      "</div>" +
    "</footer>"
  );
}

function configurarMenu() {
  const botao = document.querySelector(".menu-botao");
  const header = document.querySelector(".site-header");
  if (!botao || !header) return;

  const rotulo = botao.querySelector(".sr-only");
  const links = header.querySelectorAll(".menu a");

  function abrirMenu() {
    header.classList.add("menu-aberto");
    botao.setAttribute("aria-expanded", "true");
    rotulo.textContent = "Fechar menu";
  }

  function fecharMenu(devolverFoco) {
    header.classList.remove("menu-aberto");
    botao.setAttribute("aria-expanded", "false");
    rotulo.textContent = "Abrir menu";
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener("click", function () {
    if (botao.getAttribute("aria-expanded") === "true") {
      fecharMenu(false);
    } else {
      abrirMenu();
    }
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      fecharMenu(false);
    });
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      fecharMenu(true);
    }
  });

  const mediaDesktop = window.matchMedia ? window.matchMedia("(min-width: 900px)") : null;
  if (mediaDesktop) {
    function aoMudarViewport(evento) {
      if (evento.matches) fecharMenu(false);
    }
    if (mediaDesktop.addEventListener) {
      mediaDesktop.addEventListener("change", aoMudarViewport);
    } else if (mediaDesktop.addListener) {
      mediaDesktop.addListener(aoMudarViewport);
    }
  }
}

function iniciar() {
  const alvoCabecalho = document.getElementById("cabecalho");
  const alvoRodape = document.getElementById("rodape");

  if (alvoCabecalho) alvoCabecalho.innerHTML = montarCabecalho();
  if (alvoRodape) alvoRodape.innerHTML = montarRodape();

  configurarMenu();
}

document.addEventListener("DOMContentLoaded", iniciar);
