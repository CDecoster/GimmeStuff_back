var express = require('express');
var logger = require('morgan');

var giftRouter = require('./routes/gifts');
var usersRouter = require('./routes/users');
var authsRouter = require('./routes/auths')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/gifts', giftRouter);
app.use('/users', usersRouter);
app.use('/auths', authsRouter);

module.exports = app;
