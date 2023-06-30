const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const consumoController = require('./controllers/consumoController');
const classificacaoController = require('./controllers/classificacaoController');
const recompensasController = require('./controllers/recompensasController');
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

// Models
const Perfil = require('./models/perfilModel');
const Utilizador = require('./models/utilizadorModel');

// Conexão à base de dados
mongoose.connect('mongodb://localhost:27017/gamification');
// Confirma ligação na consola
mongoose.connection.on('connected', function () {
  console.log('Conectado à base de dados ' + 'gamification');
});
// Mensagem de erro
mongoose.connection.on('error', (err) => {
  console.log('Erro na base de dados ' + err);
});

// Configuração da view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.use('/uploads', express.static('uploads'));

// Todo o URL começado por ‘/api’ chama as rotas em ‘./routes/utilizador’
const routes = require('./routes/rotas');
app.use('/api', routes);

// Error handling middleware
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(422).send({ error: err.message });
});

// Rota para a homepage
app.get('/', (req, res) => {
  res.render('homePage');
});

// Configuração do multer para o upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Rota para exibir o perfil do utilizador
app.get('/api/perfilUtilizador/:id', async (req, res) => {
  try {
    const perfilId = req.params.id;
    const perfil = await Perfil.findById(perfilId).lean();

    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    const utilizadorId = perfil.id_utilizador;
    const utilizador = await Utilizador.findById(utilizadorId).lean();

    if (!utilizador) {
      throw new Error('Utilizador não encontrado');
    }

    res.render('perfilUtilizador', { perfil, utilizador });
  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Ocorreu um erro ao renderizar o perfil do utilizador' });
  }
});

// Rota para o upload da imagem de perfil
app.post("/api/perfilUtilizador/:id/uploadProfilePicture", upload.single('mypic'), async (req, res, next) => {
  try {
    const perfilId = req.params.id;
    const fileName = req.file.filename;

    // Atualizar o perfil com o nome do arquivo da imagem
    await Perfil.findByIdAndUpdate(perfilId, { imagem: fileName });

    res.redirect(`/api/perfilUtilizador/${perfilId}`);
  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Ocorreu um erro ao fazer o upload da imagem de perfil' });
  }
});

// Rota para exibir o formulário de criação de consumo
app.get('/api/criarConsumo', consumoController.renderCriarConsumo);

// Rota para exibir o formulário de criação de utilizador
app.get('/api/criarutilizador', (req, res) => {
  res.render('criarUtilizador');
});

// Rota para exibir a tabela de classificação
app.get('/api/classificacao', classificacaoController.renderClassificacao);

// Rota para exibir as recompensas
app.get('/api/recompensas', recompensasController.renderRecompensas);

// Servidor à escuta na porta 5000
const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log('Servidor em execução na porta: ' + port);
});
