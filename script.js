// ==============================================
// ORGANIZAÇÃO DO CÓDIGO:
// 1. Configurações e inicializações
// 2. Manipulação do vídeo e áudio
// 3. Funções principais do quiz
// 4. Funções de UI e visualização
// 5. Funções de leaderboard
// 6. Efeitos visuais e animações
// ==============================================

// ==============================================
// 1. CONFIGURAÇÕES E INICIALIZAÇÕES
// ==============================================
let todasPerguntas = [];
let perguntasSelecionadas = [];
let indiceAtual = 0;
let pontuacao = 0;
let respostasDadas = [];
let processandoResposta = false;

// Elementos DOM principais
const container = document.getElementById('quiz-container');
const botaoIniciar = document.getElementById('start-btn');
const btnVerClassificacoes = document.getElementById('ver-classificacoes-btn');
const audio = document.getElementById('ambiente-audio');
const toggleBtn = document.getElementById('toggle-audio');
const video1 = document.getElementById('video-fundo-1');
const video2 = document.getElementById('video-fundo-2');

// Configuração de eventos iniciais
document.addEventListener('DOMContentLoaded', () => {
  if (botaoIniciar) botaoIniciar.addEventListener('click', iniciarQuiz);
  if (btnVerClassificacoes) btnVerClassificacoes.addEventListener('click', mostrarLeaderboardInicial);
});

// ==============================================
// 2. MANIPULAÇÃO DO VÍDEO E ÁUDIO
// ==============================================
// Configuração do loop de vídeo com cross-fade
function configurarVideoFundo() {
  video1.addEventListener('timeupdate', () => {
    if (video1.currentTime > video1.duration - 1) {
      if (!video2.classList.contains('ativo')) {
        video2.currentTime = 0;
        video2.play();
        video2.classList.add('ativo');
        
        setTimeout(() => {
          video1.classList.remove('ativo');
        }, 1000);
      }
    }
  });

  video2.addEventListener('timeupdate', () => {
    if (video2.currentTime > video2.duration - 1) {
      if (!video1.classList.contains('ativo')) {
        video1.currentTime = 0;
        video1.play();
        video1.classList.add('ativo');
        
        setTimeout(() => {
          video2.classList.remove('ativo');
        }, 1000);
      }
    }
  });

  // Iniciar o primeiro vídeo
  video1.play();
}

// Configuração do controle de áudio
let somAtivo = false;
audio.volume = 0.1;

function configurarControleAudio() {
  toggleBtn.addEventListener('click', () => {
    somAtivo = !somAtivo;

    if (somAtivo) {
      audio.play();
      toggleBtn.textContent = '🔊';
      toggleBtn.title = 'Silenciar som ambiente';
    } else {
      audio.pause();
      toggleBtn.textContent = '🔈';
      toggleBtn.title = 'Ativar som ambiente';
    }
  });
}

