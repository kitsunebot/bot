'use strict';

var Server = require('./objects/Server');

var _ = require('underscore');

var config = require('../config');

var exprt = {
    _: {
        cache: {
            servers: {},
            command_list: {}
        },
        voiceManagers: {}
    },
    getServer: function (sid, callback) {
        if (exprt._.cache.servers[sid] !== undefined) callback(exprt._.cache.servers[sid]);
        else new Server(sid, function (server) {
            callback(server);
            exprt._.cache.servers[sid] = server;
        });
    },
    getVoiceManager: function (sid) {
        return exprt._.voiceManagers[sid]
    },
    getVoiceManagerCount: function () {
        return _.keys(exprt._.voiceManagers).length;
    },
    addVoiceManager: function (voiceManager, override) {
        if (override) {
            if (exprt._.voiceManagers[voiceManager.connection.server.id] !== undefined) exprt._.voiceManagers[voiceManager.connection.server.id].kill();
            exprt._.voiceManagers[voiceManager.connection.server.id] = voiceManager;
            return true;
        } else {
            if (exprt._.voiceManagers[voiceManager.connection.server.id] !== undefined) return false;
            else exprt._.voiceManagers[voiceManager.connection.server.id] = voiceManager;
            return true;
        }
    },
    removeVoiceManager: function (manager) {
        exprt._.voiceManagers[manager.server.id] = undefined;
    }
};

module.exports = exprt;