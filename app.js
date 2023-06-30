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

// Definição do armazenamento do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  }
});

const maxSize = 1 * 1000 * 1000;

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
}).single("mypic");

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

// Rota para o upload da imagem de perfil
app.post("/api/perfilUtilizador/:id/uploadProfilePicture", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.send(err);
    } else {
      // Obtém o nome do arquivo enviado
      const fileName = req.file.filename;

      // Obtém o ID do perfil a partir dos parâmetros da rota
      const perfilId = req.params.id;

      // Redireciona para a página de perfil do utilizador
      res.redirect(`/api/perfilUtilizador/${perfilId}`);
    }
  });
});


// Servidor à escuta na porta 5000
const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log('Servidor em execução na porta: ' + port);
});
