const {connect} = require('mongoose');

const {DB_URI} = require("../utils/config");


const conectarBD = async() =>{ connect(DB_URI) };


conectarBD()
.then( result => {console.log("Conectado satisfactoriamente a la base de datos de TÉC. AVANZ. DE PROGRAMACIÓN")})
.catch( error => console.log(error))
