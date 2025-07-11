# README.md

```markdown
# FakeQuiz – Quiz de Deteção de Notícias Falsas

![FakeQuiz Preview]

Aplicação desenvolvida para o evento ESTG Connect


## Sobre o Projeto

FakeQuiz é uma aplicação interativa que desafia os utilizadores a distinguir entre notícias verdadeiras e falsas, promovendo o pensamento crítico e a literacia mediática. Com um design inspirado no filme "Matrix", a aplicação apresenta um quiz envolvente, onde os participantes devem decidir se cada notícia apresentada é verdadeira ou falsa.


## Funcionalidades

- **Quiz Interativo**: 6 notícias por sessão, escolhidas aleatoriamente de um banco de dados
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

1. Clona o repositório:
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
├── imagens/             # Recursos visuais
└── videos/              # Vídeos de fundo
```

## Como Jogar

1. Inicie o quiz clicando no botão "Começar"
2. Leia a notícia apresentada
3. Decida se a notícia é verdadeira ou falsa dentro de 10 segundos
4. Vê o teu resultado final após responder a todas as perguntas
5. Submete a tua pontuação
6. Se obteve 50% ou mais de acertos, pode submeter suas próprias notícias

## Contribuição para o Banco de Notícias

Utilizadores com pontuação igual ou superior a 50% podem contribuir com notícias para o banco de dados. Estas notícias serão marcadas como criadas por humanos (`isHuman: true`) e serão utilizadas para comparar com as notícias criadas por IA.

### Diretrizes para Submissão de Notícias:

1. O texto deve ter pelo menos 20 caracteres
2. A notícia deve ser claramente verdadeira ou falsa (sem ambiguidades)
3. Imagens são opcionais, mas recomendadas
4. Evite conteúdo ofensivo, discriminatório ou sensível

## Estatísticas e Análise

O FakeQuiz recolhe dados anónimos sobre:

- Taxa de acertos para notícias criadas por IA
- Taxa de acertos para notícias criadas por humanos
- Tempo médio de resposta
- Distribuição de respostas por tipo de notícia


Estes dados são utilizados exclusivamente para melhorar a aplicação e compreender melhor a capacidade dos utilizadores em identificar desinformação.


## Características da Versão 3.0

- Tela de loading estilo Matrix
- Timer de 10 segundos para cada pergunta
- Sistema de estatísticas para comparar eficácia humano vs. IA
- Menu principal reformulado com botões verticais
- Submissão de notícias para utilizadores com pontuação ≥50%
- Limite de 1 submissão por jogo
- Backend com Node.js/Express para persistência de dados

## Sobre o Desenvolvimento

Este projeto foi criado como uma ferramenta educativa para promover a literacia mediática e o pensamento crítico. Inspirado pelo aumento da desinformação online, o FakeQuiz propõe-se a ajudar os utilizadores a desenvolverem melhores habilidades de verificação de factos de forma lúdica.

## Licença

MIT License - Veja o ficheiro LICENSE para mais detalhes.

## Contacto

Para questões, sugestões ou feedback, por favor abra uma issue neste repositório ou contacte a equipa de desenvolvimento através do e-mail: exemplo@fakequiz.pt

---

Desenvolvido com ❤️ pela equipa FakeQuiz. Vamos combater a desinformação juntos!
```

# .gitignore

```
# Dependências
node_modules/
package-lock.json

# Arquivos de ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Diretórios de cache
.npm/
.eslintcache
.cache/

# Arquivos de build
/dist
/build

# Arquivos do sistema
.DS_Store
Thumbs.db
ehthumbs.db
Desktop.ini

# Arquivos temporários
*.swp
*.swo
*~

# Dados locais
/data

# Arquivos específicos do editor
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Arquivos de teste
coverage/
.nyc_output/

# Arquivos locais de configuração
config.local.js

# Arquivos de debug
debug.log

# Arquivos de backup
*.bak
```
