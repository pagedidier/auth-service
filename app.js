
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let createError = require('http-errors');
let mongoose = require('mongoose');
let express = require('express');

let port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth-service', { useNewUrlParser: true,  useCreateIndex: true,},(err,database)=>{
});
let User = require('./models/userModel');
let app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

var userRouter = require('./routes/userRouter');
app.use(cors());
userRouter(app);
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    console.log(err);
    res.header('content-Type','json/application');
    res.status(err.status || 500).json({
        error:true,
        message: 'Route not found'
    });

    next();
});

app.listen(port);
console.log('Server started on: ' + port);
module.exports = app;
