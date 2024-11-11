const Ranking = require('../models/rankingModel');

const getTopHorses = async () => {
    
  // Obtener los tres caballos más ganadores.
    
    const topHorses = await Ranking.find({}).sort({ chosenCount: -1 }).limit(3)  
    
    return topHorses;
  };


  module.exports = {getTopHorses}


