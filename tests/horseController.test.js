const mongoose = require('mongoose');
const horseController = require('../controllers/horseController');
const Horse = require('../models/horseModel');

const { BadRequestError, NotFoundError, NotAcceptableError } = require('../utils/errors');

// Mock de los modelos de Mongoose
jest.mock('../models/horseModel');

describe('Horse Controller', () => {
  beforeAll(() => {
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true); // Simula ObjectId válido
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });


  // Metodo para abtener solo un caballo. Buscamos el mock de thunder y deberia retornarnos el mismo.
  describe('getHorse', () => {
    test('Debería retornar un caballo por su ID', async () => {
      const horseMock = { _id: 'horseId', name: 'Thunder', age: 5 };
      Horse.findById = jest.fn().mockResolvedValue(horseMock);

      const horse = await horseController.getHorse('horseId');

      expect(horse).toHaveProperty('name', 'Thunder');
      expect(Horse.findById).toHaveBeenCalledWith('horseId');
    });

  });

  
  // Metodo para obtener toda la lista de caballos.
  describe('getAllHorses', () => {
    test('Debería retornar una lista de caballos con límite y offset', async () => {
      const horsesMock = [
        { _id: 'horseId1', name: 'Thunder' },
        { _id: 'horseId2', name: 'Lightning' }
      ];
      Horse.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockResolvedValue(horsesMock)
      });

      const horses = await horseController.getAllHorses(2, 0);

      expect(horses).toHaveLength(2);
      expect(Horse.find).toHaveBeenCalledWith({});
    });
  });


  // Metodo para agregar un caballo y si ya existe, lanzar un Bad Request Error
  describe('addHorse', () => {
    test('Debería lanzar BadRequestError si el caballo ya existe', async () => {
      Horse.findOne = jest.fn().mockResolvedValue({ name: 'Thunder' });

      await expect(horseController.addHorse('Thunder', 5, 'Male', 450, 'Arabian'))
        .rejects.toThrow(BadRequestError);
    });
  });


  // Metodo para chequear que un caballo se pueda eliminar correctamente / o si pasamos un ID invalido.
  describe('deleteHorse', () => {
    test('Debería eliminar un caballo correctamente', async () => {
      const horseMock = { _id: 'horseId', name: 'Thunder' };
      Horse.findById = jest.fn().mockResolvedValue(horseMock);
      Horse.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const result = await horseController.deleteHorse('horseId');

      expect(result).toBe(true);
      expect(Horse.findById).toHaveBeenCalledWith('horseId');
      expect(Horse.findByIdAndDelete).toHaveBeenCalledWith('horseId');
    });

    test('Debería lanzar NotAcceptableError para ID inválido', async () => {
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false); // IDs inválidos

      await expect(horseController.deleteHorse('invalidHorseId')).rejects.toThrow(NotAcceptableError);
    });
  });

  // Metodo para chequear que el numero total de caballos retornados sea valido.
  describe('checkTotalHorses', () => {
    test('Debería retornar el número total de caballos', async () => {
      Horse.countDocuments = jest.fn().mockResolvedValue(5);

      const totalHorses = await horseController.checkTotalHorses();

      expect(totalHorses).toBe(5);
      expect(Horse.countDocuments).toHaveBeenCalled();
    });
  });
});