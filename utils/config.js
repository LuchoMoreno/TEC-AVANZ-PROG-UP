// dotenv es un módulo de JavaScript que se utiliza comúnmente en aplicaciones Node.js. 
// Su propósito principal es cargar variables de entorno desde un archivo .env en el entorno de desarrollo.
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const SECRET = process.env.SECRET;

module.exports = {
    PORT,
    DB_URI,
    SECRET
};