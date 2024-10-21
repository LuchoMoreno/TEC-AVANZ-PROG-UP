// PARA EJECUTAR: 
// node index.js

require('./db/mongo');

const {PORT} = require('./utils/config');

const express = require('express');

const cors = require('cors'); // Importa el paquete cors

const app = express();

app.use(cors()); // Usa el middleware cors

app.use(express.json());


// IMPORTO LAS RUTAS.
const authRouter = require('./routes/authRouter');
const betsRouter = require('./routes/betsRouter');
const horsesRouter = require('./routes/horsesRouter');
const racesRouter = require('./routes/racesRouter');
const rankingRouter = require('./routes/rankingRouter');
const usersRouter = require('./routes/usersRouter');


// UTILIZO LAS RUTAS.
app.use('/api/auth', authRouter);
app.use('/api', betsRouter);
app.use('/api', horsesRouter);
app.use('/api', racesRouter);
app.use('/api', rankingRouter);
app.use('/api', usersRouter);


// Endpont main.
app.get("/", (req, res) => {
  res.status(200).json("Hola, estoy funcionando! Soy un sistema de carrera de caballos.");
});


app.listen(PORT, ()=> {
    console.log(`Server corriendo en puerto ${PORT}`);
});
