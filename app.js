var mysql = require('mysql');

//====Localhost Database====//
// var db_config = {
//    // port: '8889',
//    host: 'localhost',
//    //host: '127.0.0.1',
//    user: 'root',
//    password: '',
//    //password: '',
//   database: 'diyoliyo'
// };

//====server Database====//
var db_config = {
   // port: '8889',
   host: 'mysql://mysql:3306/',
   //host: '127.0.0.1',
   user: 'root',
   password: '1234',
   //password: '',
  database: 'diyoliyo'
};

connection = '';

function handleDisconnect() {
  console.log('in funct');
  connection = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {              // The server is either down
    if (err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });         
  connection.query('select * from customer',function(err1,res1){
    if(err1){
      console.log(err1)
    }else{
      console.log('Connected to Database.')
    }
  })                            // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var index = require('./routes/index');
var users = require('./routes/users');
var customer = require('./routes/user-panel/user');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

//Common Paths

forgot_password_url = '';

//Customer Panel APIs

 app.post('/customer_login',customer);
// app.put('/change_password_customer',customer);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