// ==============================================
// 3. FUNÇÕES PRINCIPAIS DO QUIZ
// ==============================================
// Início do quiz
function iniciarQuiz() {
  fetch('noticias.json')
    .then(res => res.json())
    .then(dados => {
      todasPerguntas = dados;
      perguntasSelecionadas = escolherAleatorias(todasPerguntas, 3);
      indiceAtual = 0;
      pontuacao = 0;
      respostasDadas = [];
      
      // Limpar qualquer barra de progresso existente
      const barraAnterior = document.getElementById('barra-progresso');
      if (barraAnterior) {
        barraAnterior.remove();
      }
      
      // Resetar o container e mostrar a primeira pergunta
      container.classList.remove('resultado-container');
      mostrarPergunta();
      
      // Garantir que a barra de progresso está visível
      const barra = document.getElementById('barra-progresso');
      if (barra) {
        barra.style.display = 'block';
        barra.classList.remove('fade-out-progressbar');
      }
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

// Tratar resposta do jogador
function responder(resposta) {
  // Se já estiver processando uma resposta, ignorar cliques adicionais
  if (processandoResposta) return;
  processandoResposta = true;
  
  // Desativar os botões imediatamente para feedback visual
  const botoes = document.querySelectorAll('.resposta');
  botoes.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
  });
  
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
  
  // Verificar se é a última pergunta
  if (indiceAtual >= perguntasSelecionadas.length) {
    // Mostrar progresso a 100% com animação antes de mostrar o resultado
    const barraPreenchida = document.getElementById('progresso-preenchido');
    const textoProgresso = document.getElementById('progresso-texto');
    
    if (barraPreenchida && textoProgresso) {
      // Atualizar para 100%
      barraPreenchida.style.width = '100%';
      textoProgresso.innerText = `${perguntasSelecionadas.length} / ${perguntasSelecionadas.length}`;
      
      // Fazer o fade da barra com animação suave
      setTimeout(() => {
        const barra = document.getElementById('barra-progresso');
        if (barra) {
          barra.classList.add('fade-out-progressbar');
          
          // Esperar a animação terminar antes de mostrar resultado
          setTimeout(() => {
            mostrarResultado();
            processandoResposta = false;
          }, 800);
        }
      }, 600);
    }
  } else {
    // Não é a última pergunta, continuar normalmente
    setTimeout(() => {
      mostrarPergunta();
      processandoResposta = false;
    }, 300);
  }
}

// ==============================================
// 4. FUNÇÕES DE UI E VISUALIZAÇÃO
// ==============================================
// Mostrar uma pergunta com efeito de geração de texto
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
    
    // Criar div para os botões com ordem invertida
    const botoesDiv = document.createElement('div');
    botoesDiv.className = 'botoes-resposta';
    
    // Botões com estado inicial desativado - RED PILL primeiro (esquerda)
    const btnFalso = document.createElement('button');
    btnFalso.className = 'resposta red-pill';
    btnFalso.innerText = 'Falso';
    btnFalso.disabled = true; // Inicialmente desativado
    btnFalso.addEventListener('click', () => responder(false));
    
    const btnVerdadeiro = document.createElement('button');
    btnVerdadeiro.className = 'resposta blue-pill';
    btnVerdadeiro.innerText = 'Verdadeiro';
    btnVerdadeiro.disabled = true; // Inicialmente desativado
    btnVerdadeiro.addEventListener('click', () => responder(true));

    // Ordem invertida: Falso (vermelho) à esquerda, Verdadeiro (azul) à direita
    botoesDiv.appendChild(btnFalso);
    botoesDiv.appendChild(btnVerdadeiro);
    container.appendChild(botoesDiv);

    // Mostrar imagem apenas se existir
    if (pergunta.imagem && pergunta.imagem.trim() !== '') {
      const img = document.createElement('img');
      img.src = pergunta.imagem;
      img.alt = 'Imagem da notícia';
      img.className = 'imagem-pergunta';
      // Verificar se a imagem carrega
      img.onerror = function() {
        this.style.display = 'none';
      };
      container.appendChild(img);
    }

    // Usar o efeito de geração melhorado
    escreverTextoComEfeitoGeracao(h2, pergunta.texto, 20).then(() => {
      // Callback ativa os botões depois que o texto terminar
      btnVerdadeiro.disabled = false;
      btnFalso.disabled = false;
      
      // Adicionar classe visual para indicar que os botões estão ativos
      btnVerdadeiro.classList.add('ativo');
      btnFalso.classList.add('ativo');
    });

    container.classList.remove('fade-out');
    container.classList.add('fade-in');
    setTimeout(() => container.classList.remove('fade-in'), 400);
  }, 400);
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

  const totalPerguntas = perguntasSelecionadas.length;
  
  // A barra começa em 0 - aqui o progresso é baseado nas perguntas respondidas
  // não nas perguntas mostradas
  const perguntasRespondidas = indiceAtual;
  const progresso = Math.round((perguntasRespondidas / totalPerguntas) * 100);
  
  document.getElementById('progresso-preenchido').style.width = `${progresso}%`;
  document.getElementById('progresso-texto').innerText = `${perguntasRespondidas} / ${totalPerguntas}`;
}

