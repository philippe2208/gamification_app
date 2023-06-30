const Perfil = require('../models/perfilModel');
const Utilizador = require('../models/utilizadorModel');

exports.renderPerfilUtilizador = async (req, res) => {
  try {
    const perfilId = req.params.id;
    const perfil = await Perfil.findById(perfilId).lean();

    if (!perfil) {
      throw new Error('Perfil não encontrado');
    }

    const utilizadorId = perfil.id_utilizador;
    const utilizador = await Utilizador.findById(utilizadorId).lean();

    if (!utilizador) {
      throw new Error('Utilizador não encontrado');
    }

    perfil.fotoPerfil = utilizador.fotoPerfil; // Adiciona a foto de perfil ao objeto perfil

    res.render('perfilUtilizador', { perfil, utilizador });
  } catch (error) {
    console.error(error);
    res.render('error', { error: 'Ocorreu um erro ao renderizar o perfil do utilizador' });
  }
};
