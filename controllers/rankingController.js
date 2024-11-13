const Ranking = require('../models/rankingModel');

const {NotFoundError} = require('../utils/errors');


const getTopHorses = async () => {
    
    // Obtener los tres caballos más ganadores.
    
    throw new NotFoundError("El sistema de rankins todavía no se encuentra habilitado. Por favor, vuelve a intentarlo mas tarde.");

    //const topHorses = await Ranking.find({}).sort({ chosenCount: -1 }).limit(3)  
    //return topHorses;
  };


  module.exports = {getTopHorses}


