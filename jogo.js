const jogador = {
  nome: "Vazio", 
  atributos: {
    vontade: 2,
    foco: 2,
    coragem: 2,
    vínculo: 2,
    astúcia: 2
  },
  inventario: [],
  frasesDesbloqueadas: [], 
  flags: {
    runa_memorizada: false,
    vela_viva: false,
    pedra_espelhada: false,
    portal_aberto: false,
    diario_ativado: false,
    frasesTentadas: {}
  }
};

function rolarComAtributo(atributo) {
  const base = Math.floor(Math.random() * 5) + 1; // dado de 1 a 5
  const modificador = jogador.atributos[atributo] || 0;
  const total = base + modificador;

  if (total >= 6) {
    console.log("🟢 Sucesso.");
    return true;
  } else {
    console.log("🔴 Falha.");
    return false;
  }
};

function adicionarItem(nomeDoItem) {
  if (!jogador.inventario.includes(nomeDoItem)) {
    jogador.inventario.push(nomeDoItem);
    console.log(`Você obteve: ${nomeDoItem}`);
  }
}

function removerItem(nomeDoItem) {
  const index = jogador.inventario.indexOf(nomeDoItem);
  if (index !== -1) {
    jogador.inventario.splice(index, 1);
    console.log(`Você perdeu: ${nomeDoItem}`);
  }
}

function listarInventario() {
  if (jogador.inventario.length === 0) {
    console.log("Seu inventário está vazio.");
  } else {
    console.log("Inventário:", jogador.inventario.join(", "));
  }
}

function marcarFlag(flag) {
  jogador.flags[flag] = true;
}

function verificarFlag(flag) {
  return jogador.flags[flag] === true;
}

function tentarFraseDiario(idSala, atributo, frase) {
  if (jogador.flags.frasesTentadas[idSala]) {
    console.log("Você já tentou lembrar algo aqui. Não consegue mais.");
    return;
  }

  jogador.flags.frasesTentadas[idSala] = true;

  const sucesso = rolarComAtributo(atributo);
  if (sucesso) {
    jogador.frasesDesbloqueadas.push(frase);
    console.log("🖋️ Seus dedos começam a escrever no diário...");
    console.log(`📖 “${frase}”`);
  } else {
    console.log("Você fecha o diário... nada veio à tona.");
  }
}

function iniciarCombate(nomeInimigo) {
  console.log(`Você está diante de ${nomeInimigo}. A infecção brilha nos olhos dele.`);

  const escolha = prompt("Você LUTAR ou POUPAR?\n> ").toUpperCase();

  if (escolha === "LUTAR") {
    return lutarInfectado();
  } else if (escolha === "POUPAR" || escolha === "FUGIR") {
    return rolarDadoPiedade();
  } else {
    console.log("Escolha inválida. Você hesita e o inimigo ataca!");
    return lutarInfectado();
  }
}

function lutarInfectado() {
  console.log("Você ergue sua arma com hesitação...");

  const sucesso = rolarComAtributo("coragem");

  if (sucesso) {
    console.log("Você desfere o golpe final. O corpo cai sem resistência. Está feito.");
    return "vitoria";
  } else {
    console.log("Você hesita. O inimigo atinge você. Você sobrevive, mas algo dentro de você quebra.");
    return perderAtributoAleatorio();
  }
}

function rolarDadoPiedade() {
  console.log("Você opta por não matar. Mas a infecção observa...");

  const resultado = Math.random();

  if (resultado < 0.5) {
    console.log("Nada acontece. Apenas o silêncio de uma escolha difícil.");
    return "nada";
  } else if (resultado < 0.75) {
    return perderAtributoAleatorio();
  } else if (resultado < 0.875) {
    return perderItemAleatorio();
  } else {
    return perderPerguntaAnciao();
  }
}

function rolarDadoPiedade() {
  console.log("Você opta por não matar. Mas a infecção observa...");

  const resultado = Math.random();

  if (resultado < 0.5) {
    console.log("Nada acontece. Apenas o silêncio de uma escolha difícil.");
    return "nada";
  } else if (resultado < 0.75) {
    return perderAtributoAleatorio();
  } else if (resultado < 0.875) {
    return perderItemAleatorio();
  } else {
    return perderPerguntaAnciao();
  }
}

