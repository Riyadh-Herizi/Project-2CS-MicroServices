var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var indexRouter = require('./routes/admin/admin');
var usersRouter = require('./routes/user/users');
var clientRouter = require('./routes/client/clients');
var generalRouter = require('./routes/general');
var PlanningRouter = require('./routes/client/planning');


var Passport = require('passport').Passport,
    passport = new Passport(),
    user_passport = new Passport(),
    client_passport = new Passport();

var authRoutes = require('./routes/admin/auth')(passport);
var UserauthRoutes = require('./routes/user/users_auth')(user_passport);
var ClientauthRoutes = require('./routes/client/clients_auth')(client_passport);

var Sequelize = require('sequelize');
var app = express();
var MySQLStore = require('express-mysql-session')(session);
var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'project'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}));


require("./client_passport")(client_passport);
app.use(client_passport.initialize());
app.use(client_passport.session());

require("./passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

require("./user_passport")(user_passport);
app.use(user_passport.initialize());
app.use(user_passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', indexRouter);
app.use('/user', usersRouter);
app.use('/user', UserauthRoutes);
app.use('/',  generalRouter);
app.use('/admin',authRoutes);
app.use('/client',ClientauthRoutes);
app.use('/client',clientRouter);

app.use('/planning_control',PlanningRouter);

const port = 3000;
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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
module.exports = app;
