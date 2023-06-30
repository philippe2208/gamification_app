const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const perfilSchema = Schema(
  {
    nivel: {
      type: String,
      required: true,
    },
    id_utilizador: {
      type: Schema.Types.ObjectId,
      ref: 'Utilizador',
      required: true,
    },
    fotoPerfil: {
      type: String,
    },
  },
  {
    collection: 'Perfil',
  }
);

module.exports = mongoose.model('Perfil', perfilSchema);
