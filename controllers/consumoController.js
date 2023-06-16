const Consumo = require('../models/consumoModel');
const Utilizador = require('../models/utilizadorModel');

// Renderizar a página de criação de consumo com a lista de utilizadores
exports.renderCriarConsumo = async function (req, res, next) {
  try {
    const utilizadores = await Utilizador.find({});
    res.render('criarConsumo', { utilizadores: utilizadores });
  } catch (error) {
    next(error);
  }
};

// Adicionar novo consumo associado a um utilizador
exports.create = async function (req, res, next) {
  try {
    // Extrair os valores do req.body
    const { nome_sensor, data_inicio_contagem, data_fim_contagem, quantidade_consumida, utilizadorId } = req.body;

    // Verificar se o utilizador existe
    const utilizador = await Utilizador.findById(utilizadorId);
    if (!utilizador) {
      throw new Error('Utilizador não encontrado');
    }

    // Criar o objeto de consumo com o utilizador associado
    const consumo = new Consumo({
      nome_sensor,
      data_inicio_contagem,
      data_fim_contagem,
      quantidade_consumida,
      utilizadorId 
    });

    // Guardar o consumo no base de dados
    const novoConsumo = await consumo.save();

    res.redirect('/api/listallconsumo'); // atualizado para redirecionar para a página de lista de consumos
  } catch (error) {
    next(error);
  }
};

// Lista todos os consumos da BD
exports.listAllConsumos = function (req, res, next) {
  Consumo.find({})
    .populate('utilizadorId') 
    .then(function (consumos) {
      res.render('listaConsumo', { consumos: consumos });
    })
    .catch(next);
};

// Lista um consumo por id (para editar)
exports.editConsumo = function (req, res, next) {
  Consumo.findOne({ _id: req.params.id })
    .populate('utilizadorId') 
    .then(function (consumo) {
      res.render('editarConsumo', { consumo: consumo });
    })
    .catch(next);
};

// Atualiza consumo da BD com os valores do formulário
exports.updateConsumo = function (req, res, next) {
  Consumo.findByIdAndUpdate({ _id: req.params.id }, req.body)
    .then(function () {
      res.redirect('/api/listallconsumo');
    })
    .catch(next);
};

// Apaga consumo da BD, depois redireciona para '/api/listallconsumo'
exports.deleteConsumo = function (req, res, next) {
  Consumo.findOneAndDelete({ _id: req.params.id })
    .then(function (consumo) {
      console.log('Registo eliminado com sucesso!');
      res.redirect('/api/listallconsumo');
    })
    .catch(next);
};

