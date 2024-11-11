require('mongoose');

const Horse = require('../models/horseModel');

const { BadRequestError, NotFoundError } = require('../utils/errors');


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

    // Verifica si el caballo existe
    const horse = await Horse.findById(id);
    if (!horse) { 
        throw new NotFoundError("No existe ningun caballo registrado con ese ID.");
    }

    // Eliminar el caballo
    await Horse.findByIdAndDelete(id);

    return true;
};


const checkTotalHorses = async () => {

  const totalHorses = await Horse.countDocuments();

  return totalHorses;
}

module.exports = { getHorse, getAllHorses, addHorse, deleteHorse, checkTotalHorses }