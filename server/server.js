const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const {registerUser, findUser, authenticateUser} = require('./db/auth');
const {getExercisesForUser, getRoutinesForUser} = require('./db/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET_KEY = "your-256-bit-secret"; 

app.use(cors());
app.use(bodyParser.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).send({authenticated:false}); // si no hay token, retorna un error 401

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send({authenticated:false}); // si el token es inválido, retorna un error 403
    req.user = user;
    next();
  });
}

//Este middleware se utiliza en la rutas que deben verificar el nombre de usuario y se llama después de authenticateToken
function verifyUsername(req, res, next) {
  if (req.user != req.body.username) {
    res.status(401).send();
  } else {
    next();
  }
}

router.post('/verify', authenticateToken, verifyUsername, (req, res) => {
  res.status(200).send({username: req.user, authenticated:true});
});

router.post('/user-routines', authenticateToken, verifyUsername, (req, res, next) => {
  getRoutinesForUser(req.body.username)
    .then(routines => {
      res.status(200).send(routines);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/user', async (req, res, next) => {
  try {
    const exercises = await getExercisesForUser(req.body.username);
    res.status(200).send(exercises);
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const existingUser = await findUser(req.body.username);
    if (existingUser) {
      res.status(409).send('Username already exists!');
    } else {
      await registerUser(req.body.username, req.body.password);
      // Genera un token con la información del usuario
      const token = jwt.sign({ username: req.body.username }, SECRET_KEY, { expiresIn: '1h' }); // El token expira en 1 hora
      res.status(200).send({username:req.body.username, token: token});
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body.username, req.body.password);
    if (user.status === 200) {
      // Genera un token con la información del usuario
      const token = jwt.sign({ username: user.usermsg.username }, SECRET_KEY, { expiresIn: '1h' }); // El token expira en 1 hora
      res.status(user.status).send({username:user.usermsg.username, token: token});
    } else {
      res.status(user.status).send({username:user.usermsg.username});
    }
  } catch (error) {
    next(error); // se asegura de que los errores se manejen adecuadamente
  }
});

app.use('/', router);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});