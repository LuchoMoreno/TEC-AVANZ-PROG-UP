const mongoose = require('mongoose');
const betController = require('../controllers/betController');
const Bet = require('../models/betModel');
const Horse = require('../models/horseModel');
const Race = require('../models/raceModel');
const User = require('../models/userModel');

const { BadRequestError, NotFoundError, NotAcceptableError } = require('../utils/errors');

// Mock de los modelos de Mongoose
jest.mock('../models/betModel');
jest.mock('../models/horseModel');
jest.mock('../models/raceModel');
jest.mock('../models/userModel');

describe('Bet Controller', () => {
  beforeAll(() => {
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true); // Simula ObjectId válido
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  
  describe('addBet', () => {
    test('Debería agregar una apuesta correctamente', async () => {
      // Mock de usuario, caballo y carrera
      const userMock = { _id: 'userId', money: 500, save: jest.fn() };
      const horseMock = { _id: 'horseId' };
      const raceMock = { _id: 'raceId', status: 'Programada' };
      
      User.findById = jest.fn().mockResolvedValue(userMock);
      Horse.findById = jest.fn().mockResolvedValue(horseMock);
      Race.findById = jest.fn().mockResolvedValue(raceMock);
      Bet.find = jest.fn().mockResolvedValue([]); // No hay apuestas previas en el caballo
      Bet.prototype.save = jest.fn().mockResolvedValue({
        user: 'userId',
        race: 'raceId',
        horse: 'horseId',
        amount: 100,
        payout: 200
      });

      // Ejecuta la función
      const result = await betController.addBet('userId', 'raceId', 'horseId', 100);

      expect(result.savedBet).toHaveProperty('amount', 100);
      expect(result.savedBet).toHaveProperty('payout', 200);
      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(userMock.save).toHaveBeenCalled(); // Confirma que se guardó el usuario actualizado
    });

    test('Debería lanzar NotAcceptableError para IDs inválidos', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false); // IDs inválidos

      await expect(betController.addBet('userId', 'invalidRaceId', 'invalidHorseId', 100))
        .rejects.toThrow(NotAcceptableError);
    });
  });

  describe('getBet', () => {
    test('Debería retornar una apuesta por su ID', async () => {
      Bet.findById = jest.fn().mockResolvedValue({ _id: 'betId', amount: 100 });
      
      const bet = await betController.getBet('betId');
      
      expect(bet).toHaveProperty('amount', 100);
      expect(Bet.findById).toHaveBeenCalledWith('betId');
    });
  });

  

});