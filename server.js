const express = require('express');
const cors = require('cors');
const api = require('./api');
const mongoose = require('mongoose');

require('dotenv').config();

const { MONGO_URL } = process.env;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(e => {
    console.error(e);
  });

const app = express();

app.use(
  cors({
    origin: true,
  })
);

// json = 요청 body의 application/json 구문분석을 위한 미들웨어
app.use(express.json());

// unrencoded = 요청 body의 application/x-www-form-urlencoded 구문분석을 위한 미들웨어
app.use(express.urlencoded({ extended: true })); // true면 qs, false면

app.use(express.static('public'));
app.use(express.json());

app.use('/api', api);

app.listen('7000', () => {
  console.log('http://localhost:7000');
});