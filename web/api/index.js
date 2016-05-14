var app = require('express').Router();

app.use('/v1', require('./v1/index'));

module.exports = app;