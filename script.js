// Variáveis globais
let todasPerguntas = [];
let perguntasSelecionadas = [];
let indiceAtual = 0;
let pontuacao = 0;
let respostasDadas = [];

// Elementos
const container = document.getElementById('quiz-container');
const botaoIniciar = document.getElementById('start-btn');
botaoIniciar.addEventListener('click', iniciarQuiz);

// Início do quiz
function iniciarQuiz() {
  fetch('noticias.json')
    .then(res => res.json())
    .then(dados => {
      todasPerguntas = dados;
      perguntasSelecionadas = escolherAleatorias(todasPerguntas, 10);
      indiceAtual = 0;
      pontuacao = 0;
      respostasDadas = [];
      mostrarPergunta();
    });
}

// Escolher perguntas aleatórias
function escolherAleatorias(lista, quantidade) {
  const copia = [...lista];
  const resultado = [];
  for (let i = 0; i < quantidade && copia.length > 0; i++) {
    const index = Math.floor(Math.random() * copia.length);
    resultado.push(copia.splice(index, 1)[0]);
  }
  return resultado;
}

// Mostrar uma pergunta
function mostrarPergunta() {
  const pergunta = perguntasSelecionadas[indiceAtual];
  atualizarProgresso();

  container.classList.add('fade-out');

  setTimeout(() => {
    container.innerHTML = '';

    const btnVoltar = document.createElement('button');
    btnVoltar.id = 'btn-voltar-inicio';
    btnVoltar.innerText = '⎋';
    btnVoltar.title = 'Voltar ao início';
    btnVoltar.addEventListener('click', voltarAoInicio);
    container.appendChild(btnVoltar);

    const h2 = document.createElement('h2');
    h2.classList.add('typing');
    container.appendChild(h2);
    escreverTextoGradualmenteComEspacos(h2, pergunta.texto);

    if (pergunta.imagem) {
      const img = document.createElement('img');
      img.src = pergunta.imagem;
      img.alt = 'Imagem da notícia';
      img.className = 'imagem-pergunta';
      container.appendChild(img);
    }

    const botoesDiv = document.createElement('div');

    const btnVerdadeiro = document.createElement('button');
    btnVerdadeiro.className = 'resposta blue-pill';
    btnVerdadeiro.innerText = 'Verdadeiro';
    btnVerdadeiro.addEventListener('click', () => responder(true));

    const btnFalso = document.createElement('button');
    btnFalso.className = 'resposta red-pill';
    btnFalso.innerText = 'Falso';
    btnFalso.addEventListener('click', () => responder(false));

    botoesDiv.appendChild(btnVerdadeiro);
    botoesDiv.appendChild(btnFalso);
    container.appendChild(botoesDiv);

    container.classList.remove('fade-out');
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 400);
  }, 400);
}

