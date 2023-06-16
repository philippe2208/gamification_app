// associar as dependências instaladas
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const consumoController = require('./controllers/consumoController');
const classificacaoController = require('./controllers/classificacaoController');
const recompensasController = require('./controllers/recompensasController');

// conexão a base de dados
mongoose.connect("mongodb://localhost:27017/gamification");
// Confirma ligação na consola
mongoose.connection.on('connected', function () {
  console.log("Conectado a base de dados " + 'gamification');
});
// Mensagem de Erro
mongoose.connection.on('error', (err) => {
  console.log("Database error " + err);
});

// Configuração da view engine
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('imagens'));



// todo o url começado por ‘/api’ chama as rotas em ‘./routes/utilizador’
const routes = require('./routes/rotas');
app.use('/api', routes);

// error handling middleware
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(422).send({ error: err.message });
});

// Rota para a homepage
app.get('/', (req, res) => {
  // Renderiza o arquivo HTML da homepage
  res.render('homePage');
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


// servidor á escuta no porto 5000
let port = 5000;
app.listen(process.env.port || port, () => {
  console.log('Servidor em execução no porto: ' + port);
});

