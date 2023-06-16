const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consumoSchema = new Schema({
  nome_sensor: {
    type: String,
    required: true
  },
  data_inicio_contagem: {
    type: Date,
    required: true
  },
  data_fim_contagem: {
    type: Date,
    required: true
  },
  quantidade_consumida: {
    type: Number,
    required: true
  },
  utilizadorId: {
    type: Schema.Types.ObjectId,
    ref: 'Utilizador'
  }
}, {
  collection: 'Dados_consumo'
});

module.exports = mongoose.model('Dados_consumo', consumoSchema);