// Mostrar resultado final
function mostrarResultado() {
  const barra = document.getElementById('barra-progresso');
  if (barra) barra.style.display = 'none';
  
  container.innerHTML = '';
  container.classList.add('resultado-container');

  // Adicionar botão de voltar
  const btnVoltar = document.createElement('button');
  btnVoltar.id = 'btn-voltar-inicio';
  btnVoltar.innerText = '⎋';
  btnVoltar.title = 'Voltar ao início';
  btnVoltar.addEventListener('click', voltarAoInicio);
  container.appendChild(btnVoltar);

  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Terminaste o quiz!');
  
  // Calcular a percentagem
  const percentagem = Math.round((pontuacao / perguntasSelecionadas.length) * 100);

  const resumo = document.createElement('p');
  resumo.innerText = `Acertaste ${pontuacao} de ${perguntasSelecionadas.length} perguntas (${percentagem}%)`;
  container.appendChild(resumo);

  const mensagem = document.createElement('p');
  mensagem.classList.add('typing');
  container.appendChild(mensagem);

  // Ajustar os limites para 3 perguntas
  const textoMensagem = pontuacao === 3
    ? 'Perfeito! Tens olho para a verdade.'
    : pontuacao === 2
    ? 'Muito bem! Mas ainda podes melhorar.'
    : pontuacao === 1
    ? 'Atenção às fake news!'
    : 'Cuidado! Foste completamente enganado pela desinformação.';

  escreverTextoComEfeitoGeracao(mensagem, textoMensagem);

  criarTabelaRespostas();
  criarFormularioPontuacao();
}

function criarTabelaRespostas() {
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
}

function criarFormularioPontuacao() {
  // Adicionar formulário para guardar pontuação
  const formLeaderboard = document.createElement('div');
  formLeaderboard.className = 'form-leaderboard';
  formLeaderboard.innerHTML = `
    <h3>Guardar pontuação</h3>
    <div class="input-container">
      <input type="text" id="nome-jogador" placeholder="Insere o teu nome" maxlength="20">
      <button class="btn-guardar" id="btn-guardar">Guardar</button>
    </div>
    <p class="erro-mensagem" id="mensagem-leaderboard"></p>
  `;
  container.appendChild(formLeaderboard);

  const btnGuardar = formLeaderboard.querySelector('#btn-guardar');
  btnGuardar.addEventListener('click', guardarPontuacao);

  // Botão para ver leaderboard
  const btnLeaderboard = document.createElement('button');
  btnLeaderboard.className = 'btn-leaderboard';
  btnLeaderboard.innerText = 'Ver Classificações';
  btnLeaderboard.addEventListener('click', mostrarLeaderboard);
  container.appendChild(btnLeaderboard);

  // Botão para voltar ao menu principal
  const botaoReiniciar = document.createElement('button');
  botaoReiniciar.className = 'btn-reiniciar';
  botaoReiniciar.innerText = 'Menu Principal';
  botaoReiniciar.addEventListener('click', voltarAoInicio);
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
  escreverTextoComEfeitoGeracao(titulo, 'Bem-vindo ao Quiz de Fake News!');

  const subtitulo = document.createElement('p');
  subtitulo.className = 'subtitulo';
  subtitulo.innerText = 'Consegue distinguir uma notícia verdadeira de uma falsa?';
  container.appendChild(subtitulo);
  
  // Criar div para os botões
  const botoesDiv = document.createElement('div');
  botoesDiv.className = 'botoes-inicio';
  
  // Botão para começar o jogo
  const botaoJogar = document.createElement('button');
  botaoJogar.id = 'start-btn';
  botaoJogar.innerText = 'Começar';
  botaoJogar.addEventListener('click', iniciarQuiz);
  botoesDiv.appendChild(botaoJogar);
  
  // Botão para ver classificações
  const botaoClassificacoes = document.createElement('button');
  botaoClassificacoes.id = 'ver-classificacoes-btn';
  botaoClassificacoes.className = 'btn-leaderboard-inicio';
  botaoClassificacoes.innerText = 'Classificações';
  botaoClassificacoes.addEventListener('click', mostrarLeaderboardInicial);
  botoesDiv.appendChild(botaoClassificacoes);
  
  container.appendChild(botoesDiv);

  // Remover a barra de progresso em vez de apenas ocultar
  const barra = document.getElementById('barra-progresso');
  if (barra) {
    barra.remove();
  }
}

