/* Lista as doenças de um filo nas páginas dos grupos zoológicos.
   O filo vem do atributo data-filo do contêiner (#doencas-do-grupo). */

function iniciarDoencasDoGrupo() {
  const alvo = document.getElementById("doencas-do-grupo");
  if (!alvo) return;

  const estado = document.getElementById("grupo-estado");
  const filo = alvo.dataset.filo;

  carregarJSON("data/doencas.json")
    .then(function (dados) {
      const doGrupo = ordenarPorNome(dados).filter(function (doenca) {
        return doenca.filo === filo;
      });

      if (estado) estado.remove();
      alvo.textContent = "";

      if (doGrupo.length === 0) {
        alvo.insertAdjacentElement(
          "afterend",
          criarElemento("p", {
            classe: "estado-mensagem",
            texto: "Nenhuma doença cadastrada neste grupo ainda."
          })
        );
        return;
      }

      doGrupo.forEach(function (doenca) {
        alvo.appendChild(montarCardDoenca(doenca, "h3"));
      });
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
    });
}

document.addEventListener("DOMContentLoaded", iniciarDoencasDoGrupo);
