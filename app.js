
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const mongoose = require('mongoose');
const express = require('express');

const passport = require('passport');
const configFile = require('./config/config.json');

const environment = process.env.NODE_ENV || 'dev';
const config = configFile[environment];


require('./config/passport');


const { port } = config;
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.DB_URL}:${config.DB_PORT}+/${config.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const User = require('./models/userModel');

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

app.use(cors());
authRouter(app);
userRouter(app);

app.use((req, res, next) => {
  next(createError(404));
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: true, message: error.message });
});
// test
app.listen(port);
module.exports = app;
