const mongoose = require('mongoose');

const Race = require('../models/raceModel');
const Horse = require('../models/horseModel');
const Bet = require('../models/betModel');

const { BadRequestError, NotFoundError, NotAcceptableError } = require('../utils/errors');



const getRace = async (id) => {

  const race = await Race.findById(id);

  return race;
}

const getAllRaces = async (limit, offset) => {

  const races = await Race.find({}).limit(limit).skip(offset);

  return races;
}

const addRace = async (name, location, startDate, distance, prize, horses) => {

  // Validar que la fecha de inicio sea en el futuro
  if (startDate <= new Date()) {
    throw new BadRequestError("La fecha de inicio debe ser en el futuro.");
  }

  // Validar que la fecha de inicio sea en el futuro
  if (!Array.isArray(horses) || horses.length == 0) {
      throw new BadRequestError("El campo de caballos está vacío.");
  }

  // Validar que todos los IDs de caballos sean válidos
  const horseExistsPromises = horses.map(horseId => Horse.exists({ _id: horseId }));
  const results = await Promise.all(horseExistsPromises);
  const invalidHorseIndex = results.findIndex(exists => !exists);
  if (invalidHorseIndex !== -1) {
      throw new BadRequestError(`El ID de caballo en la posición ${invalidHorseIndex + 1} no es válido.`);
  }
  

  // Se utiliza object shorthand en JavaScript, ya que los nombres de las variables y las propiedades son iguales
  const race = new Race({name, location, startDate, distance, prize, horses});

  let savedRace = await race.save();

  return { savedRace };
}


const deleteRace = async (id) => {

    // Verifica si la id de la carrera es valida
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotAcceptableError("El ID de la carrera proporcionada no es válido.");
    }

    // Verifica si la carrera existe
    const race = await Race.findById(id);
    if (!race) { 
        throw new NotFoundError("No existe ninguna carrera registrada con ese ID.");
    }

    // Eliminar la carrera
    await Race.findByIdAndDelete(id);

    return true;

};


const checkTotalRaces = async () => {

  const totalRaces = await Race.countDocuments();

  return totalRaces;
}


const getRaceHorsePayouts = async (raceId) => {
  // Verifica que la carrera exista
  const race = await Race.findById(raceId);
  if (!race) {
      const error = new Error("Carrera no encontrada.");
      error.statusCode = 404;
      throw error;
  }

  // Encuentra todas las apuestas relacionadas con esta carrera
  const bets = await Bet.find({ race: raceId }).populate('horse', 'name');

  // Agrupa las apuestas por caballo y calcula el payout
  const horsePayouts = {};
  bets.forEach(bet => {
      const horseId = bet.horse._id;
      if (!horsePayouts[horseId]) {
          horsePayouts[horseId] = {
              name: bet.horse.name,
              betCount: 0,
              basePayout: bet.amount, // toma el amount original
          };
      }
      horsePayouts[horseId].betCount += 1;
  });

  // Calcula el payout ajustado en función de la cantidad de apuestas
  return Object.values(horsePayouts).map(horse => ({
      horse: horse.name,
      payout: horse.basePayout * (2 / (1 + horse.betCount)) // Fórmula de ejemplo
  }));
};

module.exports = { getRace, getAllRaces, addRace, deleteRace, checkTotalRaces, getRaceHorsePayouts }