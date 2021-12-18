var express = require('express');
var logger = require('morgan');

var wishlistRouter = require('./routes/wishlists');
var usersRouter = require('./routes/users');
var authsRouter = require('./routes/auths')
var giftRouter = require('./routes/gifts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/wishlists', wishlistRouter);
app.use('/users', usersRouter);
app.use('/auths', authsRouter);
app.use('/gifts', giftRouter);

module.exports = app;
