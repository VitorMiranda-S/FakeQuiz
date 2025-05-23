// ==============================================
// ORGANIZAÇÃO DO CÓDIGO:
// 0. Tela de Loading
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

let estatisticasGlobais = {
  totalPerguntasIA: 0,
  totalPerguntasHumanas: 0,
  acertosIA: 0,
  acertosHumanos: 0,
  totalRespostas: 0,
  timeouts: 0
};

// Elementos DOM principais
const container = document.getElementById('quiz-container');
const botaoIniciar = document.getElementById('start-btn');
const btnVerClassificacoes = document.getElementById('ver-classificacoes-btn');
const audio = document.getElementById('ambiente-audio');
const toggleBtn = document.getElementById('toggle-audio');
const video1 = document.getElementById('video-fundo-1');
const video2 = document.getElementById('video-fundo-2');


// ==============================================
// 0. TELA DE LOADING
// ==============================================

// Configuração de eventos iniciais
document.addEventListener('DOMContentLoaded', () => {
  // Limpar o texto do título imediatamente para evitar exibição antes da animação
  const tituloPrincipal = document.getElementById('titulo');
  if (tituloPrincipal) {
    // Guardar o texto original do título
    const textoOriginal = tituloPrincipal.textContent;
    // Preservar o espaço mas esconder o texto
    tituloPrincipal.textContent = textoOriginal;
    tituloPrincipal.classList.add('escondido');
  }
  
  // Esconder o conteúdo principal até o loading terminar
  document.getElementById('quiz-wrapper').style.opacity = '0';
  document.getElementById('quiz-wrapper').style.transition = 'opacity 0.8s ease-in';
  document.getElementById('toggle-audio').style.opacity = '0';
  document.getElementById('toggle-audio').style.transition = 'opacity 0.8s ease-in';
  document.getElementById('logo-evento').style.opacity = '0';
  document.getElementById('logo-evento').style.transition = 'opacity 0.8s ease-in';
  document.getElementById('video-container').style.opacity = '0';
  document.getElementById('video-container').style.transition = 'opacity 1s ease-in';
  
  // Ativar o primeiro vídeo após o loading
  const video1 = document.getElementById('video-fundo-1');
  video1.classList.remove('ativo');

  // Iniciar timer de 3 segundos para a tela de loading
  setTimeout(() => {
    // Fazer fade out da tela de loading
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    
    // Mostrar o conteúdo principal
    document.getElementById('quiz-wrapper').style.opacity = '1';
    document.getElementById('toggle-audio').style.opacity = '1';
    document.getElementById('logo-evento').style.opacity = '1';
    document.getElementById('video-container').style.opacity = '1';
    
    // Iniciar o vídeo de fundo
    video1.classList.add('ativo');
    video1.play();
    
    // Remover a tela de loading após a transição
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      
      // Preparar o título para a animação sem alterar o layout
      if (tituloPrincipal) {
        // Remover a classe de escondido e limpar o texto para iniciar a animação
        tituloPrincipal.classList.remove('escondido');
        tituloPrincipal.textContent = '';
        tituloPrincipal.classList.add('typing');
        
        // Começar a animação de geração de texto com uma velocidade mais lenta
        escreverTextoComEfeitoGeracao(tituloPrincipal, 'Bem-vindo ao Quiz de Fake News!', 50);
      }
    }, 800);
  }, 3000);
  
  // Inicializar as configurações
  if (botaoIniciar) botaoIniciar.addEventListener('click', iniciarQuiz);
  if (btnVerClassificacoes) btnVerClassificacoes.addEventListener('click', mostrarLeaderboardInicial);
  
  // Adicionar listeners para os novos botões
  const btnEstatisticas = document.getElementById('btn-estatisticas');
  if (btnEstatisticas) btnEstatisticas.addEventListener('click', mostrarEstatisticas);
  
  const btnCreditos = document.getElementById('btn-creditos');
  if (btnCreditos) btnCreditos.addEventListener('click', mostrarCreditos);
  
  // Carregar estatísticas existentes
  carregarEstatisticas();
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
<<<<<<< Updated upstream
  fetch('noticias.json')
