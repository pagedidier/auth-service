require('dotenv').config();

// Dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');

// Config
const configFile = require('./config/config.json');
const { handleError, ErrorHandler } = require('./helpers/error');
require('./config/passport');

const environment = process.env.NODE_ENV || 'dev';
const config = configFile[environment];

// Config
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.DB_URL}:${config.DB_PORT}+/${config.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// Express configuration
const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


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
  return next();
});

// Models
require('./models/userModel');

// Routers
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

authRouter(app);
userRouter(app);

// Send a 404 when no other routes are found
app.use((req, res, next) => {
  throw new ErrorHandler(404, 'Resource not found');
});

// Handle the error
app.use((err, req, res, next) => {
  handleError(err, res);
  next();
});

app.listen(config.port);

module.exports = app;
