# FakeQuiz - Quiz de Deteção de Notícias Falsas

![FakeQuiz Preview](imagens/fakequiz-preview.jpg)

## Sobre o Projeto

FakeQuiz é uma aplicação interativa que desafia os utilizadores a distinguir entre notícias verdadeiras e falsas, promovendo o pensamento crítico e a literacia mediática. Com um design inspirado no filme "Matrix", a aplicação apresenta um quiz envolvente onde os participantes devem decidir se cada notícia apresentada é verdadeira ou falsa.

## Funcionalidades

- **Quiz Interativo**: 5 notícias por sessão, escolhidas aleatoriamente de um banco de dados
- **Temporizador**: 10 segundos para responder a cada pergunta
- **Efeito Visual Único**: Animação de texto "hacker" durante a apresentação das notícias
- **Sistema de Pontuação**: Ranking baseado em percentagem de acertos
- **Submissão de Notícias**: Utilizadores com ≥50% de acertos podem submeter suas próprias notícias
- **Análise Comparativa**: Estatísticas sobre notícias criadas por humanos vs. IA
- **Interface Responsiva**: Experiência otimizada para dispositivos móveis e desktop
- **Design Temático**: Visual inspirado no filme "Matrix" com esquema de cores verde e preto

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js com Express
- **Armazenamento de Dados**: JSON e localStorage
- **Animações**: CSS Animations e JavaScript para efeitos visuais
- **Media**: Vídeos de fundo com cross-fade e áudio ambiente

## Como Instalar e Executar

### Pré-requisitos
- Node.js (v14.0.0 ou superior)
- npm (v6.0.0 ou superior)

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/FakeQuiz.git
cd FakeQuiz
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

4. Aceda à aplicação no navegador:
```
http://localhost:3000
```

## Estrutura do Projeto

```
FakeQuiz/
├── index.html           # Página principal
├── script.js            # Lógica da aplicação
├── style.css            # Estilos da aplicação
├── server.js            # Servidor Express
├── noticias.json        # Banco de dados de notícias
├── package.json         # Dependências e scripts
└── imagens/             # Recursos visuais
```

## Como Jogar

1. Inicie o quiz clicando no botão "Começar"
2. Leia a notícia apresentada
3. Decida se a notícia é verdadeira ou falsa dentro de 10 segundos
4. Veja o seu resultado final após responder a todas as perguntas
5. Submeta sua pontuação para o ranking
6. Se obteve 50% ou mais de acertos, pode submeter suas próprias notícias

## Contribuição para o Banco de Notícias

Utilizadores com pontuação igual ou superior a 50% podem contribuir com notícias para o banco de dados. Estas notícias serão marcadas como criadas por humanos (`isHuman: true`) e serão utilizadas para comparar com as notícias criadas por IA.

### Diretrizes para Submissão de Notícias:

1. O texto deve ter pelo menos 20 caracteres
2. A notícia deve ser claramente verdadeira ou falsa (sem ambiguidades)
3. Imagens são opcionais, mas recomendadas (TODO)
4. Evite conteúdo ofensivo, discriminatório ou sensível

## Estatísticas e Análise

O FakeQuiz recolhe dados anónimos sobre:

- Taxa de acertos para notícias criadas por IA
- Taxa de acertos para notícias criadas por humanos
- Tempo médio de resposta
- Distribuição de respostas por tipo de notícia

Estes dados são utilizados exclusivamente para melhorar a aplicação e compreender melhor a capacidade das pessoas de identificar desinformação.

## Características da Versão 2.0 (Agora vai passar para Versão 3.0)

- Interface com tema Matrix melhorado
- Redução do quiz para 3 perguntas (mais rápido e direto)
- Timer de 10 segundos para cada pergunta
- Efeito visual de texto "hacker" decifrado
- Organização modular do código
- Sistema de submissão de notícias
- Melhor feedback visual e animações
- Classificação por percentagem de acertos

## Sobre o Desenvolvimento

Este projeto foi criado como uma ferramenta educativa para promover a literacia mediática e o pensamento crítico. Inspirado pelo aumento da desinformação online, o FakeQuiz propõe-se a ajudar os utilizadores a desenvolverem melhores habilidades de verificação de factos de forma lúdica.

## Licença

MIT License - Veja o ficheiro LICENSE para mais detalhes.

## Contacto

Para questões, sugestões ou feedback, por favor abra uma issue neste repositório ou contacte a equipa de desenvolvimento através do e-mail: exemplo@fakequiz.pt

---

Desenvolvido com ❤️ pela equipa FakeQuiz. Vamos combater a desinformação juntos!