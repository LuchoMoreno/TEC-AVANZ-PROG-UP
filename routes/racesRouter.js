const racesRouter = require('express').Router();

//( CONTROLLERS )
const RaceController = require('../controllers/raceController');
const Middleware = require('../middleware/auth-middleware');


// Creo una nueva carrera
racesRouter.post("/races", Middleware.verify, async (req,res) =>{
  
    let name = req.body.name;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let distance = req.body.distance;
    let horses = req.body.horses;

    try{

      const result = await RaceController.addRace(name, location, startDate, distance, horses);
      
      if(result){
        res.status(201).send("Carrera creada correctamente. La misma tendrá inicio el día: " + startDate); // 201
      }
      else
      {
        res.status(404).send("Ha ocurrido un error al crear la carrera. Carrera duplicada."); // 404
      }
      
    }catch(error){
      console.log(error);
      res.status(500).send("Error al crear la carrera"); //500
    }  
    
  });
  

  // Elimino una carrera
  racesRouter.delete("/races/:id", Middleware.verify, async(req,res) =>{
  
    try{
  
      const result = await RaceController.deleteRace(req.params.id);
      if(result){
        res.status(200).send("Carrera borrada")
      }else{
        res.status(404).send("La carrera no existe.")
      }  
  
    }catch(error){
      res.status(500).send("Error al borrar la carrera.")
    }
  });
  
  
  // Get de todas las carreras (ESTE METODO ES PÚBLICO) 
  racesRouter.get("/races", async (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    try {
      const results = await RaceController.getAllRaces(limit, offset);
      const totalRaces = await RaceController.checkTotalRaces(); // Obtén el conteo total de carreras.
      
      // Enviar un objeto JSON que contiene tanto la data como el total de carreras.
      res.status(200).json({
          result: results,
          totalCount: totalRaces
      });
  } catch (error) {
      res.status(500).send("Error al obtener la lista de carreras. Intente más tarde.");
  }
});
  

  module.exports = racesRouter;