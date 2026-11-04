/* Quiz gerado a partir de data/quiz.json. Só aparecem perguntas com statusConteudo "validado".
   Formato de cada pergunta: ver o README ("Como adicionar perguntas ao quiz"). */

function validarPerguntaQuiz(pergunta) {
  if (!pergunta || typeof pergunta !== "object" || Array.isArray(pergunta)) {
    return ["a pergunta não é um objeto"];
  }
  const problemas = [];

  ["id", "pergunta", "explicacao"].forEach(function (campo) {
    if (typeof pergunta[campo] !== "string" || pergunta[campo].trim() === "") {
      problemas.push(campo + " deveria ser uma string não vazia");
    }
  });

  const alternativas = pergunta.alternativas;
  if (!Array.isArray(alternativas) || alternativas.length < 2 || alternativas.length > 6) {
    problemas.push("alternativas deveria ser uma lista de 2 a 6 textos");
  } else {
    alternativas.forEach(function (texto, i) {
      if (typeof texto !== "string" || texto.trim() === "") {
        problemas.push("alternativas[" + i + "] deveria ser um texto não vazio");
      }
    });
    if (!Number.isInteger(pergunta.correta) || pergunta.correta < 0 || pergunta.correta >= alternativas.length) {
      problemas.push("correta deveria ser a posição (começando em 0) de uma das alternativas");
    }
  }

  if (pergunta.statusConteudo !== "rascunho" && pergunta.statusConteudo !== "validado") {
    problemas.push('statusConteudo deveria ser "rascunho" ou "validado"');
  }

  /* Pergunta validada não pode ter campo pendente. */
  if (pergunta.statusConteudo === "validado") {
    const textos = [pergunta.pergunta, pergunta.explicacao].concat(Array.isArray(alternativas) ? alternativas : []);
    if (textos.some(ehPendente)) {
      problemas.push("pergunta validada não pode conter A_PREENCHER nem campos vazios");
    }
  }
  return problemas;
}

function iniciarQuiz() {
  const area = document.getElementById("quiz-area");
  if (!area) return;
  const estado = document.getElementById("quiz-estado");

  let perguntas = [];
  let indice = 0;
  let acertos = 0;

  function limpar() {
    area.textContent = "";
  }

  function mostrarPergunta() {
    const atual = perguntas[indice];
    limpar();

    const cartao = criarElemento("form", { classe: "quiz__cartao", atributos: { novalidate: "" } });
    cartao.appendChild(
      criarElemento("p", {
        classe: "quiz__progresso",
        texto: "Pergunta " + (indice + 1) + " de " + perguntas.length
      })
    );

    const grupo = criarElemento("fieldset", { classe: "quiz__grupo" });
    grupo.appendChild(criarElemento("legend", { classe: "quiz__pergunta", texto: atual.pergunta }));

    atual.alternativas.forEach(function (texto, i) {
      const rotulo = criarElemento("label", { classe: "quiz__opcao" });
      const entrada = criarElemento("input", {
        atributos: { type: "radio", name: "alternativa", value: String(i) }
      });
      rotulo.appendChild(entrada);
      rotulo.appendChild(criarElemento("span", { texto: texto }));
      grupo.appendChild(rotulo);
    });
    cartao.appendChild(grupo);

    const feedback = criarElemento("div", {
      classe: "quiz__feedback",
      atributos: { role: "status", "aria-live": "polite" }
    });
    cartao.appendChild(feedback);

    const acoes = criarElemento("div", { classe: "qr-acoes" });
    const responder = criarElemento("button", { classe: "botao", texto: "Responder", atributos: { type: "submit" } });
    acoes.appendChild(responder);
    cartao.appendChild(acoes);

    cartao.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (cartao.dataset.respondida === "sim") return;

      const marcada = cartao.querySelector('input[name="alternativa"]:checked');
      if (!marcada) {
        feedback.className = "quiz__feedback quiz__feedback--aviso";
        feedback.textContent = "Escolha uma alternativa antes de responder.";
        return;
      }

      cartao.dataset.respondida = "sim";
      const escolhida = Number(marcada.value);
      const acertou = escolhida === atual.correta;
      if (acertou) acertos++;

      cartao.querySelectorAll("input").forEach(function (campo) {
        campo.disabled = true;
      });
      const rotulos = cartao.querySelectorAll(".quiz__opcao");
      rotulos[atual.correta].classList.add("quiz__opcao--certa");
      if (!acertou) rotulos[escolhida].classList.add("quiz__opcao--errada");

      feedback.className = "quiz__feedback " + (acertou ? "quiz__feedback--certo" : "quiz__feedback--errado");
      feedback.textContent = "";
      feedback.appendChild(
        criarElemento("strong", {
          texto: acertou ? "Certo! " : "Não foi dessa vez. A resposta certa é: " + atual.alternativas[atual.correta] + ". "
        })
      );
      feedback.appendChild(document.createTextNode(atual.explicacao));

      acoes.textContent = "";
      const ultima = indice === perguntas.length - 1;
      const proxima = criarElemento("button", {
        classe: "botao",
        texto: ultima ? "Ver resultado" : "Próxima pergunta",
        atributos: { type: "button" }
      });
      proxima.addEventListener("click", function () {
        if (ultima) {
          mostrarResultado();
        } else {
          indice++;
          mostrarPergunta();
        }
      });
      acoes.appendChild(proxima);
      proxima.focus();
    });

    area.appendChild(cartao);
  }

  function mostrarResultado() {
    limpar();
    const cartao = criarElemento("div", { classe: "quiz__cartao" });
    const titulo = criarElemento("h2", { texto: "Resultado", atributos: { tabindex: "-1" } });
    cartao.appendChild(titulo);
    cartao.appendChild(
      criarElemento("p", {
        classe: "quiz__placar",
        texto: "Você acertou " + acertos + " de " + perguntas.length + "."
      })
    );

    const acoes = criarElemento("div", { classe: "qr-acoes" });
    const refazer = criarElemento("button", { classe: "botao", texto: "Refazer o quiz", atributos: { type: "button" } });
    refazer.addEventListener("click", function () {
      indice = 0;
      acertos = 0;
      mostrarPergunta();
      const legenda = area.querySelector("legend");
      if (legenda) legenda.scrollIntoView({ block: "nearest" });
    });
    acoes.appendChild(refazer);
    acoes.appendChild(criarElemento("a", { classe: "botao botao--secundario", texto: "Ver as verminoses", atributos: { href: "verminoses.html" } }));
    cartao.appendChild(acoes);
    area.appendChild(cartao);
    titulo.focus();
  }

  carregarJSON("data/quiz.json")
    .then(function (dados) {
      if (!Array.isArray(dados)) {
        throw new Error("data/quiz.json deveria conter uma lista.");
      }

      perguntas = dados.filter(function (pergunta) {
        const problemas = validarPerguntaQuiz(pergunta);
        if (problemas.length) {
          const id = pergunta && pergunta.id ? pergunta.id : "(sem id)";
          console.warn("validarPerguntaQuiz [" + id + "]: " + problemas.join("; "));
          return false;
        }
        return pergunta.statusConteudo === "validado";
      });

      if (estado) estado.remove();

      if (perguntas.length === 0) {
        area.appendChild(
          criarElemento("p", {
            classe: "estado-mensagem",
            texto: "Nenhuma pergunta disponível no momento."
          })
        );
        return;
      }
      mostrarPergunta();
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
    });
}

document.addEventListener("DOMContentLoaded", iniciarQuiz);
