var story = require('storyboard').mainStory;

var discordBot = require('../client');
var utils = require('../utils');
var pubsub = require('../db/redis_pubsub');
var config = require('../../config');

module.exports = {
    _id: 14,
    main_cmd: 'restart',
    alias: [],
    min_perm: 8,
    args: '[none]',
    allow_disable: true,
    handlers: {
        default: function (msg) {
            discordBot.setPlayingGame('Restarting...');
            pubsub.publish('meta', 'restart');
            try {
                var pm2 = require('pm2');
                pm2.connect(function (err) {
                    if (!err) {
                        utils.messages.sendMessage(msg.channel, 'restart.execute', {username: msg.author.name});
                        setTimeout(function () {
                            pm2.restart(config.options.pm2.process, function (err) {
                                if (!err) pm2.disconnect();
                                else error(err);
                            });
                        });
                    } else error(err);
                })
            } catch (e) {
                error(e);
            }

            function error(err) {
                story.error('restart', 'Could not restart through command', {attach: err});
                utils.messages.sendMessage(msg.channel, {
                    key: 'restart.failed',
                    replacer: {err: err}
                }, {username: msg.author.name}, function (err, msg) {
                    if (!err) setTimeout(function () {
                        msg.delete();
                    }, 30 * 1000);
                });
                if (pm2 !== undefined && pm2 !== null) pm2.disconnect();
            }
        }
    }
};