=======
  // Resetar o estado da submissão ao iniciar um novo jogo
  noticiaJaSubmetida = false;

  // Carregar notícias do servidor
  fetch('http://localhost:3000/api/noticias')
>>>>>>> Stashed changes
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
  const acertou = resposta === correta;
  if (acertou) pontuacao++;

  // Registrar estatísticas
  estatisticasGlobais.totalRespostas++;
  
  if (pergunta.isHuman) {
    estatisticasGlobais.totalPerguntasHumanas++;
    if (acertou) estatisticasGlobais.acertosHumanos++;
  } else {
    estatisticasGlobais.totalPerguntasIA++;
    if (acertou) estatisticasGlobais.acertosIA++;
  }
  
  // Salvar estatísticas atualizadas
  salvarEstatisticas();

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

// Função para mostrar a página de estatísticas
function mostrarEstatisticas() {
  // Limpar container existente
  container.innerHTML = '';
  
  // Adicionar botão de voltar
  const btnVoltar = criarBotaoVoltar();
  container.appendChild(btnVoltar);
  
  // Adicionar título
  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Estatísticas de Desempenho');
  
  // Criar container para estatísticas
  const estatisticasContainer = document.createElement('div');
  estatisticasContainer.className = 'estatisticas-container';
  
  // Carregar estatísticas salvas
  carregarEstatisticas();
  
  // Calcular taxas de acerto
  const taxaAcertoIA = estatisticasGlobais.totalPerguntasIA > 0 
    ? Math.round((estatisticasGlobais.acertosIA / estatisticasGlobais.totalPerguntasIA) * 100) 
    : 0;
    
  const taxaAcertoHumanos = estatisticasGlobais.totalPerguntasHumanas > 0 
    ? Math.round((estatisticasGlobais.acertosHumanos / estatisticasGlobais.totalPerguntasHumanas) * 100) 
    : 0;
  
  // Taxa de acerto global
  const totalAcertos = estatisticasGlobais.acertosIA + estatisticasGlobais.acertosHumanos;
  const totalPerguntas = estatisticasGlobais.totalPerguntasIA + estatisticasGlobais.totalPerguntasHumanas;
  const taxaGlobal = totalPerguntas > 0 
    ? Math.round((totalAcertos / totalPerguntas) * 100) 
    : 0;
  
  // Criar conteúdo HTML para as estatísticas
  estatisticasContainer.innerHTML = `
    <div class="estatistica-grupo">
      <h3 class="estatistica-titulo">Comparação de Deteção: Humanos vs. IA</h3>
      <p>Abaixo podes ver o desempenho global dos jogadores na identificação de notícias falsas.</p>
      
      <div class="estatistica-comparacao">
        <div class="estatistica-item">
          <div class="estatistica-label">Notícias criadas por IA</div>
          <div class="estatistica-valor valor-ia">${taxaAcertoIA}%</div>
          <div>Respostas corretas</div>
          <div class="estatistica-barra-container">
            <div class="estatistica-barra barra-ia" style="width: ${taxaAcertoIA}%"></div>
          </div>
          <div class="estatistica-detalhe">
            ${estatisticasGlobais.acertosIA} acertos em ${estatisticasGlobais.totalPerguntasIA} perguntas
          </div>
        </div>
        
        <div class="estatistica-item">
          <div class="estatistica-label">Notícias criadas por Humanos</div>
          <div class="estatistica-valor valor-humano">${taxaAcertoHumanos}%</div>
          <div>Respostas corretas</div>
          <div class="estatistica-barra-container">
            <div class="estatistica-barra barra-humano" style="width: ${taxaAcertoHumanos}%"></div>
          </div>
          <div class="estatistica-detalhe">
            ${estatisticasGlobais.acertosHumanos} acertos em ${estatisticasGlobais.totalPerguntasHumanas} perguntas
          </div>
        </div>
      </div>
    </div>
    
    <div class="estatistica-grupo">
      <h3 class="estatistica-titulo">Estatísticas Globais</h3>
      
      <div class="estatisticas-detalhes">
        <div class="estatisticas-detalhes-item">
          <div class="estatistica-label">Taxa de Acerto Global</div>
          <div class="estatistica-valor">${taxaGlobal}%</div>
          <div>${totalAcertos} acertos em ${totalPerguntas} perguntas</div>
        </div>
        
        <div class="estatisticas-detalhes-item">
          <div class="estatistica-label">Respostas com Tempo Esgotado</div>
          <div class="estatistica-valor">${estatisticasGlobais.timeouts}</div>
          <div>${Math.round((estatisticasGlobais.timeouts / estatisticasGlobais.totalRespostas) * 100 || 0)}% do total de respostas</div>
        </div>
      </div>
    </div>
    
    <div class="estatistica-grupo">
      <h3 class="estatistica-titulo">Análise</h3>
      <p>
        ${
          taxaAcertoIA > taxaAcertoHumanos 
          ? 'Os jogadores têm mais facilidade em identificar notícias geradas por IA do que por humanos.' 
          : taxaAcertoHumanos > taxaAcertoIA 
          ? 'Os jogadores têm mais facilidade em identificar notícias criadas por humanos do que por IA.' 
          : 'Os jogadores têm aproximadamente a mesma capacidade de identificar notícias falsas, independentemente da origem.'
        }
      </p>
      <p>
        ${
          taxaAcertoIA < 50 && taxaAcertoHumanos < 50 
          ? 'De modo geral, as pessoas têm dificuldade em distinguir notícias verdadeiras de falsas, o que destaca a importância da literacia mediática.' 
          : taxaAcertoIA > 75 || taxaAcertoHumanos > 75 
          ? 'Os resultados mostram uma boa capacidade dos jogadores em detectar desinformação, indicando bons níveis de literacia mediática.' 
          : 'Os resultados mostram uma capacidade moderada dos jogadores em detectar desinformação.'
        }
      </p>
    </div>
  `;
  
  container.appendChild(estatisticasContainer);
  
  // Botão para resetar estatísticas
  const btnResetEstatisticas = document.createElement('button');
  btnResetEstatisticas.className = 'btn-limpar-leaderboard';
  btnResetEstatisticas.innerText = 'Limpar Estatísticas';
  btnResetEstatisticas.addEventListener('click', () => {
    if (confirm('Tens a certeza que queres limpar todas as estatísticas? Esta ação não pode ser desfeita.')) {
      estatisticasGlobais = {
        totalPerguntasIA: 0,
        totalPerguntasHumanas: 0,
        acertosIA: 0,
        acertosHumanos: 0,
        totalRespostas: 0,
        timeouts: 0
      };
      salvarEstatisticas();
      mostrarEstatisticas(); // Recarregar a página
    }
  });
  estatisticasContainer.appendChild(btnResetEstatisticas);
}

