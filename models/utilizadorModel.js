const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Utilizador Schema
const UtilizadorSchema = new Schema({
  nome: {
  type: String,
  required: [true, '*Campo obrigatório!']
  },
  email: {
  type: String,
  required: [true, '*Campo obrigatório!']
  },
  dataNascimento: {
  type: Date,
  required: [true, '*Campo obrigatório!']
  }

}, {
  collection: 'Utilizador'
});
const Utilizador = mongoose.model('Utilizador', UtilizadorSchema);

// exportar Modelo_Utilizador
module.exports = Utilizador;