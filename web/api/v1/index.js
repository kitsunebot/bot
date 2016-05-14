var app = require('express').Router();

app.use('/servers', require('./server'));

module.exports = app;