const horsesRouter = require('express').Router();

//( CONTROLLERS )
const HorseController = require('../controllers/horseController');
const Middleware = require('../middleware/auth-middleware');


// Creo un nuevo caballo
horsesRouter.post("/horses", Middleware.verify, async (req,res) =>{
    
    let name = req.body.name;
    let age = req.body.age;
    let sex = req.body.sex;
    let weight = req.body.weight;
    let breed = req.body.breed;
    let wins = req.body.wins;

    try{
      const result = await HorseController.addHorse(name,age,sex,weight,breed,wins);
      
      if(result){
        res.status(201).send("Caballo agregado correctamente"); // 201
      }
      else
      {
        res.status(404).send("Ha ocurrido un error al agregar el caballo"); // 404
      }
      
    }catch(error){
      console.log(error);
      res.status(500).send("Error al agregar el caballo"); //500
    }  
    
  });
  

  // Elimino un caballo
  horsesRouter.delete("/horses/:id", Middleware.verify, async(req,res) =>{
  
    try{

      const result = await HorseController.deleteHorse(req.params.id);

      if(result){
        res.status(200).send("Caballo eliminado de la base de datos.")
      }else{
        res.status(404).send("El caballo no existe.")
      }  
  
    }catch(error){
      res.status(500).send("Error")
    }
  });
  
  
  // Get de todos los caballos (ESTE METODO ES PÚBLICO) 
  horsesRouter.get("/horses", async (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    try {
      const results = await HorseController.getAllHorses(limit, offset);
      const totalHorses = await HorseController.checkTotalHorses(); // Obtén el conteo total de caballos
      
      // Enviar un objeto JSON que contiene tanto la data como el total de caballos
      res.status(200).json({
          result: results,
          totalCount: totalHorses
      });
  } catch (error) {
      res.status(500).send("Error. Intente más tarde.");
  }
});
  

  module.exports = horsesRouter;