require('mongoose');

const Race = require('../models/raceModel');


const getRace = async (id) => {

  const race = await Race.findById(id);

  return race;
}

const getAllRaces = async (limit, offset) => {

  const races = await Race.find({}).limit(limit).skip(offset);

  return races;
}

const addRace = async (name, location, startDate, distance, prize, horses) => {

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