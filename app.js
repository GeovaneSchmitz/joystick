var createError = require('http-errors');
var path = require('path');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');

var i18n = require("i18n-express");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var controllers = require('./controllers')

io.on('connection', function (socket) {
  socket.emit('controllers', controllers.available());
  socket.on('press', function (key) {
    controllers.press(socket.id, key)
  });
  socket.on('release', function (key) {
    controllers.release(socket.id, key)
  });
  socket.on('select', function (msg) {

    if (controllers.add(msg, socket.id)){
      io.emit('controllers', controllers.available());
      socket.emit('selected');
    }
  });
  socket.once('disconnect', function () {
    controllers.disconnect(socket.id);
    io.emit('controllers', controllers.available());
  });
});
var indexRouter = require('./routes/list');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(i18n({
  browserEnable: true,
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en", "pt"],
  textsVarName: 'translation'
}));

app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});




http.listen(3000, function () {
  console.log('listening on *:3000');
});


module.exports = app;
