var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require("cors");
var session = require("express-session")
var bodyParser = require("body-parser")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog')

var app = express();
app.set('trust proxy', 1);
app.use(session({
  secret: "Secretkey",
  saveUninitialized : true, 
  resave : false,
  cookie:{ 
      path: '/', 
      expires: false,
      secure: false,
      httpOnly: true,
      maxAge: 3600000
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin : "http://localhost:3000",
  credentials: true
}));
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/blog", blogRouter)

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
