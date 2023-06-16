const Recompensas = require('../models/recompensasModel');

exports.renderRecompensas = async function (req, res, next) {
  try {
    // procurar as recompensas na base de dados
    const recompensas = await Recompensas.find({});

    // Renderizar a página de descrição das recompensas
    res.render('recompensas', { recompensas });
  } catch (error) {
    next(error);
  }
};
