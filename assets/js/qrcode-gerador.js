/* Gerador de QR Code próprio, sem bibliotecas: modo byte (UTF-8), correção de erros nível M,
   versões 1 a 10 (até 213 bytes, suficiente para os endereços das fichas).
   Uso: const matriz = gerarMatrizQRCode("https://..."); desenharQRCode(canvas, matriz, escala, margem); */

/* Blocos de correção de erros do nível M: ec = palavras de correção por bloco;
   grupos = [quantidade de blocos, palavras de dados por bloco]. */
const QR_BLOCOS_M = [
  null,
  { ec: 10, grupos: [[1, 16]] },
  { ec: 16, grupos: [[1, 28]] },
  { ec: 26, grupos: [[1, 44]] },
  { ec: 18, grupos: [[2, 32]] },
  { ec: 24, grupos: [[2, 43]] },
  { ec: 16, grupos: [[4, 27]] },
  { ec: 18, grupos: [[4, 31]] },
  { ec: 22, grupos: [[2, 38], [2, 39]] },
  { ec: 22, grupos: [[3, 36], [2, 37]] },
  { ec: 26, grupos: [[4, 43], [1, 44]] }
];

/* Posições dos padrões de alinhamento por versão. */
const QR_ALINHAMENTO = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];

/* Tabelas do campo de Galois GF(256), usadas no código Reed-Solomon. */
const QR_EXP = new Array(512);
const QR_LOG = new Array(256);
(function () {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    QR_EXP[i] = x;
    QR_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) QR_EXP[i] = QR_EXP[i - 255];
})();

function qrMultiplicar(a, b) {
  return a && b ? QR_EXP[QR_LOG[a] + QR_LOG[b]] : 0;
}

/* Polinômio gerador de grau n (sem o termo líder, que vale 1). */
function qrGerador(n) {
  let g = [1];
  for (let i = 0; i < n; i++) {
    const proximo = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      proximo[j] ^= g[j];
      proximo[j + 1] ^= qrMultiplicar(g[j], QR_EXP[i]);
    }
    g = proximo;
  }
  return g.slice(1);
}

function qrRestoRS(dados, n) {
  const gerador = qrGerador(n);
  const resto = new Array(n).fill(0);
  dados.forEach(function (byte) {
    const fator = byte ^ resto.shift();
    resto.push(0);
    for (let i = 0; i < n; i++) resto[i] ^= qrMultiplicar(gerador[i], fator);
  });
  return resto;
}

function qrDigito(valor) {
  let n = 0;
  while (valor !== 0) {
    n++;
    valor >>>= 1;
  }
  return n;
}

/* Informação de formato (nível M = 0) e de versão, protegidas por códigos BCH. */
function qrBchFormato(dados) {
  const g = 0x537;
  let d = dados << 10;
  while (qrDigito(d) - qrDigito(g) >= 0) d ^= g << (qrDigito(d) - qrDigito(g));
  return ((dados << 10) | d) ^ 0x5412;
}

function qrBchVersao(versao) {
  const g = 0x1f25;
  let d = versao << 12;
  while (qrDigito(d) - qrDigito(g) >= 0) d ^= g << (qrDigito(d) - qrDigito(g));
  return (versao << 12) | d;
}

function qrTotalDados(versao) {
  return QR_BLOCOS_M[versao].grupos.reduce(function (soma, grupo) {
    return soma + grupo[0] * grupo[1];
  }, 0);
}

