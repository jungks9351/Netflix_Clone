const express = require('express');
const cors = require('cors');
const api = require('./api');

const { users } = require('./data/users');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/api', api);

app.listen('7000', () => {
  console.log('http://localhost:7000');
});