// ==============================================
// 5. FUNÇÕES DE LEADERBOARD
// ==============================================
// Função para guardar pontuação
function guardarPontuacao() {
  const nomeInput = document.getElementById('nome-jogador');
  const nome = nomeInput.value.trim();
  const msgLeaderboard = document.getElementById('mensagem-leaderboard');
  
  if (!nome) {
    msgLeaderboard.textContent = 'Por favor, insere um nome válido.';
    msgLeaderboard.className = 'erro-mensagem';
    return;
  }
  
  // Obter leaderboard atual ou criar um novo
  let leaderboard = JSON.parse(localStorage.getItem('fakeQuizLeaderboard') || '[]');
  
  // Calcular percentagem
  const percentagem = Math.round((pontuacao / perguntasSelecionadas.length) * 100);
  
  // Adicionar nova pontuação com percentagem
  leaderboard.push({
    nome: nome,
    pontuacao: pontuacao,
    totalPerguntas: perguntasSelecionadas.length,
    percentagem: percentagem,
    data: new Date().toISOString().substr(0, 10)
  });
  
  // Ordenar por percentagem (descendente) e limitar a 10 entradas
  leaderboard.sort((a, b) => b.percentagem - a.percentagem);
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  
  // Guardar no localStorage
  localStorage.setItem('fakeQuizLeaderboard', JSON.stringify(leaderboard));
  
  // Mostrar mensagem de sucesso
  msgLeaderboard.textContent = 'Pontuação guardada com sucesso!';
  msgLeaderboard.className = 'erro-mensagem sucesso';
  
  // Desativar botão após guardar
  document.getElementById('btn-guardar').disabled = true;
  
  // Atualizar e mostrar leaderboard após curto delay
  setTimeout(() => {
    mostrarLeaderboard();
  }, 1000);
}

// Função para mostrar leaderboard após resultados
function mostrarLeaderboard() {
  // Limpa conteúdos antigos se existirem
  let leaderboardContainer = document.getElementById('leaderboard-container');
  if (!leaderboardContainer) {
    leaderboardContainer = document.createElement('div');
    leaderboardContainer.id = 'leaderboard-container';
    container.appendChild(leaderboardContainer);
  }
  
  // Renderiza a tabela de classificações
  renderizarTabelaClassificacoes(leaderboardContainer);
}

// Função para mostrar leaderboard na página inicial
function mostrarLeaderboardInicial() {
  // Limpar container existente
  container.innerHTML = '';
  
  // Remover a barra de progresso se existir
  const barra = document.getElementById('barra-progresso');
  if (barra) {
    barra.remove();
  }
  
  // Adicionar botão de voltar
  const btnVoltar = document.createElement('button');
  btnVoltar.id = 'btn-voltar-inicio';
  btnVoltar.innerText = '⎋';
  btnVoltar.title = 'Voltar ao início';
  btnVoltar.addEventListener('click', voltarAoInicio);
  container.appendChild(btnVoltar);
  
  // Adicionar título
  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Melhores Classificações');
  
  // Criar container para o leaderboard
  const leaderboardContainer = document.createElement('div');
  leaderboardContainer.id = 'leaderboard-container';
  container.appendChild(leaderboardContainer);
  
  // Renderiza a tabela de classificações
  renderizarTabelaClassificacoes(leaderboardContainer);
}

// Função centralizada para renderizar a tabela de classificações
function renderizarTabelaClassificacoes(containerElement) {
  // Obter dados do leaderboard
  const leaderboard = JSON.parse(localStorage.getItem('fakeQuizLeaderboard') || '[]');
  
  // Verificar se há dados para mostrar
  if (leaderboard.length === 0) {
    containerElement.innerHTML = '<h3>Classificações</h3><p>Ainda não há pontuações registadas.<br>Joga o quiz para ser o primeiro a entrar nas classificações!</p>';
    return;
  }
  
  // Criar tabela de classificações
  let html = `
    <h3>Classificações</h3>
    <div class="tabela-container">
      <table class="tabela-leaderboard">
        <tr>
          <th>Posição</th>
          <th>Nome</th>
          <th>Pontuação</th>
          <th>Data</th>
        </tr>
  `;
  
  leaderboard.forEach((item, index) => {
    let classeEspecial = '';
    if (index === 0) classeEspecial = 'primeiro-lugar';
    else if (index === 1) classeEspecial = 'segundo-lugar';
    else if (index === 2) classeEspecial = 'terceiro-lugar';
    
    // Mostrar pontuação com percentagem
    const pontuacaoTexto = item.percentagem !== undefined 
      ? `${item.pontuacao}/${item.totalPerguntas} (${item.percentagem}%)`
      : `${item.pontuacao}/10`;
    
    html += `
      <tr class="${classeEspecial}">
        <td>${index + 1}</td>
        <td>${item.nome}</td>
        <td>${pontuacaoTexto}</td>
        <td>${item.data}</td>
      </tr>
    `;
  });
  
  html += `</table></div>`;
  
  // Adicionar botão para limpar leaderboard
  html += `<button class="btn-limpar-leaderboard" id="btn-limpar">Limpar Classificações</button>`;
  
  containerElement.innerHTML = html;
  
  // Adicionar evento ao botão de limpar
  const btnLimpar = document.getElementById('btn-limpar');
  if (btnLimpar) {
    btnLimpar.addEventListener('click', limparLeaderboard);
  }
}

