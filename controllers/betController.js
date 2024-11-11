const mongoose = require('mongoose');

const Bet = require('../models/betModel');
const Horse = require('../models/horseModel');
const Race = require('../models/raceModel');


const getBet = async (id) => {

  const bet = await Bet.findById(id);

  return bet;
}

const getAllBets = async (limit, offset) => {

  const bets = await Bet.find({}).limit(limit).skip(offset);

  return bets;
}

const addBet = async (user, race, horse, amount) => {

  // Buscar la apuesta por su ID
  const horseParam = await Horse.findById(id);
  const raceParam = await Race.findById(id);

  if (!horseParam || !raceParam) {
      return false; // Si el caballo o la carrera no existe retorno false.
  }

  // El payout se ejecuta en base a las posibilidades.
  let payout = amount * 2;

  // Se utiliza object shorthand en JavaScript, ya que los nombres de las variables y las propiedades son iguales
  const bet = new Bet({user, race, horse, amount, payout});

  let savedBet = await bet.save();

  return { savedBet };
}


const deleteBet = async (id) => {
  try {

    // Buscar la apuesta por su ID
    const bet = await Bet.findById(id);

    if (!bet) {
      return false; // Si la apuesta no existe, retornar false
    }

    // Eliminar la apuesta
    await Bet.findByIdAndDelete(id);

    return true;

  } catch (error) {
    console.error("Error al eliminar la apuesta:", error);
    
    return false;
  }
};


const checkTotalBets = async () => {

  const totalBets = await Bet.countDocuments();

  return totalBets;
}

module.exports = { getBet, getAllBets, addBet, deleteBet, checkTotalBets }