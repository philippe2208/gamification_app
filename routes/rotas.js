const express = require('express');
const router = express.Router();

// Importar controladores
const utilizadorController = require('../controllers/utilizadorController');
const consumoController = require('../controllers/consumoController');
const classificacaoController = require('../controllers/classificacaoController');
const recompensasController = require('../controllers/recompensasController');
const perfilController = require('../controllers/perfilController');


// URL do teste será: http://localhost:5000/api/teste
router.get('/teste', utilizadorController.test);

// TODO: adicionar novo utilizador
router.post('/utilizador', utilizadorController.create);

// Listar um utilizador por id (para editar)
router.get('/edit/:id', utilizadorController.edit);

// Listar todos os utilizadores da BD
router.get('/listAll', utilizadorController.listAllUtilizadores);

// Atualizar utilizador
router.post('/update/:id', utilizadorController.update);

// Apagar utilizador
router.get('/delete/:id', utilizadorController.delete);

// Rota para criar um novo consumo
router.post('/criarconsumo', consumoController.create);

// Listar todos os consumos da BD
router.get('/listallconsumo', consumoController.listAllConsumos);

// Listar um consumo por ID (para editar)
router.get('/editconsumo/:id', consumoController.editConsumo);

// Atualizar consumo por ID
router.post('/updateconsumo/:id', consumoController.updateConsumo);

// Apagar consumo por ID
router.get('/deleteconsumo/:id', consumoController.deleteConsumo);

// Tabela de classificação
router.get('/classificacao', classificacaoController.renderClassificacao);

// Rota para exibir a página de descrição das recompensas
router.get('/recompensas', recompensasController.renderRecompensas);

// Rota para exibir o perfil do utilizador
router.get('/perfilUtilizador/:id', perfilController.renderPerfilUtilizador);


module.exports = router;
