'use strict';

var Server = require('./objects/Server');

var config = require('../config');

var exprt = {
    _: {
        cache: {
            servers: {},
            command_list: {}
        }
    },
    getServer: function (sid, callback) {
        if (exprt._.cache.servers[sid] !== undefined) callback(exprt._.cache.servers[sid]);
        else new Server(sid, function (server) {
                callback(server);
                exprt._.cache.servers[sid] = server;
            });
    }
};

module.exports = exprt;