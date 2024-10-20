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
      
      if(result){
        res.status(201).send("Apuesta cargada correctamente."); // 201
      }
      else
      {
        res.status(404).send("Ha ocurrido un error al cargar la apuesta. Carrera o caballo invalido."); // 404
      }
      
    }catch(error){
      console.log(error);
      res.status(500).send("Error al cargar la apuesta."); //500
    }  
    
  });
  

  // Elimino una apuesta
  betsRouter.delete("/bets/:id", Middleware.verify, async(req,res) =>{
  
    try{
  
      const result = await BetController.deleteBet(req.params.id);
      if(result){
        res.status(200).send("Apuesta borrada.")
      }else{
        res.status(404).send("La apuesta no existe.")
      }  
  
    }catch(error){
      res.status(500).send("Error al borrar la apuesta.")
    }
  });
  
  
  // Get de todas las apuestas (ESTE METODO ES PÚBLICO) 
  betsRouter.get("/bets", async (req, res) => {
    let limit = parseInt(req.query.limit) || 10;
    let offset = parseInt(req.query.offset) || 0;

    try {
      const results = await BetController.getAllBets(limit, offset);
      const totalBets = await BetController.checkTotalBets(); // Obtén el conteo total de apuestas.
      
      // Enviar un objeto JSON que contiene tanto la data como el total de apuestas.
      res.status(200).json({
          result: results,
          totalCount: totalBets
      });
  } catch (error) {
      res.status(500).send("Error al obtener la lista de apuestas. Intente más tarde.");
  }
});
  

  module.exports = betsRouter;