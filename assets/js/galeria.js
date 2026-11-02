/* Galeria de imagens gerada a partir de data/galeria.json, com visualização ampliada (lightbox). */

const CAMPOS_GALERIA = ["arquivo", "legenda", "alt", "autor", "licenca", "fonte"];

function validarImagemGaleria(item) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return ["o item não é um objeto"];
  }
  const problemas = [];
  CAMPOS_GALERIA.forEach(function (campo) {
    if (typeof item[campo] !== "string" || item[campo].trim() === "") {
      problemas.push(campo + " deveria ser uma string não vazia");
    }
  });
  return problemas;
}

function ehEnderecoWeb(texto) {
  return /^https?:\/\//i.test(texto);
}

/* Preenche o contêiner com "Autor, Licença e Fonte". Autoria e licença são obrigatórias
   (regra do planejamento); se faltarem, o campo aparece como pendente para a equipe. */
function preencherCredito(alvo, item) {
  function adicionarCampo(rotulo, valor, comoLink) {
    if (alvo.childNodes.length > 0) alvo.appendChild(document.createTextNode(" · "));
    alvo.appendChild(criarElemento("strong", { texto: rotulo + ": " }));
    if (ehPendente(valor)) {
      alvo.appendChild(criarElemento("span", { classe: "pendente", texto: "A preencher pela equipe" }));
    } else if (comoLink && ehEnderecoWeb(valor)) {
      alvo.appendChild(
        criarElemento("a", {
          texto: "Link",
          atributos: { href: valor, target: "_blank", rel: "noopener noreferrer" }
        })
      );
    } else {
      alvo.appendChild(document.createTextNode(valor));
    }
  }

  alvo.textContent = "";
  adicionarCampo("Autor", item.autor, false);
  adicionarCampo("Licença", item.licenca, false);
  adicionarCampo("Fonte", item.fonte, true);
}

function iniciarGaleria() {
  const lista = document.getElementById("galeria-lista");
  if (!lista) return;

  const estado = document.getElementById("galeria-estado");
  const dialogo = document.getElementById("galeria-dialogo");
  const imagemAmpliada = document.getElementById("lightbox-imagem");
  const legendaAmpliada = document.getElementById("lightbox-legenda");
  const creditoAmpliado = document.getElementById("lightbox-credito");
  const botaoFechar = document.getElementById("lightbox-fechar");
  const lightboxDisponivel = !!(dialogo && typeof dialogo.showModal === "function");
  let abridor = null;

  function abrirLightbox(item, botaoOrigem) {
    abridor = botaoOrigem;
    imagemAmpliada.src = item.arquivo;
    imagemAmpliada.alt = item.alt;
    legendaAmpliada.textContent = item.legenda;
    preencherCredito(creditoAmpliado, item);
    dialogo.showModal();
    botaoFechar.focus();
  }

  function montarItem(item) {
    const figura = criarElemento("figure", { classe: "galeria__item" });

    const imagem = criarElemento("img", {
      classe: "galeria__imagem",
      atributos: { src: item.arquivo, alt: item.alt, loading: "lazy" }
    });

    if (lightboxDisponivel) {
      const botao = criarElemento("button", {
        classe: "galeria__abrir",
        atributos: { type: "button", "aria-label": "Ampliar imagem: " + item.legenda }
      });
      botao.appendChild(imagem);
      botao.addEventListener("click", function () {
        abrirLightbox(item, botao);
      });
      figura.appendChild(botao);
    } else {
      figura.appendChild(imagem);
    }

    const legenda = criarElemento("figcaption", { classe: "galeria__legenda" });
    legenda.appendChild(criarElemento("span", { classe: "galeria__texto", texto: item.legenda }));
    const credito = criarElemento("span", { classe: "galeria__credito" });
    preencherCredito(credito, item);
    legenda.appendChild(credito);
    figura.appendChild(legenda);
    return figura;
  }

  if (lightboxDisponivel) {
    botaoFechar.addEventListener("click", function () {
      dialogo.close();
    });
    /* Clicar fora da caixa (no fundo escurecido) também fecha. */
    dialogo.addEventListener("click", function (evento) {
      if (evento.target === dialogo) dialogo.close();
    });
    dialogo.addEventListener("close", function () {
      imagemAmpliada.removeAttribute("src");
      if (abridor) abridor.focus();
    });
  }

  carregarJSON("data/galeria.json")
    .then(function (dados) {
      if (!Array.isArray(dados)) {
        throw new Error("data/galeria.json deveria conter uma lista.");
      }

      const validas = dados.filter(function (item) {
        const problemas = validarImagemGaleria(item);
        if (problemas.length) {
          const id = item && item.id ? item.id : "(sem id)";
          console.warn("validarImagemGaleria [" + id + "]: " + problemas.join("; "));
        }
        /* Sem arquivo ou alt não há como exibir a imagem de forma acessível. */
        return item && typeof item.arquivo === "string" && item.arquivo.trim() !== "" &&
          typeof item.alt === "string" && item.alt.trim() !== "";
      });

      if (estado) estado.remove();
      lista.textContent = "";

      if (validas.length === 0) {
        lista.insertAdjacentElement(
          "afterend",
          criarElemento("p", {
            classe: "estado-mensagem",
            texto: "As imagens da galeria serão adicionadas em breve."
          })
        );
        return;
      }

      validas.forEach(function (item) {
        const legendaSegura = Object.assign({}, item, {
          legenda: typeof item.legenda === "string" && item.legenda.trim() !== "" ? item.legenda : item.alt
        });
        lista.appendChild(montarItem(legendaSegura));
      });
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
      lista.remove();
    });
}

document.addEventListener("DOMContentLoaded", iniciarGaleria);
