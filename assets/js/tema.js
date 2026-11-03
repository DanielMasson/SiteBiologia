/* Aplica o tema escolhido antes da página aparecer, para não piscar em branco.
   Carregado sem "defer", no <head>. Sem escolha guardada, o CSS segue o tema do sistema. */
(function () {
  try {
    var escolha = localStorage.getItem("vermes-tema");
    if (escolha === "claro" || escolha === "escuro") {
      document.documentElement.setAttribute("data-tema", escolha);
    }
  } catch (erro) {
    /* Armazenamento indisponível (modo privado, por exemplo): fica o tema do sistema. */
  }
})();
