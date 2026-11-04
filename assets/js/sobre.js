/* Lista de referências da página Sobre, gerada a partir de data/referencias.json. */

function montarReferencia(referencia) {
  const item = criarElemento("li");
  const partes = [referencia.titulo];
  if (!ehPendente(referencia.instituicao)) partes.push(referencia.instituicao);
  let texto = partes.join(" — ");
  if (referencia.ano !== undefined && referencia.ano !== null && referencia.ano !== "") {
    texto += " (" + referencia.ano + ")";
  }
  item.appendChild(document.createTextNode(texto + "."));

  if (typeof referencia.url === "string" && /^https?:\/\//i.test(referencia.url)) {
    item.appendChild(document.createTextNode(" "));
    item.appendChild(
      criarElemento("a", {
        texto: "Link",
        atributos: { href: referencia.url, target: "_blank", rel: "noopener noreferrer" }
      })
    );
  }
  return item;
}

function iniciarSobre() {
  const lista = document.getElementById("lista-referencias");
  if (!lista) return;

  const estado = document.getElementById("referencias-estado");

  carregarJSON("data/referencias.json")
    .then(function (dados) {
      if (!Array.isArray(dados)) {
        throw new Error("data/referencias.json deveria conter uma lista.");
      }

      const validas = dados.filter(function (referencia) {
        const ok = referencia && typeof referencia.titulo === "string" && referencia.titulo.trim() !== "";
        if (!ok) console.warn("Referência ignorada (sem título): " + JSON.stringify(referencia));
        return ok;
      });

      validas.sort(function (a, b) {
        return a.titulo.localeCompare(b.titulo, "pt-BR");
      });

      if (estado) estado.remove();

      if (validas.length === 0) {
        lista.insertAdjacentElement(
          "afterend",
          criarElemento("p", {
            texto: "Nenhuma referência cadastrada."
          })
        );
        lista.remove();
        return;
      }

      validas.forEach(function (referencia) {
        lista.appendChild(montarReferencia(referencia));
      });
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
      lista.remove();
    });
}

document.addEventListener("DOMContentLoaded", iniciarSobre);
