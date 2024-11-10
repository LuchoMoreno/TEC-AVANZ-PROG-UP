const jwt = require('jsonwebtoken');

const {SECRET} = require('../utils/config');

const verify = (req,res,next) =>{

    try {
        // Le hago un split porque viene en formato BEARER + {TOKEN}
        const token = req.headers.authorization.split(' ')[1];

        req.token =  jwt.verify(token, SECRET);

        next();

    }catch(error){
        res.status(401).send("El token es invalido. No autorizado.");
    }    
}

module.exports = {verify}