/* Monta a sequência final de palavras-código: dados e correção de erros intercalados por bloco. */
function qrPalavrasCodigo(bytes, versao) {
  const info = QR_BLOCOS_M[versao];
  const totalDados = qrTotalDados(versao);
  const bits = [];

  function adicionar(valor, quantidade) {
    for (let i = quantidade - 1; i >= 0; i--) bits.push((valor >>> i) & 1);
  }

  adicionar(4, 4); /* modo byte */
  adicionar(bytes.length, versao < 10 ? 8 : 16);
  bytes.forEach(function (byte) {
    adicionar(byte, 8);
  });
  for (let i = 0; i < 4 && bits.length < totalDados * 8; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dados = [];
  for (let i = 0; i < bits.length; i += 8) {
    let valor = 0;
    for (let j = 0; j < 8; j++) valor = (valor << 1) | bits[i + j];
    dados.push(valor);
  }
  for (let enchimento = 0xec; dados.length < totalDados; enchimento = enchimento === 0xec ? 0x11 : 0xec) {
    dados.push(enchimento);
  }

  const blocosDados = [];
  const blocosEc = [];
  let posicao = 0;
  info.grupos.forEach(function (grupo) {
    for (let k = 0; k < grupo[0]; k++) {
      const bloco = dados.slice(posicao, posicao + grupo[1]);
      posicao += grupo[1];
      blocosDados.push(bloco);
      blocosEc.push(qrRestoRS(bloco, info.ec));
    }
  });

  const saida = [];
  const maior = Math.max.apply(null, blocosDados.map(function (b) { return b.length; }));
  for (let i = 0; i < maior; i++) {
    blocosDados.forEach(function (bloco) {
      if (i < bloco.length) saida.push(bloco[i]);
    });
  }
  for (let i = 0; i < info.ec; i++) {
    blocosEc.forEach(function (bloco) {
      saida.push(bloco[i]);
    });
  }
  return saida;
}

function qrMascara(mascara, l, c) {
  switch (mascara) {
    case 0: return (l + c) % 2 === 0;
    case 1: return l % 2 === 0;
    case 2: return c % 3 === 0;
    case 3: return (l + c) % 3 === 0;
    case 4: return (Math.floor(l / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5: return ((l * c) % 2) + ((l * c) % 3) === 0;
    case 6: return ((((l * c) % 2) + ((l * c) % 3)) % 2) === 0;
    default: return ((((l + c) % 2) + ((l * c) % 3)) % 2) === 0;
  }
}

/* Constrói a matriz completa (true = módulo escuro) para uma máscara. */
function qrMontarMatriz(versao, palavras, mascara) {
  const n = 17 + 4 * versao;
  const m = [];
  for (let i = 0; i < n; i++) m.push(new Array(n).fill(null));

  function sonda(l, c) {
    for (let r = -1; r <= 7; r++) {
      if (l + r <= -1 || n <= l + r) continue;
      for (let k = -1; k <= 7; k++) {
        if (c + k <= -1 || n <= c + k) continue;
        m[l + r][c + k] =
          (r >= 0 && r <= 6 && (k === 0 || k === 6)) ||
          (k >= 0 && k <= 6 && (r === 0 || r === 6)) ||
          (r >= 2 && r <= 4 && k >= 2 && k <= 4);
      }
    }
  }

  sonda(0, 0);
  sonda(n - 7, 0);
  sonda(0, n - 7);

  const pos = QR_ALINHAMENTO[versao];
  pos.forEach(function (l) {
    pos.forEach(function (c) {
      if (m[l][c] !== null) return;
      for (let r = -2; r <= 2; r++) {
        for (let k = -2; k <= 2; k++) {
          m[l + r][c + k] = r === -2 || r === 2 || k === -2 || k === 2 || (r === 0 && k === 0);
        }
      }
    });
  });

  for (let i = 8; i < n - 8; i++) {
    if (m[i][6] === null) m[i][6] = i % 2 === 0;
    if (m[6][i] === null) m[6][i] = i % 2 === 0;
  }

  const formato = qrBchFormato((0 << 3) | mascara);
  for (let i = 0; i < 15; i++) {
    const escuro = ((formato >> i) & 1) === 1;
    if (i < 6) m[i][8] = escuro;
    else if (i < 8) m[i + 1][8] = escuro;
    else m[n - 15 + i][8] = escuro;

    if (i < 8) m[8][n - i - 1] = escuro;
    else if (i < 9) m[8][15 - i - 1 + 1] = escuro;
    else m[8][15 - i - 1] = escuro;
  }
  m[n - 8][8] = true; /* módulo escuro fixo */

  if (versao >= 7) {
    const bitsVersao = qrBchVersao(versao);
    for (let i = 0; i < 18; i++) {
      const escuro = ((bitsVersao >> i) & 1) === 1;
      m[Math.floor(i / 3)][(i % 3) + n - 8 - 3] = escuro;
      m[(i % 3) + n - 8 - 3][Math.floor(i / 3)] = escuro;
    }
  }

  /* Colocação dos dados em zigue-zague, de baixo para cima, em colunas duplas. */
  let direcao = -1;
  let linha = n - 1;
  let bit = 7;
  let indice = 0;
  for (let coluna = n - 1; coluna > 0; coluna -= 2) {
    if (coluna === 6) coluna--;
    for (;;) {
      for (let d = 0; d < 2; d++) {
        if (m[linha][coluna - d] === null) {
          let escuro = false;
          if (indice < palavras.length) escuro = ((palavras[indice] >>> bit) & 1) === 1;
          if (qrMascara(mascara, linha, coluna - d)) escuro = !escuro;
          m[linha][coluna - d] = escuro;
          bit--;
          if (bit === -1) {
            indice++;
            bit = 7;
          }
        }
      }
      linha += direcao;
      if (linha < 0 || n <= linha) {
        linha -= direcao;
        direcao = -direcao;
        break;
      }
    }
  }
  return m;
}

/* Penalidade das regras da norma, para escolher a máscara mais legível. */
function qrPenalidade(m) {
  const n = m.length;
  let p = 0;

  for (let eixo = 0; eixo < 2; eixo++) {
    for (let a = 0; a < n; a++) {
      let sequencia = 1;
      for (let b = 1; b <= n; b++) {
        const atual = b < n ? (eixo === 0 ? m[a][b] : m[b][a]) : null;
        const anterior = eixo === 0 ? m[a][b - 1] : m[b - 1][a];
        if (b < n && atual === anterior) {
          sequencia++;
        } else {
          if (sequencia >= 5) p += sequencia - 2;
          sequencia = 1;
        }
      }
    }
  }

  for (let l = 0; l < n - 1; l++) {
    for (let c = 0; c < n - 1; c++) {
      const v = m[l][c];
      if (v === m[l][c + 1] && v === m[l + 1][c] && v === m[l + 1][c + 1]) p += 3;
    }
  }

  const padraoA = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const padraoB = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  function confere(leitura, padrao) {
    for (let i = 0; i < 11; i++) {
      if ((leitura(i) ? 1 : 0) !== padrao[i]) return false;
    }
    return true;
  }
  for (let a = 0; a < n; a++) {
    for (let b = 0; b <= n - 11; b++) {
      const linhaAtual = function (i) { return m[a][b + i]; };
      const colunaAtual = function (i) { return m[b + i][a]; };
      if (confere(linhaAtual, padraoA) || confere(linhaAtual, padraoB)) p += 40;
      if (confere(colunaAtual, padraoA) || confere(colunaAtual, padraoB)) p += 40;
    }
  }

  let escuros = 0;
  m.forEach(function (linha) {
    linha.forEach(function (v) {
      if (v) escuros++;
    });
  });
  p += Math.floor(Math.abs((escuros * 20) / (n * n) - 10)) * 10;
  return p;
}

/* Retorna a matriz do QR Code (lista de linhas com true = módulo escuro). */
function gerarMatrizQRCode(texto) {
  const bytes = Array.from(new TextEncoder().encode(String(texto)));
  let versao = 0;
  for (let v = 1; v <= 10; v++) {
    if (4 + (v < 10 ? 8 : 16) + 8 * bytes.length <= qrTotalDados(v) * 8) {
      versao = v;
      break;
    }
  }
  if (!versao) {
    throw new Error("Texto longo demais para o gerador de QR Code (máximo de 213 bytes).");
  }

  const palavras = qrPalavrasCodigo(bytes, versao);
  let melhor = null;
  let menorPenalidade = Infinity;
  for (let mascara = 0; mascara < 8; mascara++) {
    const matriz = qrMontarMatriz(versao, palavras, mascara);
    const penalidade = qrPenalidade(matriz);
    if (penalidade < menorPenalidade) {
      menorPenalidade = penalidade;
      melhor = matriz;
    }
  }
  return melhor;
}

/* Desenha a matriz em um <canvas>. `escala` = pixels por módulo; `margem` = módulos em branco
   ao redor (a norma pede 4). Preto sobre branco puro garante o melhor contraste para leitores. */
function desenharQRCode(canvas, matriz, escala, margem) {
  const total = matriz.length + 2 * margem;
  canvas.width = total * escala;
  canvas.height = total * escala;
  const contexto = canvas.getContext("2d");
  contexto.fillStyle = "#FFFFFF";
  contexto.fillRect(0, 0, canvas.width, canvas.height);
  contexto.fillStyle = "#000000";
  matriz.forEach(function (linha, l) {
    linha.forEach(function (escuro, c) {
      if (escuro) contexto.fillRect((c + margem) * escala, (l + margem) * escala, escala, escala);
    });
  });
}