function perderAtributoAleatorio() {
  const chaves = Object.keys(jogador.atributos);
  const sorteado = chaves[Math.floor(Math.random() * chaves.length)];

  if (jogador.atributos[sorteado] > 0) {
    jogador.atributos[sorteado] -= 1;
    console.log(`Você sente algo se esvair. (-1 em ${sorteado.toUpperCase()})`);
  } else {
    console.log("Mesmo com nada a perder, você sente o vazio aumentar.");
  }

  return "atributo";
}

function perderItemAleatorio() {
  if (jogador.inventario.length === 0) {
    console.log("Você não possui nada que possa ser tirado...");
    return "nada";
  }

  const index = Math.floor(Math.random() * jogador.inventario.length);
  const item = jogador.inventario.splice(index, 1)[0];

  console.log(`Algo escapa de seu bolso... Você perdeu: ${item}.`);
  // Aqui você pode salvar para possível recuperação no Ato II
  return "item";
}

function perderPerguntaAnciao() {
  if (!jogador.flags.perguntasBloqueadas) {
    jogador.flags.perguntasBloqueadas = [];
  }

  const todas = ["origem", "cura", "criador", "sentido", "fim"];
  const restantes = todas.filter(p => !jogador.flags.perguntasBloqueadas.includes(p));
  
  if (restantes.length === 0) {
    console.log("Nada foi retirado... o silêncio permanece.");
    return "nada";
  }

  const bloqueada = restantes[Math.floor(Math.random() * restantes.length)];
  jogador.flags.perguntasBloqueadas.push(bloqueada);

  console.log(`Uma dúvida profunda se perde no tempo... (${bloqueada.toUpperCase()} não poderá ser perguntada ao Ancião)`);
  return "pergunta";
}

function mostrarPerguntasDisponiveis() {
  const todas = {
    origem: "Quem sou eu de verdade?",
    cura: "Existe uma cura para os infectados?",
    criador: "Por que o Arquivista me criou?",
    sentido: "Qual o propósito de tudo isso?",
    fim: "Vereth pode ser salva?"
  };

  const bloqueadas = jogador.flags.perguntasBloqueadas || [];
  const disponiveis = Object.keys(todas).filter(p => !bloqueadas.includes(p));

  console.log("Você pode fazer uma pergunta ao Ancião:");
  disponiveis.forEach((chave, i) => {
    console.log(`${i + 1}. ${todas[chave]}`);
  });
}

jogador.salasDescobertas = []; // Ex: ["Floresta Inquieta", "Cabana Esquecida"]
jogador.diarioTentativas = {}; 
// Ex: { "Cabana Esquecida": true, "Clareira": false }

function entrarSala(nomeSala) {
  const novaSala = salas[nomeSala];

  if (!novaSala) {
    console.log("Você tenta seguir, mas se vê perdido.");
    return;
  }

  // Primeira vez?
  if (!jogador.salasDescobertas.includes(nomeSala)) {
    jogador.salasDescobertas.push(nomeSala);
    console.log(`[Nova sala descoberta: ${nomeSala.toUpperCase()}]`);
  }

  // Atualiza a sala atual
  jogador.salaAtual = nomeSala;

  // Mostra descrição
  console.log(novaSala.descricao());

  // Mostra ações
  console.log("Você pode:", Object.keys(novaSala.acoes).join(", "));
}

function tentarFraseDiario() {
  const sala = jogador.salaAtual;

  if (jogador.diarioTentativas[sala]) {
    console.log("Você já tentou refletir aqui. O momento passou.");
    return;
  }

  jogador.diarioTentativas[sala] = true;

  if (Math.random() < 0.4) {
    const frase = desbloquearFrase(sala);
    console.log("Você abre o diário... seus dedos escrevem por conta própria:");
    console.log(`❝ ${frase} ❞`);
  } else {
    console.log("Você folheia o diário... mas nada vem à mente.");
  }
}