// Função para mostrar créditos
function mostrarCreditos() {
  // Limpar container existente
  container.innerHTML = '';
  
  // Adicionar botão de voltar
  const btnVoltar = criarBotaoVoltar();
  container.appendChild(btnVoltar);
  
  // Adicionar título
  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Créditos');
  
  // Criar container para créditos
  const creditosContainer = document.createElement('div');
  creditosContainer.className = 'creditos-container';
  
  creditosContainer.innerHTML = `
    <div class="credito-secao">
      <h3 class="estatistica-titulo">Desenvolvimento</h3>
      <ul class="credito-lista">
        <li><strong>Design e Programação:</strong> Equipa FakeQuiz</li>
        <li><strong>Conceito e Ideia:</strong> Projeto de Literacia Mediática</li>
        <li><strong>Ano de Desenvolvimento:</strong> 2025</li>
      </ul>
    </div>
    
    <div class="credito-secao">
      <h3 class="estatistica-titulo">Recursos</h3>
      <ul class="credito-lista">
        <li><strong>Ambiente Visual:</strong> Inspirado no filme Matrix</li>
        <li><strong>Efeitos Sonoros:</strong> Clubbed to Death - Rob Dougan</li>
        <li><strong>Vídeo de Fundo:</strong> https://www.vecteezy.com/members/biggapixmotion</li>
      </ul>
    </div>
    
    <div class="credito-secao">
      <h3 class="estatistica-titulo">Agradecimentos Especiais</h3>
      <p>O nosso agradecimento a todos os utilizadores que contribuíram com notícias e ajudaram a melhorar esta plataforma educativa.</p>
      
      <div class="estatistica-titulo" style="margin-top: 30px;">
        <p>Desenvolvido com ❤️ pela equipa FakeQuiz</p>
        <p style="font-size: 14px;">Vamos combater a desinformação juntos!</p>
      </div>
    </div>
  `;
  
  container.appendChild(creditosContainer);
}

