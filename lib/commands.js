var commands = {};
var db = require('./sql_db');
var utils = require('./utils');
var redis = require('./redis_db');

commands.ping = {
    _id: 1,
    min_perm: 0,
    handler: function (msg) {
        utils.messages.sendReply(msg, 'ping');
        msg.delete();
    }
};

commands.info = {
    _id: 2,
    min_perm: 0,
    handler: function (msg) {
        utils.messages.sendReply(msg, 'info');
        msg.delete();
    }
};

commands.joinserver = commands['join-server'] = commands.invite = {
    _id: 3,
    min_perm: 0,
    handler: function (msg) {
        utils.messages.sendReply(msg, 'invite.default');
        msg.delete();
    }
};

commands.prefix = {
    _id: 4,
    min_perm: 3,
    handler: function (msg) {
        
    }
};


module.exports = commands;