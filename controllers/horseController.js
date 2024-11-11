require('mongoose');

const Horse = require('../models/horseModel');

const { BadRequestError } = require('../utils/errors');


const getHorse = async (id) => {

  const horse = await Horse.findById(id);

  return horse;
}

const getAllHorses = async (limit, offset) => {

  const horses = await Horse.find({}).limit(limit).skip(offset);

  return horses;
}

const addHorse = async (name, age, sex, weight, breed) => {

  // Verificar si ya existe un caballo con el mismo nombre
  const existingHorse = await Horse.findOne({ name });
  if (existingHorse) { 
      throw new BadRequestError("Ya existe un caballo con ese nombre.");
  }

  const horse = new Horse({name, age, sex, weight, breed});

  let savedHorse = await horse.save();

  return { savedHorse };
}


const deleteHorse = async (id) => {
  try {

    // Buscar el caballo por su ID
    const horse = await Horse.findById(id);

    if (!horse) {
      return false; // Si el caballo no existe, retornar false
    }

    // Eliminar el caballo
    await Horse.findByIdAndDelete(id);

    return true;

  } catch (error) {
    console.error("Error al eliminar el caballo:", error);
    
    return false;
  }
};


const checkTotalHorses = async () => {

  const totalHorses = await Horse.countDocuments();

  return totalHorses;
}

module.exports = { getHorse, getAllHorses, addHorse, deleteHorse, checkTotalHorses }