// Configuração de eventos iniciais
document.addEventListener('DOMContentLoaded', () => {
  if (botaoIniciar) botaoIniciar.addEventListener('click', iniciarQuiz);
  if (btnVerClassificacoes) btnVerClassificacoes.addEventListener('click', mostrarLeaderboardInicial);
  
  // Adicionar listeners para os novos botões
  const btnEstatisticas = document.getElementById('btn-estatisticas');
  if (btnEstatisticas) btnEstatisticas.addEventListener('click', mostrarEstatisticas);
  
  const btnCreditos = document.getElementById('btn-creditos');
  if (btnCreditos) btnCreditos.addEventListener('click', mostrarCreditos);
  
  // Carregar estatísticas existentes
  carregarEstatisticas();
});

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

   const btnVoltar = criarBotaoVoltar();
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

<<<<<<< Updated upstream
=======
// Função para iniciar e gerenciar o timer
function iniciarTimer() {
  let tempoRestante = timerDuracao;
  const timerBarra = document.getElementById('timer-barra');
  const timerTexto = document.getElementById('timer-texto');
  
  // Inicializar a barra visualmente
  timerBarra.style.width = '100%';
  timerBarra.className = 'timer-barra timer-ativo';
  
  // Atualizar o timer a cada segundo
  const atualizarTimer = () => {
    tempoRestante--;
    
    if (tempoRestante >= 0) {
      // Atualizar texto e largura da barra
      timerTexto.innerText = `${tempoRestante}s`;
      const porcentagem = (tempoRestante / timerDuracao) * 100;
      timerBarra.style.width = `${porcentagem}%`;
      
      // Adicionar classe de aviso nos últimos 3 segundos
      if (tempoRestante <= 3) {
        timerBarra.className = 'timer-barra timer-alerta';
        timerTexto.className = 'timer-texto timer-texto-alerta';
      }
      
      // Chamar próxima atualização
      timerAtual = setTimeout(atualizarTimer, 1000);
    } else {
      // Tempo esgotado, considerar como resposta errada
      timerBarra.className = 'timer-barra timer-expirado';
      timerTexto.className = 'timer-texto timer-texto-expirado';
      timerTexto.innerText = 'Tempo!';
      
      // Após breve pausa para mostrar que o tempo acabou, processar como resposta errada
      setTimeout(() => {
        tempoEsgotado();
      }, 800);
    }
  };
  
  // Iniciar a contagem regressiva
  timerAtual = setTimeout(atualizarTimer, 1000);
}

