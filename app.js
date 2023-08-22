var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//const cors = require('cors');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const auth = require('./middlewares/siggner').auth;
const admin = require('./middlewares/siggner').admin;

var indexRouter = require('./routes/index');
var authorizedRouter = require('./routes/authorized');
var managerRouter = require('./routes/manager');
var categoryRouter = require('./routes/category');
var dishRouter = require('./routes/dish');
var mealsRouter = require('./routes/meals');
var orderRouter = require('./routes/order');
var userRouter = require('./routes/user');
var branchRouter = require('./routes/branches');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, 
      {useNewUrlParser:true,
      useUnifiedTopology:true});
    
    console.log("db is connected");

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function() {
      console.log("Connected successfully");
    });
  }
  catch (error) {
    console.error("DB is not connected", error);
  }
}

connectMongoDB();

var app = express();

//app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('Views'));
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.set('views', './views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(admin);
app.use('/', indexRouter);
app.use(auth);
app.use('/manager', managerRouter);
app.use('/auth', authorizedRouter);
app.use('/api/category', categoryRouter);
app.use('/api/dish', dishRouter);
app.use('/api/meal', mealsRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/branch', branchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
