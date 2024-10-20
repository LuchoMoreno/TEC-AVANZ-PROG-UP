require('mongoose');

const Horse = require('../models/horseModel');


const getHorse = async (id) => {

  const horse = await Horse.findById(id);

  return horse;
}

const getAllHorses = async (limit, offset) => {

  const horses = await Horse.find({}).limit(limit).skip(offset);

  return horses;
}

const addHorse = async (name, age, sex, weight, breed) => {

  // Se utiliza object shorthand en JavaScript, ya que los nombres de las variables y las propiedades son iguales
  // const horse = new Horse({ name: name, age: age, sex: sex, weight: weight, breed: breed, wins: wins});
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