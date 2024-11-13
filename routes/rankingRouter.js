const rankingRouter = require('express').Router();

//( CONTROLLERS )
const RankingController = require('../controllers/rankingController.js');
  
  // Get de 3 caballos en el top.
  rankingRouter.get("/ranking", async (req,res) =>{
   
    try{
        const topHorses = await RankingController.getTopHorses();
        res.status(200).json(topHorses);

    }catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).send(error.message);
    } 
    
});
  
module.exports = rankingRouter;