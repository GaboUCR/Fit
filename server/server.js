const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const {registerUser, findUser, authenticateUser} = require('./db/auth');
const router = express.Router();

app.use(cors())

app.use(bodyParser.json());

router.post('/signup', async (req, res, next) => {
  try {
    const existingUser = await findUser(req.body.username);
    if (existingUser) {
      res.status(409).send('Username already exists!');
    } else {
      await registerUser(req.body.username, req.body.password);
      res.status(200).send('User registered successfully!');
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await authenticateUser(req.body.username, req.body.password);
    res.status(200).send('User authenticated successfully!'); // o enviar algún dato útil para tu aplicación
  } catch (error) {
    next(error); // se asegura de que los errores se manejen adecuadamente
  }
});

app.use('/', router);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
