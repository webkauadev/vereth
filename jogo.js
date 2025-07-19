const prompt = require('prompt-sync')({sigint: true});

const perguntas = [
  {
    texto: 'Quando o silencio dura tempo demais... o que voce ouve primeiro?',
    opcoes: {
      a: {resposta: 'Um eco de algo que nunca vivi.', efeito: () => atributos.memoria += 2},
      b: {resposta: 'O som da minha propria respiracao.', efeito: () => atributos.vontade += 2},
      c: {resposta: 'Nada. E isso me acalma.', efeito: () => atributos.coragem += 2}
    }
  },
  {
    texto: 'Por que voce quer entender?',
    opcoes: {
      a: {resposta: 'Para nao ser enganado de novo.', efeito: () => atributos.foco += 2},
      b: {resposta: 'Porque alguma coisa aqui precisa ser lembrada.', efeito: () => { atributos.memoria += 1; atributos.vontade += 1;}},
      c: {resposta: 'Porque entender me faz sentir menos so.', efeito: () => atributos.vinculo += 2}
    }
  },
  {
    texto: 'Voce se lembra de ter sentido medo pela primeira vez?',
    opcoes: {
      a: {resposta: 'Nao. E isso me assusta.', efeito: () => atributos.vontade += 2},
      b: {resposta: 'Sim. E continuo carregando.', efeito: () => atributos.coragem += 2},
      c: {resposta: 'Sim. Mas ja nao doi.', efeito: () => { atributos.vontade += 1; atributos.memoria += 1; }}
    }
  },
  {
    texto: 'Qual dessas palavras te parece mais verdadeira agora?',
    opcoes: {
      a: {resposta: 'Espera.', efeito: () => atributos.foco += 2},
      b: {resposta: 'Ruina.', efeito: () => atributos.memoria += 2},
      c: {resposta: 'Nome.', efeito: () => atributos.vinculo += 2}
    }
  },
  {
    texto: 'E se, ao final, ninguem lembrar de voce?',
    opcoes: {
      a: {resposta: 'Que assim seja.', efeito: () => atributos.vontade += 2},
      b: {resposta: 'Eu lembraria de mim.', efeito: () => atributos.foco += 2},
      c: {resposta: 'Alguem, em algum lugar, vai sentir a falta.', efeito: () => { atributos.vinculo += 1; atributos.coragem += 1; }}
    }
  }
];

let atributos = { memoria:0, vontade:0, coragem:0, foco:0, vinculo:0 };

const jogador = {
  nome: 'Vazio',
  inventario: [],
  frases: [],
  salasDescobertas: [],
  diarioTentativas: {},
};

function rolarComAtributo(attr){
  const base = Math.floor(Math.random()*5)+1;
  const total = base + atributos[attr];
  return total >= 6;
}

function tentarFraseDiario(id, attr, texto){
  if(jogador.diarioTentativas[id]){
    console.log('Voce ja tentou lembrar algo aqui.');
    return;
  }
  jogador.diarioTentativas[id] = true;
  if(rolarComAtributo(attr)){
    jogador.frases.push(texto);
    console.log('Seus dedos se movem sozinhos...');
    console.log(`"${texto}"`);
  } else {
    console.log('O diario permanece mudo.');
  }
}

function entrarSala(nome){
  const sala = salas[nome];
  if(!sala){
    console.log('Voce se perde na escuridao.');
    return;
  }
  if(!jogador.salasDescobertas.includes(nome)){
    jogador.salasDescobertas.push(nome);
    console.log(`[Nova sala descoberta: ${nome}]`);
  }
  jogador.salaAtual = nome;
  console.log(sala.descricao());
  mostrarComandos(sala);
}

function mostrarComandos(sala){
  console.log('Comandos disponiveis:');
  for(const cmd of Object.keys(sala.acoes)){
    console.log(' - '+cmd);
  }
}

function iniciarCombate(inimigo){
  console.log(`Um ${inimigo} surge, infectado.`);
  const acao = prompt('LUTAR ou POUPAR? ').trim().toUpperCase();
  if(acao==='LUTAR'){
    if(rolarComAtributo('coragem')){
      console.log('Voce vence a luta.');
    }else{
      console.log('Voce falha e sente sua forca diminuir.');
      perderAtributoAleatorio();
    }
  }else{
    rolarDadoPiedade();
  }
}

function perderAtributoAleatorio(){
  const keys = Object.keys(atributos);
  const k = keys[Math.floor(Math.random()*keys.length)];
  if(atributos[k]>0) atributos[k]-=1;
  console.log(`Perdeu 1 ponto em ${k}.`);
}

