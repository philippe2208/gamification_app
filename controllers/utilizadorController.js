// importar modelo
const Utilizador = require('../models/utilizadorModel');

// exportar function 'test', chamada em '/routes/api.js'
exports.test = function (req, res) {
  res.render('criarUtilizador');
};

// adicionar novo utilizador
exports.create = function (req, res, next) {
  // inicializar variaveis com os valores do 'req.body'
  let nm = req.body.nome;
  let em = req.body.email;
  let dn = req.body.dataNascimento;

  // criar variavel baseada no modelo 'Utilizdormodel' para receber dados do formulario (request)
  let data = {
    nome: nm,
    email: em,
    dataNascimento: dn,
  };

  // cria novo 'utilizador' na BD a partir do request
  Utilizador.create(data).then(function(utilizador){
    console.log('Documento criado com sucesso!');
    res.redirect('/api/listall');
  }).catch(next);
};

// listar todos os utilizadores da BD
exports.listAllUtilizadores = function (req, res, next) {
  Utilizador.find({}).then(function(utilizador){
    res.render('listaUtilizador', {utilizadores: utilizador});
  }).catch(next);
};

// listar um utilizador por id (para editar)
exports.edit = function (req, res, next) {
  Utilizador.findOne({_id: req.params.id}).then(function(utilizador){
    res.render('editarUtilizador', {utilizador: utilizador});
  }).catch(next);
};

// atualiza 'utilizador' da BD com os valores do formulário
exports.update = function (req, res, next) {
  Utilizador.findByIdAndUpdate({_id: req.params.id},
      req.body).then(function(){
    res.redirect('/api/listall');
}).catch(next);
};

// apaga 'utilizador' da BD, depois, redirecionar para '/api/listall'
exports.delete = function (req, res, next) {
  // 'req.params.id'-> devolve-me o parametro id na req
  Utilizador.findOneAndDelete({_id: req.params.id}).then(function(utilizador){
    console.log("Registo eliminado com sucesso!");
    res.redirect('/api/listall');
  }).catch(next);
};