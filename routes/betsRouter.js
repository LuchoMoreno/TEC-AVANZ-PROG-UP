const betsRouter = require('express').Router();

//( CONTROLLERS )
const BetController = require('../controllers/betController');
const Middleware = require('../middleware/auth-middleware');


// Creo una nueva apuesta
betsRouter.post("/bets", Middleware.verify, async (req,res) =>{
  
    let user = req.token.userId;
    let race = req.body.race;
    let horse = req.body.horse;
    let amount = req.body.amount;

    try{

      const result = await BetController.addBet(user,race,horse,amount);
      console.log(result);
      res.status(201).send(`Carrera cargada correctamente. Los posibles ingresos de la apuesta seran: ${result.savedBet.payout}`); // 201
      
    }catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).send(error.message);
  } 
  
  });
  

  // Elimino una apuesta
  betsRouter.delete("/bets/:id", Middleware.verify, async(req,res) =>{

    let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido. Solo los administradores pueden eliminar apuestas."); // 401 Unauthorized
    }
  
    try{

      const result = await BetController.deleteBet(req.params.id);
      res.status(200).send("Apuesta borrada con éxito.")
      
    }catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).send(error.message);
  } 

  });
  
  
  // Get de todas las apuestas (ESTE METODO ES PÚBLICO) 
  betsRouter.get("/bets", Middleware.verify, async (req, res) => {

    let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Forbidden
    }

    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    try {
      const results = await BetController.getAllBets(limit, offset);
      const totalBets = await BetController.checkTotalBets(); // Obtiene el conteo total de apuestas.
      
      // Enviar un objeto JSON que contiene tanto la data como el total de apuestas.
      res.status(200).json({
          result: results,
          totalCount: totalBets
      });
  } catch (error) {
      res.status(500).send("Error al obtener la lista de apuestas. Intente más tarde.");
  }
});


  // Get de todas las apuestas (ESTE METODO ES PÚBLICO) 
  betsRouter.get("/bets/me", Middleware.verify, async (req, res) => {

    let userId = req.token.userId;

    try {
      // Obtiene las apuestas del usuario con paginación
      const results = await BetController.getUserBets(userId);
      res.status(200).json(results);

    }catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).send(error.message);
  } 

  });

  module.exports = betsRouter;