// Tratar resposta
function responder(resposta) {
  const pergunta = perguntasSelecionadas[indiceAtual];
  const correta = pergunta.verdadeiro;
  if (resposta === correta) pontuacao++;

  respostasDadas.push({
    texto: pergunta.texto,
    respostaDada: resposta,
    respostaCorreta: correta,
    isHuman: pergunta.isHuman || false
  });

  indiceAtual++;
  if (indiceAtual < perguntasSelecionadas.length) {
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
}

// Mostrar resultado
function mostrarResultado() {
  container.innerHTML = '';
  container.classList.add('resultado-container');

  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoGradualmenteComEspacos(titulo, 'Terminaste o quiz!');

  const resumo = document.createElement('p');
  resumo.innerText = `Acertaste ${pontuacao} de ${perguntasSelecionadas.length} perguntas.`;
  container.appendChild(resumo);

  const mensagem = document.createElement('p');
  mensagem.classList.add('typing');
  container.appendChild(mensagem);

  const textoMensagem = pontuacao >= 8
    ? 'Excelente! Tens olho para a verdade.'
    : pontuacao >= 5
    ? 'Razoável. Atenção às fake news!'
    : 'Cuidado! Foste enganado pela desinformação.';

  escreverTextoGradualmenteComEspacos(mensagem, textoMensagem);

  const tabela = document.createElement('table');
  tabela.innerHTML = `
    <tr>
      <th>Notícia</th>
      <th>Resposta</th>
      <th>Resultado</th>
    </tr>
  `;

  respostasDadas.forEach(item => {
    const linha = document.createElement('tr');
    linha.className = item.respostaDada === item.respostaCorreta ? 'correto' : 'errado';
    linha.innerHTML = `
      <td style="text-align: center;">${item.texto}</td>
      <td>${item.respostaDada ? 'Verdadeiro' : 'Falso'}</td>
      <td>${item.respostaDada === item.respostaCorreta ? '✅ Correto' : '❌ Errado'}</td>
    `;
    tabela.appendChild(linha);
  });

  container.appendChild(tabela);

  const botaoReiniciar = document.createElement('button');
  botaoReiniciar.className = 'btn-reiniciar';
  botaoReiniciar.innerText = 'Tentar outra vez';
  botaoReiniciar.addEventListener('click', iniciarQuiz);
  container.appendChild(botaoReiniciar);
}

// Voltar ao início
function voltarAoInicio() {
  container.innerHTML = '';
  container.classList.remove('resultado-container');

  const titulo = document.createElement('h1');
  titulo.id = 'titulo';
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoGradualmenteComEspacos(titulo, 'Bem-vindo ao Quiz de Fake News!');

  const subtitulo = document.createElement('p');
  subtitulo.className = 'subtitulo';
  subtitulo.innerText = 'Consegue distinguir uma notícia verdadeira de uma falsa?';
  container.appendChild(subtitulo);

  const botao = document.createElement('button');
  botao.id = 'start-btn';
  botao.innerText = 'Começar';
  botao.addEventListener('click', iniciarQuiz);
  container.appendChild(botao);

  const barra = document.getElementById('barra-progresso');
  if (barra) barra.style.display = 'none';
}

// Atualizar barra de progresso
function atualizarProgresso() {
  let barra = document.getElementById('barra-progresso');
  const wrapper = document.getElementById('quiz-wrapper');

  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'barra-progresso';

    const fundo = document.createElement('div');
    fundo.className = 'progresso-fundo';

    const preenchido = document.createElement('div');
    preenchido.className = 'progresso-preenchido';
    preenchido.id = 'progresso-preenchido';

    const texto = document.createElement('div');
    texto.className = 'progresso-texto';
    texto.id = 'progresso-texto';

    fundo.appendChild(preenchido);
    barra.appendChild(fundo);
    barra.appendChild(texto);

    wrapper.appendChild(barra);
  } else {
    barra.style.display = 'block';
  }

  const progresso = Math.round(((indiceAtual + 1) / perguntasSelecionadas.length) * 100);
  document.getElementById('progresso-preenchido').style.width = `${progresso}%`;
  document.getElementById('progresso-texto').innerText = `${indiceAtual + 1} / ${perguntasSelecionadas.length}`;
}

// Som ambiente
const audio = document.getElementById('ambiente-audio');
const toggleBtn = document.getElementById('toggle-audio');

let somAtivo = false;
audio.volume = 0.1;

toggleBtn.addEventListener('click', () => {
  somAtivo = !somAtivo;

  if (somAtivo) {
    audio.play();
    toggleBtn.textContent = '🔈';
    toggleBtn.title = 'Ativar som ambiente';
  } else {
    audio.pause();
    toggleBtn.textContent = '🔊';
    toggleBtn.title = 'Silenciar som ambiente';
  }
});

// Efeito máquina de escrever com espaços preservados
function escreverTextoGradualmenteComEspacos(elemento, texto, velocidade = 40, callback) {
  let i = 0;
  elemento.innerHTML = '';
  const intervalo = setInterval(() => {
    const char = texto.charAt(i);
    elemento.innerHTML += char === '\n' ? '<br>' : char;
    i++;
    if (i >= texto.length) {
      clearInterval(intervalo);
      if (callback) callback();
    }
  }, velocidade);
}