// Função que lida com o tempo esgotado
function tempoEsgotado() {
  // Se já estiver processando uma resposta, ignorar
  if (processandoResposta) return;
  processandoResposta = true;
  
  // Desativar os botões
  const botoes = document.querySelectorAll('.resposta');
  botoes.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
  });
  
  estatisticasGlobais.timeouts++;
  estatisticasGlobais.totalRespostas++;
  
  const pergunta = perguntasSelecionadas[indiceAtual];
  if (pergunta.isHuman) {
    estatisticasGlobais.totalPerguntasHumanas++;
  } else {
    estatisticasGlobais.totalPerguntasIA++;
  }

  salvarEstatisticas();

  const correta = pergunta.verdadeiro;

  // Registrar como tempo esgotado
  respostasDadas.push({
    texto: pergunta.texto,
    respostaDada: "timeout", // Valor especial para indicar tempo esgotado
    respostaCorreta: correta,
    isHuman: pergunta.isHuman || false
  });

  indiceAtual++;
  
  // A mesma lógica da função responder() para verificar se é a última pergunta
  if (indiceAtual >= perguntasSelecionadas.length) {
    const barraPreenchida = document.getElementById('progresso-preenchido');
    const textoProgresso = document.getElementById('progresso-texto');
    
    if (barraPreenchida && textoProgresso) {
      barraPreenchida.style.width = '100%';
      textoProgresso.innerText = `${perguntasSelecionadas.length} / ${perguntasSelecionadas.length}`;
      
      setTimeout(() => {
        const barra = document.getElementById('barra-progresso');
        if (barra) {
          barra.classList.add('fade-out-progressbar');
          
          setTimeout(() => {
            mostrarResultado();
            processandoResposta = false;
          }, 800);
        }
      }, 600);
    }
  } else {
    setTimeout(() => {
      mostrarPergunta();
      processandoResposta = false;
    }, 800);
  }
}


// Função para carregar estatísticas do localStorage
function carregarEstatisticas() {
  const estatisticasSalvas = localStorage.getItem('fakeQuizEstatisticas');
  if (estatisticasSalvas) {
    estatisticasGlobais = JSON.parse(estatisticasSalvas);
  }
}

// Função para salvar estatísticas no localStorage
function salvarEstatisticas() {
  localStorage.setItem('fakeQuizEstatisticas', JSON.stringify(estatisticasGlobais));
}

>>>>>>> Stashed changes
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

let noticiaJaSubmetida = false;
// Mostrar resultado final
function mostrarResultado() {
  const barra = document.getElementById('barra-progresso');
  if (barra) barra.style.display = 'none';
  
  container.innerHTML = '';
  container.classList.add('resultado-container');

  // Adicionar botão de voltar
  const btnVoltar = criarBotaoVoltar();
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
<<<<<<< Updated upstream
}

=======
  
  // Adicionar botão para submeter notícia - visível para todos, mas ativo apenas para quem tem >= 50%
  const btnSubmeterNoticia = document.createElement('button');
  btnSubmeterNoticia.className = 'btn-submeter-noticia';
  
  // Verificar se já submeteu uma notícia neste jogo
  if (noticiaJaSubmetida) {
    btnSubmeterNoticia.innerText = 'Notícia já submetida';
    btnSubmeterNoticia.disabled = true;
    btnSubmeterNoticia.title = 'Só podes submeter uma notícia por jogo';
    btnSubmeterNoticia.classList.add('btn-bloqueado');
  } else {
    btnSubmeterNoticia.innerText = 'Submeter Nova Notícia';
    
    // Verificar se o utilizador tem pontuação suficiente (>= 50%)
    if (percentagem >= 50) {
      btnSubmeterNoticia.addEventListener('click', mostrarFormularioNovaNoticia);
    } else {
      btnSubmeterNoticia.disabled = true;
      btnSubmeterNoticia.title = 'Precisas de acertar pelo menos 50% das perguntas para desbloquear esta funcionalidade';
      btnSubmeterNoticia.classList.add('btn-bloqueado');
    }
  }
  
  container.appendChild(btnSubmeterNoticia);
}

