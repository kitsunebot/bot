var Cron = require('cron').CronJob;
var discordBot = require('./init_client');
var db = require('./sql_db');

var gamecron = new Cron('* 0,10,20,30,40,50 * * * *', function () {
    db.models.Game.find({order: 'RAND()'}).then(function (game) {
        discordBot.setPlayingGame(game.name);
    });
}, null, true, null, null, true);

module.exports = {game: gamecron};