require('mongoose');

const Race = require('../models/raceModel');
const Horse = require('../models/horseModel');

const { BadRequestError, UnauthorizedError } = require('../utils/errors');



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
  try {

    // Buscar la carrera por su ID
    const race = await Race.findById(id);

    if (!race) {
      return false; // Si la carrera no existe, retornar false
    }

    // Eliminar la carrera
    await Race.findByIdAndDelete(id);

    return true;

  } catch (error) {
    console.error("Error al eliminar la carrera:", error);
    
    return false;
  }
};


const checkTotalRaces = async () => {

  const totalRaces = await Race.countDocuments();

  return totalRaces;
}

module.exports = { getRace, getAllRaces, addRace, deleteRace, checkTotalRaces }