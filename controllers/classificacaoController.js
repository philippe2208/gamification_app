const Consumo = require('../models/consumoModel');
const Utilizador = require('../models/utilizadorModel');
const Classificacao = require('../models/classificacaoModel');

exports.renderClassificacao = async function (req, res, next) {
  try {
    // Procura os dados dos consumos e utilizadores
    const consumos = await Consumo.find({});
    const utilizadores = await Utilizador.find({});

    // Cria um objeto para armazenar as somas das quantidades de energia e água por utilizador
    const somas = {};

    // Itera sobre os consumos para somar as quantidades de energia e água por utilizador
    consumos.forEach(consumo => {
      const utilizadorId = consumo.utilizadorId.toString();
      if (!somas[utilizadorId]) {
        somas[utilizadorId] = {
          utilizadorId,
          somaEnergia: 0,
          somaAgua: 0,
        };
      }

      if (consumo.nome_sensor == 'Medidor de energia eletrónico') {
        somas[utilizadorId].somaEnergia += consumo.quantidade_consumida;
      } else if (consumo.nome_sensor == 'Contador de água') {
        somas[utilizadorId].somaAgua += consumo.quantidade_consumida;
      }
    });

    // Converte o objeto de somas num array
    const somasArray = Object.values(somas);

    // Ordena o array com base no valor total (soma das quantidades de energia e água)
    somasArray.sort((a, b) => {
      const totalA = a.somaEnergia + a.somaAgua;
      const totalB = b.somaEnergia + b.somaAgua;

      return totalA - totalB;
    });

    // Limpa a tabela de classificação existente
    await Classificacao.deleteMany({});

    // Atualiza os dados na tabela de classificação com base na ordem do array de somas
    for (let i = 0; i < somasArray.length; i++) {
      const soma = somasArray[i];
      const utilizador = utilizadores.find(u => u._id.toString() === soma.utilizadorId);
      if (utilizador) {
        const posicao = i + 1;
        await Classificacao.create({
          nome_utilizador: utilizador.nome,
          quantidade_consumida: soma.somaEnergia + soma.somaAgua,
          posicao
        });
      }
    }

    // Procura os dados atualizados da tabela de classificação
    const tabelaClassificacao = await Classificacao.find({}).sort('posicao');

    // Direciona para a página da tabela de classificação
    res.render('classificacao', { tabelaClassificacao });
  } catch (error) {
    next(error);
  }
};
