const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Configurações do middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint para obter todas as notícias
app.get('/api/noticias', (req, res) => {
  try {
    const noticias = JSON.parse(fs.readFileSync('noticias.json', 'utf8'));
    res.json(noticias);
  } catch (err) {
    console.error('Erro ao ler o ficheiro:', err);
    res.status(500).json({ erro: 'Não foi possível ler as notícias' });
  }
});

// Endpoint para adicionar uma nova notícia
app.post('/api/noticias', (req, res) => {
  try {
    const novaNoticia = req.body;
    
    // Validações básicas
    if (!novaNoticia.texto || typeof novaNoticia.verdadeiro !== 'boolean') {
      return res.status(400).json({ erro: 'Dados incompletos ou inválidos' });
    }
    
    // Garantir que a notícia está no formato correto
    const noticiaFormatada = {
      texto: novaNoticia.texto,
      verdadeiro: novaNoticia.verdadeiro,
      imagem: novaNoticia.imagem || "",
      isHuman: true,
      dataSubmissao: new Date().toISOString()
    };
    
    // Ler o ficheiro JSON atual
    const noticias = JSON.parse(fs.readFileSync('noticias.json', 'utf8'));
    
    // Adicionar a nova notícia
    noticias.push(noticiaFormatada);
    
    // Guardar o ficheiro atualizado
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    
    // Responder com sucesso
    res.status(201).json({ 
      mensagem: 'Notícia adicionada com sucesso', 
      noticia: noticiaFormatada 
    });
    
  } catch (err) {
    console.error('Erro ao adicionar notícia:', err);
    res.status(500).json({ erro: 'Não foi possível adicionar a notícia' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor FakeQuiz em execução em http://localhost:${port}`);
});