// Função para mostrar o formulário de submissão de novas notícias
function mostrarFormularioNovaNoticia() {
  container.innerHTML = '';
  container.classList.remove('resultado-container');
  container.classList.add('formulario-noticia-container');

  const btnVoltar = criarBotaoVoltar();
  container.appendChild(btnVoltar);

  const titulo = document.createElement('h2');
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Submeter Nova Notícia');

  const instrucoes = document.createElement('p');
  instrucoes.innerHTML = `
    Cria uma notícia verdadeira ou falsa para desafiar outros jogadores.<br>
    As melhores notícias são aquelas que parecem plausíveis mas contêm elementos incorretos.<br>
    Sê criativo, mas mantém a notícia dentro de temas atuais e relevantes.
  `;
  container.appendChild(instrucoes);

  // Criar formulário para submissão de notícia
  const form = document.createElement('form');
  form.id = 'form-noticia';
  form.className = 'form-noticia';
  form.innerHTML = `
    <div class="campo-formulario">
      <label for="texto-noticia">Texto da Notícia:</label>
      <textarea id="texto-noticia" rows="5" placeholder="Escreve aqui a tua notícia..." required></textarea>
    </div>

    <div class="campo-formulario">
      <label>Esta notícia é:</label>
      <div class="radio-opcoes">
        <label class="radio-label">
          <input type="radio" name="verdadeiro" value="true" required> Verdadeira
        </label>
        <label class="radio-label">
          <input type="radio" name="verdadeiro" value="false"> Falsa
        </label>
      </div>
    </div>
    
    <div class="campo-formulario">
      <label for="url-imagem">URL da imagem (opcional):</label>
      <input type="url" id="url-imagem" placeholder="https://exemplo.com/imagem.jpg">
      <small>Deixa em branco se não tiveres uma imagem para a notícia</small>
    </div>
    
    <div class="botoes-formulario">
      <button type="button" id="btn-cancelar" class="btn-cancelar">Cancelar</button>
      <button type="submit" id="btn-submeter" class="btn-submeter">Submeter Notícia</button>
    </div>
    
    <div id="mensagem-submissao" class="mensagem-submissao"></div>
  `;
  container.appendChild(form);

  // Adicionar event listeners para o formulário
  document.getElementById('btn-cancelar').addEventListener('click', voltarAoResultado);
  document.getElementById('form-noticia').addEventListener('submit', submeterNovaNoticia);
}

// Função para voltar à página de resultados
function voltarAoResultado() {
  mostrarResultado();
}

// Função para processar a submissão de uma nova notícia
function submeterNovaNoticia(event) {
event.preventDefault();
  
  // Obter valores do formulário
  const textoNoticia = document.getElementById('texto-noticia').value.trim();
  const verdadeiro = document.querySelector('input[name="verdadeiro"]:checked').value === 'true';
  const urlImagem = document.getElementById('url-imagem').value.trim();
  const mensagemElement = document.getElementById('mensagem-submissao');
  
  // Validações básicas
  if (!textoNoticia) {
    mensagemElement.className = 'mensagem-submissao erro';
    mensagemElement.textContent = 'Por favor, insere o texto da notícia';
    return;
  }
  
  if (textoNoticia.length < 20) {
    mensagemElement.className = 'mensagem-submissao erro';
    mensagemElement.textContent = 'O texto da notícia deve ter pelo menos 20 caracteres';
    return;
  }
  
  // Desativar o botão de submissão para evitar múltiplos cliques
  const btnSubmeter = document.getElementById('btn-submeter');
  btnSubmeter.disabled = true;
  btnSubmeter.textContent = 'A submeter...';
  mensagemElement.textContent = '';
  
  // Criar objeto de notícia
  const novaNoticia = {
    texto: textoNoticia,
    verdadeiro: verdadeiro,
    imagem: urlImagem || "", 
    isHuman: true,
    dataSubmissao: new Date().toISOString()
  };
  
  // Enviar para o servidor usando fetch
  fetch('http://localhost:3000/api/noticias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(novaNoticia)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao submeter notícia');
    }
    return response.json();
  })
  .then(data => {
    // Também guardar em localStorage para uso imediato
    let noticiasHumanas = JSON.parse(localStorage.getItem('noticiasHumanas') || '[]');
    noticiasHumanas.push(novaNoticia);
    localStorage.setItem('noticiasHumanas', JSON.stringify(noticiasHumanas));
    
    // Marcar que já foi submetida uma notícia neste jogo
    noticiaJaSubmetida = true;
    
    // Mostrar mensagem de sucesso
    mensagemElement.className = 'mensagem-submissao sucesso';
    mensagemElement.textContent = 'Notícia submetida com sucesso! Obrigado pela tua contribuição.';
    
    // Limpar o formulário
    document.getElementById('form-noticia').reset();
    
    // Voltar ao menu de resultados após alguns segundos
    setTimeout(() => voltarAoResultado(), 3000);
  })
  .catch(error => {
    console.error('Erro:', error);
    mensagemElement.className = 'mensagem-submissao erro';
    mensagemElement.textContent = 'Ocorreu um erro ao submeter a notícia. Tenta novamente mais tarde.';
  })
  .finally(() => {
    // Restaurar o botão de submissão
    btnSubmeter.disabled = false;
    btnSubmeter.textContent = 'Submeter Notícia';
  });
}

