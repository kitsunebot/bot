'use strict';

var db = require('../sql_db');
var redis_pubsub = require('../redis_pubsub');
var config = require('../../config');
var utils = require('../utils');
var discordBot = require('../init_client');

var S = require('string');
var story = require('storyboard').mainStory;

var Server = function (sid, callback) {
    var that = this;
    console.log('creating ' + sid);

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
            automod: server.automod,
            modlog: server.modlog !== null ? server.modlog : false
        };
        that.prefixes = ['!fb '];
        if (server.slash_prefix) that.prefixes.push('/');
        if (server.exclam_prefix) that.prefixes.push('!');
        if (server.custom_prefix !== null) that.prefixes.push(server.custom_prefix);
        that.customtext_enabled = server.customtext_enabled;
        that.customtext_prefix = server.customtext_prefix;
        that.userperms = {};
        server.getOwner().then(function (owner) {
            that.userperms[owner.uid] = 5;
            server.getServerRoles().then(function (roles) {
                roles.forEach(function (role) {
                    that.userperms[role.uid] = role.level;
                });
                db.models.User.findAll({where: {custom_role: {$gt: 0}}}).then(function (users) {
                    users.forEach(function (user) {
                        if (that.userperms[user.uid] !== undefined) {
                            if (that.userperms[user.uid] < user.custom_role) that.userperms[user.uid] = user.custom_role;
                        } else that.userperms[user.uid] = user.custom_role;
                    });
                    if (typeof callback === 'function') callback(that);
                });
            });
        });
        redis_pubsub.on('message', function (channel, message) {
            if (channel === config.redis.pubsub.prefix + 'serverupdates' && message === that.id) that.triggerRefresh();
        });
    }
};

Server.prototype.isCommand = function (msg) {
    var that = this;
    var str = S(msg);
    if (that.prefixes !== undefined) {
        for (let prefix of that.prefixes) {
            if (str.startsWith(prefix)) return prefix;
        }
        return false
    } else {
        story.warn('bot', 'that.prefixes was accessed before being created');
        return false;
    }
};

Server.prototype.isCustomText = function (msg) {
    var str = S(msg);
    if (str.startsWith(this.customtext_prefix) && this.customtext_enabled) return this.customtext_prefix;
    else return false;
};

Server.prototype.getPermissionLevel = function (uid) {
    return this.userperms[uid] || 0;
};

Server.prototype.setCustomPrefix = function (prefix) {
    var that = this;
    db.models.Server.update({custom_prefix: prefix}, {where: {sid: that.id}}).then(function () {
        that.triggerRefresh();
    });
};

Server.prototype.setLanguage = function (lang) {
    var that = this;
    db.models.Server.update({language: lang}, {where: {sid: that.id}}).then(function () {
        that.triggerRefresh();
    });
};

Server.prototype.getLanguage = function () {
    return this.language;
};

Server.prototype.triggerRefresh = function () {
    redis_pubsub.serverUpdate(this.id);
};

Server.prototype.modlog = function (user, action) {
    if (typeof this.options.modlog === 'string') {
        utils.messages.sendMessage(discordBot.channels.get('id', this.options.modlog), {
            key: 'modlog.' + action,
            replacer: {username: user.username, uid: user.id}
        });
    }
};

Server.prototype.refresh = function (callback) {
    console.log('re', this.id);
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
        that.customtext_enabled = server.customtext_enabled;
        that.customtext_prefix = server.customtext_prefix;
        that.userperms = {};
        server.getOwner().then(function (owner) {
            that.userperms[owner.uid] = 5;
            server.getServerRoles().then(function (roles) {
                roles.forEach(function (role) {
                    that.userperms[role.uid] = role.level;
                });
                db.models.User.findAll({where: {custom_role: {$gt: 0}}}).then(function (users) {
                    users.forEach(function (user) {
                        that.userperms[user.uid] = user.custom_role;
                    });
                    if (typeof callback === 'function') callback(that);
                });
            });
        });
    });
};

module.exports = Server;