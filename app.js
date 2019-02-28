
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let createError = require('http-errors');
let mongoose = require('mongoose');
let express = require('express');

const passport = require('passport');
require('./config/passport');

let port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/auth-service', { useNewUrlParser: true,  useCreateIndex: true,},(err,database)=>{
});
let User = require('./models/userModel');
let app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



var userRouter = require('./routes/userRouter');
var authRouter = require('./routes/authRouter');
app.use(cors());
userRouter(app);
authRouter(app);
app.use(function(req, res, next) {
    next(createError(404));
});
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500);
    res.json({error:true,message:error.message});
});
app.listen(port);
module.exports = app;
