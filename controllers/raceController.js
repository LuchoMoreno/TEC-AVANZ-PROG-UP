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

  // El campo de caballos está vacío.
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

  const race = await Race.findById(raceId).populate('horses', 'name');

  // Verifica si el id de la carrera es valido
  if (!mongoose.Types.ObjectId.isValid(raceId)) {
      throw new NotAcceptableError("El ID de la carrera proporcionada no es válido.");
  }

  // Verifica que la carrera exista
  if (!race) {
      throw new NotFoundError("No existe ninguna carrera registrada con ese ID.");
  }

  // Validar que la carrera esté en estado "Programada"
  if (race.status !== "Programada") {
      throw new BadRequestError(`Solo se pueden revisar pagos en carreras programadas. Esta carrera se encuentra ${race.status}`); // Si no está programada, lanzo excepción.
  }

  // Encuentra todas las apuestas de esta carrera y agrupa por caballo
  const bets = await Bet.find({ race: raceId });
  const betsByHorse = bets.reduce((acc, bet) => {
      if (!acc[bet.horse]) acc[bet.horse] = [];
      acc[bet.horse].push(bet);
      return acc;
  }, {});

  // Calcula el payout de cada caballo
  const horsePayouts = race.horses.map(horse => {
      const betCount = betsByHorse[horse._id]?.length || 0;
      const basePayout = 100; // Asigna un valor base para el cálculo de payout
      const payout = (basePayout * (2 / (1 + betCount))).toFixed(2); // Ajuste de payout y se redondea a 2 decimales
      const payoutPercentage = `${payout}%`; // Convierte el valor a porcentaje

      return {
          horse: horse.name,
          payoutPercentage,
          betCount,
      };
  });

  return horsePayouts;
};



const startRace = async (raceId) => {

    const race = await Race.findById(raceId);
    const currentDate = new Date();


    // Paso 1 . Verificaciones:

    // Verifica si el id de la carrera es valido
    if (!mongoose.Types.ObjectId.isValid(raceId)) {
      throw new NotAcceptableError("El ID de la carrera proporcionada no es válido.");
    }

    // Verifica que la carrera exista
    if (!race) {
      throw new NotFoundError("No existe ninguna carrera registrada con ese ID.");
    }

    // Validar que la carrera esté en estado "Programada"
    if (race.status !== "Programada") {
      throw new BadRequestError(`Solo se pueden iniciar carreras programadas. Esta carrera se encuentra ${race.status}`); // Si no está programada, lanzo excepción.
    }

    // Validar que la fecha actual sea posterior a la fecha de inicio (startDate) de la carrera
    if (currentDate <= race.startDate) {
      throw new BadRequestError(`La carrera no puede ser iniciada antes de su fecha de inicio programada. Su fecha de inicio es: ${race.startDate}`);
    }

    // Paso 2. Seleccionar un caballo ganador aleatoriamente
    const winnerHorse = race.horses[Math.floor(Math.random() * race.horses.length)];
    race.winner = winnerHorse;
    race.status = 'Finalizada';
    await race.save();

    // Paso 3. Obtener todas las apuestas relacionadas con esta carrera
    const bets = await Bet.find({ race: raceId });

    // Paso 4. Inicializar un objeto para almacenar los pagos a los usuarios
    const payouts = {};

    // Paso 5. Recorrer las apuestas y actualizar el estado de cada una
    for (let bet of bets) {
      if (String(bet.horse) === String(winnerHorse)) {
        // Marcar la apuesta como ganada
        bet.status = 'Ganada';

        // Calcular el pago y actualizar la cuenta del usuario
        const payoutAmount = bet.amount * bet.payout;
        
        // Sumar el pago al usuario
        payouts[bet.user] = (payouts[bet.user] || 0) + payoutAmount;

      } else {
        // Marcar la apuesta como perdida
        bet.status = 'Perdida';
      }
      await bet.save();
    }

    // Paso 6. Realizar los pagos a los usuarios ganadores
    for (let userId in payouts) {
      await User.findByIdAndUpdate(userId, {
        $inc: { balance: payouts[userId] } // Incrementa el balance del usuario
      });
    }

    // 7. Retornar los resultados
    return {
      raceId: raceId,
      winnerHorse: winnerHorse,
      payouts: payouts,
      message: 'Carrera finalizada. Todas las apuestas fueron procesadas.'
    };

};

module.exports = { getRace, getAllRaces, addRace, deleteRace, checkTotalRaces, getRaceHorsePayouts, startRace }