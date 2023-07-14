const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.post('/login', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
