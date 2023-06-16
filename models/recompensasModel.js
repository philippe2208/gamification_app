const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recompensasSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  descrição: {
    type: String,
    required: true
  },
  
critério_atribuição: {
    type: String,
    required: true
  },
}, {
  collection: 'Descrição_recompensa'
});

module.exports = mongoose.model('Descrição_recompensa', recompensasSchema);