let pontos = 0;
let tempoRestante = 30;
let intervaloTempo;
let alvoAtual = null;
let jogoRodando = false;

// Elementos da tela
const elPontuacao = document.getElementById('pontuacao');
const elTempo = document.getElementById('tempo');
const telaGameOver = document.getElementById('gameover');
const elPontuacaoFinal = document.getElementById('pontuacao-final');

function gerarAlvo() {
  if (!jogoRodando) return;
  
  // Remove o alvo anterior se existir
  if (alvoAtual) alvoAtual.remove();

  // Cria um novo elemento div para ser o alvo
  alvoAtual = document.createElement('div');
  alvoAtual.className = 'alvo';

  // Posição aleatória (evitando sair da tela)
  const maxPosX = window.innerWidth - 80;
  const maxPosY = window.innerHeight - 80;
  
  // Evita spawnar em cima do placar
  let posX = Math.random() * maxPosX;
  let posY = Math.random() * maxPosY;
  if (posY < 100 && posX < 150) posY += 100;

  alvoAtual.style.left = posX + 'px';
  alvoAtual.style.top = posY + 'px';

  // Evento de acertar o alvo
  alvoAtual.onmousedown = function(event) {
    event.stopPropagation(); // Impede que o clique conte como "erro" no background
    pontos += 10;
    elPontuacao.innerText = pontos;
    
    // Efeito sonoro simples com AudioContext
    tocarSomTiro();
    
    gerarAlvo(); // Gera outro imediatamente
  };

  document.body.appendChild(alvoAtual);
}

function errarTiro(event) {
  // Se clicou no fundo (e não nos botões ou alvo), perde pontos
  if (jogoRodando && event.target === document.body) {
    pontos = Math.max(0, pontos - 5); // Não deixa a pontuação ficar negativa
    elPontuacao.innerText = pontos;
  }
}

function atualizarRelogio() {
  tempoRestante--;
  elTempo.innerText = tempoRestante;

  // Movimenta o alvo aleatoriamente para dificultar
  if (tempoRestante > 0 && tempoRestante % 2 === 0) {
      gerarAlvo();
  }

  if (tempoRestante <= 0) {
    finalizarJogo();
  }
}

function finalizarJogo() {
  jogoRodando = false;
  clearInterval(intervaloTempo);
  if (alvoAtual) alvoAtual.remove();
  
  elPontuacaoFinal.innerText = pontos;
  telaGameOver.classList.remove('escondido');
}

function iniciarJogo() {
  // Reinicia variáveis
  pontos = 0;
  tempoRestante = 30;
  jogoRodando = true;
  
  // Atualiza interface
  elPontuacao.innerText = pontos;
  elTempo.innerText = tempoRestante;
  telaGameOver.classList.add('escondido');
  
  // Começa o loop do alvo e do tempo
  gerarAlvo();
  clearInterval(intervaloTempo);
  intervaloTempo = setInterval(atualizarRelogio, 1000);
}

// Bipe sonoro super simples
function tocarSomTiro() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignora erros de áudio se o navegador bloquear
  }
}
let pontos = 0;
let tempoRestante = 30;
let intervaloTempo;
let alvoAtual = null;
let jogoRodando = false;

// Pegando os elementos do HTML
const elPontuacao = document.getElementById('pontuacao');
const elTempo = document.getElementById('tempo');
const telaGameOver = document.getElementById('gameover');
const elPontuacaoFinal = document.getElementById('pontuacao-final');
const btnIniciar = document.getElementById('btn-iniciar');
const tituloTela = document.getElementById('titulo-tela');
const textoPontuacao = document.getElementById('texto-pontuacao');

// Conectando o botão de começar ao jogo
btnIniciar.addEventListener('click', iniciarJogo);

// Tirar pontos se clicar no fundo (errar o tiro)
document.body.addEventListener('mousedown', function(event) {
  if (jogoRodando && event.target === document.body) {
    pontos = Math.max(0, pontos - 5);
    elPontuacao.innerText = pontos;
  }
});

function gerarAlvo() {
  if (!jogoRodando) return;
  if (alvoAtual) alvoAtual.remove();

  alvoAtual = document.createElement('div');
  alvoAtual.className = 'alvo';

  const maxPosX = window.innerWidth - 80;
  const maxPosY = window.innerHeight - 80;
  let posX = Math.random() * maxPosX;
  let posY = Math.random() * maxPosY;
  if (posY < 100 && posX < 150) posY += 100; // Evita spawn em cima do placar

  alvoAtual.style.left = posX + 'px';
  alvoAtual.style.top = posY + 'px';

  // Quando acertar o alvo
  alvoAtual.addEventListener('mousedown', function(event) {
    event.stopPropagation(); // Evita que conte como "clique no fundo"
    pontos += 10;
    elPontuacao.innerText = pontos;
    tocarSomTiro();
    gerarAlvo();
  });

  document.body.appendChild(alvoAtual);
}

function atualizarRelogio() {
  tempoRestante--;
  elTempo.innerText = tempoRestante;

  // Troca o alvo de lugar se demorar muito
  if (tempoRestante > 0 && tempoRestante % 2 === 0) {
      gerarAlvo();
  }

  // Fim do tempo
  if (tempoRestante <= 0) {
    finalizarJogo();
  }
}

function finalizarJogo() {
  jogoRodando = false;
  clearInterval(intervaloTempo);
  if (alvoAtual) alvoAtual.remove();
  
  elPontuacaoFinal.innerText = pontos;
  tituloTela.innerText = "FIM DE JOGO 💥";
  textoPontuacao.classList.remove('escondido');
  btnIniciar.innerText = "Jogar Novamente";
  telaGameOver.classList.remove('escondido');
}

function iniciarJogo() {
  pontos = 0;
  tempoRestante = 30;
  jogoRodando = true;
  
  elPontuacao.innerText = pontos;
  elTempo.innerText = tempoRestante;
  telaGameOver.classList.add('escondido'); // Esconde a tela inicial
  
  gerarAlvo();
  clearInterval(intervaloTempo);
  intervaloTempo = setInterval(atualizarRelogio, 1000);
}

function tocarSomTiro() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
}