// Função para limpar o leaderboard
function limparLeaderboard() {
  if (confirm('Tens a certeza que queres limpar todas as classificações? Esta ação não pode ser desfeita.')) {
    localStorage.removeItem('fakeQuizLeaderboard');
    mostrarLeaderboard();
  }
}

// ==============================================
// 6. EFEITOS VISUAIS E ANIMAÇÕES
// ==============================================
// Função para o efeito de "geração de texto" com caracteres aleatórios
function escreverTextoComEfeitoGeracao(elemento, textoFinal, velocidade = 25) {
  // Array com caracteres para o efeito de "hacking"
  const charsetHack = '!@#$%^&*()_+-=[];,./\\|~`<>?:"{}';
  const charsetAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charset = charsetHack + charsetAlpha;
  
  // Limpar qualquer conteúdo anterior
  elemento.innerHTML = '';
  
  // Preservar espaços no texto
  const palavras = textoFinal.split(' ');
  const fragmentos = [];
  
  // Criar spans para cada palavra e espaço
  palavras.forEach((palavra, index) => {
    // Adicionar a palavra
    for (let i = 0; i < palavra.length; i++) {
      const span = document.createElement('span');
      span.className = 'char-hacking';
      span.textContent = charset[Math.floor(Math.random() * charset.length)];
      fragmentos.push({span, char: palavra[i]});
      elemento.appendChild(span);
    }
    
    // Adicionar espaço entre palavras (exceto na última palavra)
    if (index < palavras.length - 1) {
      const span = document.createElement('span');
      span.textContent = ' ';
      elemento.appendChild(span);
      fragmentos.push({span, char: ' '});
    }
  });
  
  // Função que atualiza um caractere para mostrar caracteres aleatórios e depois o definitivo
  function atualizarCaractere(indice, iteracoes, maxIteracoes, finalChar) {
    if (finalChar === ' ') {
      fragmentos[indice].span.textContent = ' ';
      return;
    }
    
    // Se ainda estamos em iterações aleatórias
    if (iteracoes < maxIteracoes) {
      fragmentos[indice].span.textContent = charset[Math.floor(Math.random() * charset.length)];
      setTimeout(() => {
        atualizarCaractere(indice, iteracoes + 1, maxIteracoes, finalChar);
      }, velocidade / 3); // Acelerar um pouco o efeito
    } else {
      // Definir o caractere final
      fragmentos[indice].span.textContent = finalChar;
      fragmentos[indice].span.classList.add('char-final');
    }
  }
  
  // Iniciar a animação para cada caractere com temporizações escalonadas
  for (let i = 0; i < fragmentos.length; i++) {
    const fragment = fragmentos[i];
    if (fragment.char === ' ') continue;
    
    const iteracoesRandomicas = Math.floor(Math.random() * 3) + 2; // 2-4 iterações de caracteres aleatórios
    
    setTimeout(() => {
      atualizarCaractere(i, 0, iteracoesRandomicas, fragment.char);
    }, (i * velocidade) / 2); // Fazer o efeito mais rápido
  }
  
  // Retornar uma promessa que resolve quando toda a animação terminar
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ((fragmentos.length * velocidade) / 2) + 200); // Ajustar timing
  });
}

// Inicializar as configurações quando o documento estiver pronto
configurarVideoFundo();
configurarControleAudio();