function perderItemAleatorio(){
  if(jogador.inventario.length===0){
    console.log('Nada a perder.');
    return;
  }
  const i = Math.floor(Math.random()*jogador.inventario.length);
  const item = jogador.inventario.splice(i,1)[0];
  console.log(`O item ${item} escapa de suas maos.`);
}

function perderPergunta(){
  console.log('Uma pergunta ao Anciao se perde na sua mente...');
}

function rolarDadoPiedade(){
  const r = Math.random();
  if(r<0.5){
    console.log('Nada acontece.');
  }else if(r<0.75){
    perderAtributoAleatorio();
  }else if(r<0.875){
    perderItemAleatorio();
  }else{
    perderPergunta();
  }
}

const salas = {
  'Floresta Inquieta': {
    descricao(){
      return 'Arvores tortas cercam um lago silencioso.';
    },
    acoes: {
      norte(){ entrarSala('Ruina do Sussurro'); },
      observar(){ console.log('Voce sente o silencio ecoar.'); },
      diario(){ tentarFraseDiario('floresta','vontade','Antes do fim, tentei ensinar ao vazio o nome da esperança. Mas como se ensina luz a quem nunca abriu os olhos?'); }
    }
  },
  'Ruina do Sussurro': {
    descricao(){ return 'Pedras caidas contam historias esquecidas.'; },
    acoes:{
      sul(){ entrarSala('Floresta Inquieta'); },
      leste(){ entrarSala('Cabana Esquecida'); },
      esperar(){ console.log('O vento traz sussurros ancestrais.'); },
      diario(){ tentarFraseDiario('ruina','foco','Sussurros de um selo são mais fortes que gritos de um rei. Por isso escolhi o silêncio como última muralha.'); }
    }
  },
  'Cabana Esquecida': {
    descricao(){ return 'Restos de madeira e cinzas escondem memórias.'; },
    acoes:{
      oeste(){ entrarSala('Ruina do Sussurro'); },
      tocar(){ console.log('A madeira, fria, lembra antigas presenças.'); },
      diario(){ tentarFraseDiario('cabana','vinculo','Esculpi para lembrar. Cada forma, uma ausência que não me deixava em paz.'); }
    }
  },
  'Clareira da Lembranca': {
    descricao(){ return 'Uma clareira iluminada por uma luz triste.'; },
    acoes:{
      oeste(){ entrarSala('Cabana Esquecida'); },
      ler(){ console.log('A carta de Muwon fala de saudade e dor.'); },
      diario(){ tentarFraseDiario('clareira','coragem','Nem todo grito de socorro é audível. Às vezes, ele se esconde na decisão de ficar… e apodrecer.'); }
    }
  }
};

function main(){
  console.log('--- VARETH: O SELO ---');
  construirAtributos();
  console.log('\nSuas escolhas estao marcadas.');
  entrarSala('Floresta Inquieta');
  while(true){
    const comando = prompt('> ').trim().toLowerCase();
    if(comando === 'sair'){
      console.log('A escuridao te engole.');
      break;
    }
    const sala = salas[jogador.salaAtual];
    if(sala.acoes[comando]){
      sala.acoes[comando]();
    }else if(comando === 'inventario'){
      console.log('Inventario:', jogador.inventario.join(', ') || 'vazio');
    }else if(comando === 'status'){
      console.log('Atributos:', atributos);
    }else{
      console.log('Acao desconhecida.');
    }
    if(jogador.frases.length === 4){
      dialogoFinal();
      break;
    }
  }
}

function construirAtributos(){
  perguntas.forEach((p,idx)=>{
    console.log(`\n${idx+1}. ${p.texto}`);
    for(const [letra,op] of Object.entries(p.opcoes)){
      console.log(` ${letra}) ${op.resposta}`);
    }
    let r;
    do{ r = prompt('> ').trim().toLowerCase(); }while(!p.opcoes[r]);
    p.opcoes[r].efeito();
  });
  console.log('\n"Esta feito. Essas sao as fissuras por onde o mundo te atravessa."');
}

function dialogoFinal(){
  console.log('\nTodas as memorias emergem. O Anciao se manifesta.');
  const perguntas = [
    'Por que o Arquivista criou o Vazio?',
    'O que era a infeccao?',
    'O que eu sou, de verdade?',
    'A vela era sua?',
    'O Arquivista te odiava?'
  ];
  perguntas.forEach((p,i)=> console.log(`${i+1}. ${p}`));
  let escolha;
  do{ escolha = parseInt(prompt('Escolha uma pergunta: '),10); }while(isNaN(escolha) || escolha<1 || escolha>5);
  console.log('A resposta ecoa na sua mente...');
}

main();

