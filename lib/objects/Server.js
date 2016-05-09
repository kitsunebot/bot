'use strict';

var db = require('../sql_db');
var S = require('string');

var redis_pubsub = require('../redis_pubsub');
var config = require('../../config');

var Server = function (sid, callback) {
    var that = this;

    if (typeof sid === 'string') {
        db.models.Server.find({where: {sid: sid}}).then(create);
    } else if (typeof sid === 'object') create(sid);

    function create(server) {
        that.id = server.sid;
        that.name = server.name;
        that.region = server.region;
        that.icon = server.icon;
        that.language = server.language;
        that.options = {
            automod: server.automod
        };
        that.prefixes = ['!fb '];
        if (server.slash_prefix) that.prefixes.push('/');
        if (server.exclam_prefix) that.prefixes.push('!');
        if (server.custom_prefix !== null) that.prefixes.push(server.custom_prefix);
        that.userperms = {};
        server.getOwner().then(function (owner) {
            that.userperms[owner.uid] = 5;
            server.getServerRoles().then(function (roles) {
                roles.forEach(function (role) {
                    that.userperms[role.uid] = role.level;
                });
                if (typeof callback === 'function') callback(that);
                
                redis_pubsub.on('message', function (channel, message) {
                   if(channel === config.redis.pubsub.prefix + 'serverupdates' && message === that.id) that.refresh(); 
                });
            });
        });
    }
};

Server.prototype.isCommand = function (msg) {
    var that = this;
    var str = S(msg);
    for (let prefix of that.prefixes) {
        if (str.startsWith(prefix)) return prefix;
    }
    return false;
};

Server.prototype.getPermissionLevel = function (uid) {
    return this.userperms[uid];
};

Server.prototype.setCustomPrefix = function (prefix) {
    var that = this;
    db.models.Server.update({custom_prefix: prefix}, {where: {sid: that.id}}).then(function () {
        that.refresh();
    });
};

Server.prototype.refresh = function (callback) {
    var that = this;
    db.models.Server.find({where: {sid: that.id}}).then(function (server) {
        that.id = server.sid;
        that.name = server.name;
        that.region = server.region;
        that.icon = server.icon;
        that.language = server.language;
        that.options = {
            automod: server.automod
        };
        that.prefixes = ['!fb '];
        if (server.slash_prefix) that.prefixes.push('/');
        if (server.exclam_prefix) that.prefixes.push('!');
        if (server.custom_prefix !== null) that.prefixes.push(server.custom_prefix);
        that.userperms = {};
        server.getOwner().then(function (owner) {
            that.userperms[owner.uid] = 5;
            server.getServerRoles().then(function (roles) {
                roles.forEach(function (role) {
                    that.userperms[role.uid] = role.level;
                });
                if (typeof callback === 'function') callback(that);
            });
        });
    });
};

module.exports = Server;