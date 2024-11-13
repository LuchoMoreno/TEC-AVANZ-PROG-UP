const usersRouter = require('express').Router();

//( CONTROLLERS )
const UserController = require('../controllers/userController');
const Middleware = require('../middleware/auth-middleware');


// Creo un nuevo usuario
usersRouter.post("/users", async (req, res) => {

  let name = req.body.name;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let isActive = req.body.isActive;
  let password = req.body.password;

  try {
    const result = await UserController.addUser(name, lastname, email, isActive, password);
    if (result) {
      res.status(201).send("Usuario creado correctamente"); // 201
    } else {
      res.status(409).send("El usuario ya existe"); // 409
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al crear el usuario."); //500
  }

});

usersRouter.get("/users", Middleware.verify, async (req, res) => {

  let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Forbidden
  }

  let limit = req.query.limit;
  let offset = req.query.offset;

  try {
    const results = await UserController.getAllUsers(limit, offset);
    res.status(200).json(results);

  } catch (error) {
    res.status(500).send("Error. Intente más tarde.")
  }

});


// Obtengo mi propia informacion de usuario
usersRouter.get("/users/me", Middleware.verify, async (req, res) => {
  let userId = req.token.userId;
  try {
    const results = await UserController.getUserMe(userId);
    res.status(200).json(results);

  }catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
} 

});

// Obtengo un usuario por ID
usersRouter.get("/users/:id", Middleware.verify, async (req, res) => {

  let userRole = req.token.roles;
    
    // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Forbidden
  }

  try {
    const results = await UserController.getUser(req.params.id);
    res.status(200).json(results);

  }catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
} 

});


// Modifico un usuario
usersRouter.put("/users/:id", Middleware.verify, async (req, res) => {

  let userRole = req.token.roles;
    
  // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Forbidden
  }

  const user = { _id: req.params.id, ...req.body }; // {_id: req.params.id, name: req.body.name, lastname, email }

  try {

    const result = await UserController.editUser(user);
    res.status(200).send("Usuario modificado con éxito")

  }catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
} 
});


// Elimino un usuario
usersRouter.delete("/users/:id", Middleware.verify, async (req, res) => {

  let userRole = req.token.roles;
    
  // Verificar si el rol del usuario no es 'admin'
    if (userRole !== 'admin') {
        return res.status(401).send("Acceso denegado. El usuario no tiene el perfil requerido"); // 401 Forbidden
  }

  try {

    const result = await UserController.deleteUser(req.params.id);
    res.status(200).send("Usuario borrado con éxito")
   
  }catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).send(error.message);
} 
});


module.exports = usersRouter;