// Modificar a função criarTabelaRespostas para mostrar explicitamente se a notícia era verdadeira ou falsa e origem da notícia
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  // Limpar qualquer timer existente
  if (timerAtual) {
    clearTimeout(timerAtual);
    timerAtual = null;
  }

>>>>>>> Stashed changes
  container.innerHTML = '';
  container.classList.remove('resultado-container');

  const titulo = document.createElement('h1');
  titulo.id = 'titulo';
  titulo.classList.add('typing');
  container.appendChild(titulo);
  escreverTextoComEfeitoGeracao(titulo, 'Bem-vindo ao Quiz de Fake News!');

  const subtitulo = document.createElement('p');
  subtitulo.className = 'subtitulo';
  subtitulo.innerText = 'Consegues distinguir uma notícia verdadeira de uma falsa?';
  container.appendChild(subtitulo);
  
  // Criar div para os botões - agora na vertical
  const botoesDiv = document.createElement('div');
  botoesDiv.className = 'botoes-inicio';
  
  // Botão para começar o jogo
  const botaoJogar = document.createElement('button');
  botaoJogar.id = 'start-btn';
  botaoJogar.innerText = 'Iniciar';
  botaoJogar.addEventListener('click', iniciarQuiz);
  botoesDiv.appendChild(botaoJogar);
  
  // Botão para ver classificações
  const botaoClassificacoes = document.createElement('button');
  botaoClassificacoes.id = 'ver-classificacoes-btn';
  botaoClassificacoes.className = 'btn-leaderboard-inicio';
  botaoClassificacoes.innerText = 'Classificações';
  botaoClassificacoes.addEventListener('click', mostrarLeaderboardInicial);
  botoesDiv.appendChild(botaoClassificacoes);
  
  // Botão para ver estatísticas
  const botaoEstatisticas = document.createElement('button');
  botaoEstatisticas.id = 'btn-estatisticas';
  botaoEstatisticas.innerText = 'Estatísticas';
  botaoEstatisticas.addEventListener('click', mostrarEstatisticas);
  botoesDiv.appendChild(botaoEstatisticas);
  
  // Botão para ver créditos
  const botaoCreditos = document.createElement('button');
  botaoCreditos.id = 'btn-creditos';
  botaoCreditos.innerText = 'Créditos';
  botaoCreditos.addEventListener('click', mostrarCreditos);
  botoesDiv.appendChild(botaoCreditos);
  
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
const btnVoltar = criarBotaoVoltar();
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

// Modificar a criação do botão de voltar em todas as funções relevantes
function criarBotaoVoltar() {
  const btnVoltar = document.createElement('button');
  btnVoltar.id = 'btn-voltar-inicio';
  btnVoltar.innerHTML = '⎋'; // Ícone de casa
  btnVoltar.title = 'Voltar ao início';
  btnVoltar.addEventListener('click', voltarAoInicio);
  return btnVoltar;
}

// Depois, substituir todas as ocorrências de criação manual do botão
// Por exemplo, na função mostrarPergunta():

// Em vez de:
// const btnVoltar = document.createElement('button');
// btnVoltar.id = 'btn-voltar-inicio';
// btnVoltar.innerText = '⎋';
// btnVoltar.title = 'Voltar ao início';
// btnVoltar.addEventListener('click', voltarAoInicio);

// Usar:
const btnVoltar = criarBotaoVoltar();