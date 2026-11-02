/* Página de apoio à Mostra: QR Codes da página inicial e de cada ficha, a partir de data/doencas.json.
   Depende de utils.js e qrcode-gerador.js. */

const CHAVE_URL_BASE = "vermes-url-base-qrcodes";
const MODULOS_MARGEM_QR = 4;
const LARGURA_ALVO_PNG = 600;

/* Aceita só http(s) e devolve o endereço da pasta do site, terminado em "/". */
function normalizarUrlBase(texto) {
  let url;
  try {
    url = new URL(String(texto).trim());
  } catch (erro) {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  url.hash = "";
  url.search = "";
  if (/\.html?$/i.test(url.pathname)) {
    url.pathname = url.pathname.replace(/[^/]*$/, "");
  } else if (!url.pathname.endsWith("/")) {
    url.pathname += "/";
  }
  return url.href;
}

/* Mensagem de alerta quando o endereço não serve para um celular de visitante. */
function avisoDeEnderecoLocal(urlTexto) {
  const host = new URL(urlTexto).hostname;
  if (host === "localhost" || host === "0.0.0.0" || host === "[::1]" || /^127\./.test(host)) {
    return "Este endereço só funciona neste computador. Troque pelo endereço publicado antes de imprimir.";
  }
  if (/^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
    return "Este endereço só funciona na mesma rede Wi-Fi. Troque pelo endereço publicado antes de imprimir.";
  }
  return "";
}

function montarItensQR(base, doencas) {
  const itens = [{ id: "inicio", nome: "Página inicial", url: base }];
  doencas.forEach(function (doenca) {
    itens.push({
      id: doenca.id,
      nome: doenca.nomePopular,
      url: base + "doenca.html?id=" + encodeURIComponent(doenca.id)
    });
  });
  return itens;
}

function baixarPNG(canvas, id) {
  canvas.toBlob(function (blob) {
    if (!blob) return;
    const endereco = URL.createObjectURL(blob);
    const link = criarElemento("a", {
      atributos: { href: endereco, download: "qrcode-" + id + ".png" }
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(endereco);
    }, 1000);
  }, "image/png");
}

function montarCardQR(item) {
  const card = criarElemento("div", { classe: "qr-card" });
  const matriz = gerarMatrizQRCode(item.url);

  const total = matriz.length + 2 * MODULOS_MARGEM_QR;
  const canvas = criarElemento("canvas", {
    classe: "qr-card__canvas",
    atributos: { role: "img", "aria-label": "QR Code de " + item.nome + ". Abre " + item.url }
  });
  desenharQRCode(canvas, matriz, Math.max(4, Math.floor(LARGURA_ALVO_PNG / total)), MODULOS_MARGEM_QR);
  card.appendChild(canvas);

  card.appendChild(criarElemento("h2", { classe: "qr-card__nome", texto: item.nome }));
  card.appendChild(criarElemento("p", { classe: "qr-card__url", texto: item.url }));

  const botao = criarElemento("button", {
    classe: "botao botao--secundario nao-imprimir",
    texto: "Baixar PNG",
    atributos: { type: "button", "aria-label": "Baixar PNG do QR Code de " + item.nome }
  });
  botao.addEventListener("click", function () {
    baixarPNG(canvas, item.id);
  });
  card.appendChild(botao);
  return card;
}

function lerUrlSalva() {
  try {
    return localStorage.getItem(CHAVE_URL_BASE);
  } catch (erro) {
    return null;
  }
}

function salvarUrl(valor) {
  try {
    localStorage.setItem(CHAVE_URL_BASE, valor);
  } catch (erro) {
    /* Armazenamento indisponível: o endereço só não fica lembrado. */
  }
}

function iniciarQRCodes() {
  const lista = document.getElementById("qr-lista");
  if (!lista) return;

  const estado = document.getElementById("qr-estado");
  const campo = document.getElementById("url-base");
  const formulario = document.getElementById("qr-form");
  const aviso = document.getElementById("qr-aviso");
  const botaoImprimir = document.getElementById("qr-imprimir");
  let doencas = [];
  let temporizador = null;

  function mostrarAviso(texto) {
    aviso.textContent = texto;
    aviso.hidden = texto === "";
  }

  function atualizar() {
    const base = normalizarUrlBase(campo.value);
    if (!base) {
      mostrarAviso("Endereço inválido. Use o endereço completo, começando com http:// ou https://.");
      return;
    }
    mostrarAviso(avisoDeEnderecoLocal(base));
    salvarUrl(campo.value.trim());

    try {
      const cards = montarItensQR(base, doencas).map(montarCardQR);
      lista.textContent = "";
      cards.forEach(function (card) {
        lista.appendChild(card);
      });
    } catch (erro) {
      console.warn(erro.message);
      mostrarAviso("Não foi possível gerar os QR Codes: " + erro.message);
    }
  }

  campo.addEventListener("input", function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(atualizar, 300);
  });
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    clearTimeout(temporizador);
    atualizar();
  });
  botaoImprimir.addEventListener("click", function () {
    window.print();
  });

  carregarJSON("data/doencas.json")
    .then(function (dados) {
      doencas = ordenarPorNome(dados);
      if (estado) estado.remove();
      /* Sugestão inicial: a pasta onde esta página está. A equipe troca pelo endereço publicado. */
      const salva = lerUrlSalva();
      campo.value = salva && normalizarUrlBase(salva) ? salva : new URL(".", location.href).href;
      atualizar();
    })
    .catch(function (erro) {
      console.warn(erro.message);
      if (estado) montarErroCarregamento(estado);
      lista.remove();
    });
}

document.addEventListener("DOMContentLoaded", iniciarQRCodes);
