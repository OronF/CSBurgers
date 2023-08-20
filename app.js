var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//const cors = require('cors');
const bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/category', categoryRouter);
app.use('/api/dish', dishRouter);
app.use('/api/meal', mealsRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/branches', branchRouter);

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

/* --------------------------------------------- middleware sign up ------------------------------------------ */

app.use(siggner);

// app.get('')

function validPhoneNumber(number)
{
    for(let i = 0; i<number.length; i++)
    {
        if(isNaN(number[i]))
        return false;
    }


        $(document).ready(function() {
      
          const checkIfExists = (data) => {
              data.forEach(phoneNumber => {
                  if(phoneNumber === number)
                    return false;
              });
          }
      
          $.ajax({
              url:"/api/user",
              method: "GET",
              success: (data) => {
                  checkIfExists(data);
                  console.log("success");

              },
              error: (error) => {
                  console.log(error);
              }
          });
      });
    
    return true;
}

function checkField(inp)
{
  if(inp === "")
  {
    return true;
  }
  return false;
}

function isEmpty(req)
{
  if(checkField(req.body.phoneNumber))
    return true;
    if(checkField(req.body.fname))
    return true;
  if(checkField(req.body.lname))
    return true;
  if(checkField(req.body.password))
    return true;
  if(checkField(req.approvePassword))
    return true;
  return false;
}


function nameValidation(name)
{
    if(name.length < 2 || name.length > 10)
    {
        return false;
    }
    
    for (let i = 0; i < name.length; i++) {
        const charCode = name.charCodeAt(i);
        
        // Check if the character is a valid Hebrew letter
        if (charCode < 1488 || charCode > 1514) {
            return false;
        }
    }

    return true;
}


function siggner(req, res, next)
{
  if(isEmpty(req))
    return;
    
  if(validPhoneNumber(req.body.phoneNumber))
  {
      if(req.body.password === req.body.approvePassword)
      {
          if(req.body.password >= 8)
          {
              if(nameValidation(req.body.fname))
              {
                if(nameValidation(req.body.lname))
                {
                  next();
                }
              }
          }
      }
  }
  return;
}