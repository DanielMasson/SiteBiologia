/* Tabela "Doença x principal medida de prevenção" gerada de data/doencas.json. */

function iniciarPrevencao() {
  const corpo = document.getElementById("corpo-tabela-prevencao");
  if (!corpo) return;

  const estado = document.getElementById("tabela-estado");

  carregarJSON("data/doencas.json")
    .then(function (dados) {
      const doencas = ordenarPorNome(dados);
      if (estado) estado.remove();
      corpo.textContent = "";

      doencas.forEach(function (doenca) {
        const linha = criarElemento("tr");

        const titulo = criarElemento("th", { atributos: { scope: "row" } });
        titulo.appendChild(
          criarElemento("a", {
            texto: doenca.nomePopular,
            atributos: { href: "doenca.html?id=" + encodeURIComponent(doenca.id) }
          })
        );
        linha.appendChild(titulo);

        const medida = criarElemento("td");
        const primeiraMedida = Array.isArray(doenca.prevencao)
          ? doenca.prevencao.find(function (item) {
              return !ehPendente(item);
            })
          : null;

        if (primeiraMedida) {
          medida.textContent = primeiraMedida;
        } else {
          medida.appendChild(
            criarElemento("span", { classe: "pendente", texto: "A preencher pela equipe" })
          );
        }
        linha.appendChild(medida);
        corpo.appendChild(linha);
      });
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
    });
}

document.addEventListener("DOMContentLoaded", iniciarPrevencao);
