const racesRouter = require('express').Router();

//( CONTROLLERS )
const RaceController = require('../controllers/raceController');
const Middleware = require('../middleware/auth-middleware');


// Creo una nueva carrera
racesRouter.post("/races", Middleware.verify, async (req,res) =>{

    let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Unauthorized
    }
    
    let name = req.body.name;
    let location = req.body.location;
    let startDate = req.body.startDate;
    let distance = req.body.distance;
    let prize = req.body.prize;
    let horses = req.body.horses;

    try{

      const result = await RaceController.addRace(name, location, startDate, distance, prize, horses);
      res.status(201).send(`Carrera creada correctamente. La misma tendrá inicio el día: ${startDate}`); // 201 Created

    }catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).send(error.message);
  } 
    
  });
  

  // Elimino una carrera
  racesRouter.delete("/races/:id", Middleware.verify, async(req,res) =>{

    let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Unauthorized
    }
  
    try{
  
      const result = await RaceController.deleteRace(req.params.id);
      res.status(200).send("Carrera borrada con éxito.")
  
    }catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).send(error.message);
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


  // Endpoint para obtener los caballos y payout de una carrera específica
  racesRouter.get("/races/:id/horses", async (req, res) => {
    const raceId = req.params.id;

    try {
        const horsePayouts = await RaceController.getRaceHorsePayouts(raceId);
        res.status(200).json(horsePayouts);
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
  });


  // Endpoint para iniciar una carrera
  racesRouter.post("/races/start/:id", Middleware.verify, async (req, res) => {

    const userRole = req.token.roles;
    const raceId = req.params.id;

    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido. Solo los administradores pueden iniciar una carrera."); // 401 Unauthorized
    }

    try {
        const horsePayouts = await RaceController.startRace(raceId);
        res.status(200).json(horsePayouts);
        
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    }
  });
  

  module.exports = racesRouter;