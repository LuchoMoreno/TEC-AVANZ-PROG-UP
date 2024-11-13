const mongoose = require('mongoose');

const Bet = require('../models/betModel');
const Horse = require('../models/horseModel');
const Race = require('../models/raceModel');

const { BadRequestError, NotFoundError, NotAcceptableError } = require('../utils/errors');


const getBet = async (id) => {

  const bet = await Bet.findById(id);

  return bet;
}

const getAllBets = async (limit, offset) => {

  const bets = await Bet.find({}).limit(limit).skip(offset);

  return bets;
}

const addBet = async (user, race, horse, amount) => {

  if (!mongoose.Types.ObjectId.isValid(horse) || !mongoose.Types.ObjectId.isValid(race))
  {
    throw new NotAcceptableError("Alguno de los IDS brindados son inválidos.");
  }

  // Buscar la apuesta por su ID
  const horseParam = await Horse.findById(horse);
  const raceParam = await Race.findById(race);

  if (!horseParam) {
    throw new NotFoundError("Caballo no encontrado"); // Si el caballo no existe lanzo excepcion.
  }

  if (!raceParam) {
    throw new NotFoundError("Carrera no encontrada"); // Si la carrera no existe lanzo excepcion.
  }

  // Validar que la carrera esté en estado "Programada"
  if (raceParam.status !== "Programada") {
    throw new BadRequestError(`Solo se pueden realizar apuestas en carreras programadas. Esta carrera se encuentra ${raceParam.status}`); // Si no está programada, lanzo excepción.
  }

  // Calcula el número de apuestas existentes para el mismo caballo en la misma carrera
  const existingBets = await Bet.find({ race: race, horse: horse });
  const betCount = existingBets.length;

  // Calcula payout: cuanto mayor sea el número de apuestas en este caballo, menor es el payout
  // Fórmula de ejemplo: payout = amount * (2 / (1 + betCount))
  const payout = amount * (2 / (1 + betCount));

  // Se utiliza object shorthand en JavaScript, ya que los nombres de las variables y las propiedades son iguales
  const bet = new Bet({user, race, horse, amount, payout});

  let savedBet = await bet.save();

  return { savedBet };
}


const deleteBet = async (id) => {
  
    // Verifica si el id de la apuesta es valida
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new NotAcceptableError("El ID de la apuesta proporcionada no es válida.");
    }
    
    // Verifica si la apuesta existe
    const bet = await Bet.findById(id);
    if (!bet) { 
        throw new NotFoundError("No existe ninguna apuesta registrada con ese ID.");
    }

    // Eliminar la apuesta
    await Bet.findByIdAndDelete(id);

    return true;

};

const deleteAllBets = async () => {
  
  await Bet.deleteMany({}); // Elimina todas las apuestas de la colección

  return true;

};

const checkTotalBets = async () => {

  const totalBets = await Bet.countDocuments();

  return totalBets;
}

// Obtiene las apuestas del usuario con solo los detalles de la carrera

// * DATO IMPORTANTE *//
// populate con select: Al usar .populate({ path: "race", select: "..." }), se especifica 
// solo los campos necesarios dentro del objeto race, evitando campos adicionales como createdAt, updatedAt, etc.

// Exclusión del campo horse: La línea .select("-horse") 
// asegura que el campo horse de cada apuesta no sea parte de los resultados principales.

const getUserBets = async (userId) => {
  return await Bet.find({ user: userId })
    .populate({
      path: "race",
      select: "name location startDate distance prize winner status horses", // Selecciona solo estos campos dentro de race
    })
    .select("race amount payout status betDate") // Incluye solo los campos deseados de bet
    .exec();
};

module.exports = { getBet, getAllBets, addBet, deleteBet, deleteAllBets, checkTotalBets, getUserBets}