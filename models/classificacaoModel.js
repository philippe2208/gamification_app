const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classificacaoSchema = new Schema({
  nome_utilizador: { 
    type: String, 
    required: true 
  },
  quantidade_consumida: {
    type: Number, 
    required: true 
  },
  posicao: {
    type: Number, 
    required: true
  } 
}, {
    collection: 'Classificação'
  });

const Classificacao = mongoose.model('Classificação', classificacaoSchema);

module.exports = Classificacao;
