const authRouter = require('express').Router();

//( CONTROLLERS )
const AuthController = require('../controllers/authController');


authRouter.post("/login", async (req,res) => {

    const email = req.body.email;
    const password = req.body.password;
    try{
      const result = await AuthController.login(email,password);
      if(result){
        res.status(200).json(result);
      }else{
        res.status(401).send("Credenciales invalidas")
      }
    }catch(error){
        res.status(500).send("Error");
    }  
})



module.exports = authRouter;