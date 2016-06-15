var utils = require('../utils');
var cache = require('../cache');
var db = require('../db/sql_db');

module.exports = {
    _id: 28,
    main_cmd: 'play',
    alias: [],
    min_perm: 1,
    args: '[fileid]',
    allow_disable: true,
    handlers: {
        server: function (msg) {
            var m = cache.getVoiceManager(msg.server.id);
            var fid = msg.cleanContent.split(' ')[1];
            if (m !== undefined) {
                db.models.MusicFile.find({where: {fid: fid}}).then(function (file) {
                    if (file !== null && file !== undefined) {
                        m.addFileToQueue({name: file.name, path: file.filepath}).then(function (m) {
                            if (m.currentplay === null) m.play();
                        });
                    } else {
                        //Todo send error
                    }
                });
            } else {
                utils.messages.sendMessage(msg.channel, 'voice.no_connection', {username: msg.author.username});
            }
        }
    }
};