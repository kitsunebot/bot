var story = require('storyboard').mainStory;

var cache = require('../cache');
var db = require('../db/sql_db');

module.exports = {
    name: 'channelDeleted',
    handler:function (channel) {
        story.debug('meta', 'channel deleted');
        db.models.TwitchWatcher.findAll({where: {server_channel: channel.id}}).then(function (watchers) {
            if (watchers.length > 0) watchers.forEach(function (watcher) {
                watcher.destroy();
            });
        });

        db.models.Server.find({where: {mod_log: channel.id}}).then(function (server) {
            if (server !== undefined && server !== null) {
                cache.getServer(server.sid, function (srv) {
                    srv.setModLog(null);
                    srv.sendToOwner({key: 'modlog.channel_deleted', replacer: {server: server.name}});
                });
            }
        });
    }
};