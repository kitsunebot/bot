var app = require('express').Router();

var discordBot = require('../../../lib/init_client');

app.get('/', function (req, res) {
    var serv = discordBot.servers.map(function (e) {
        return {id: e.id, name: e.name, region: e.region};
    });
   res.json({data: serv});
});

module.exports = app;