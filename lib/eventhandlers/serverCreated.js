var db = require('../db/sql_db');

module.exports = {
    name:'serverCreated',
    handler:function (server) {
        server.members.forEach(function (member) {
            db.models.User.upsert({
                uid: member.id,
                username: member.username,
                avatar: member.avatarURL,
                status: member.status
            });
        });
        db.models.Server.findOrCreate({
            where: {sid: server.id},
            defaults: {
                sid: server.id,
                name: server.name,
                region: server.region,
                icon: server.iconURL
            }
        }).spread(function (srv, created) {
            if (created) {
                //todo send welcome
                db.models.User.findOrCreate({
                    where: {uid: server.owner.id}, defaults: {
                        uid: server.owner.id,
                        username: server.owner.username,
                        avatar: server.owner.avatarURL
                    }
                }).spread(function (user) {
                    srv.setOwner(user);
                });
            } else {
                srv.update({
                    sid: server.id,
                    name: server.name,
                    region: server.region,
                    icon: server.iconURL
                });
                srv.getOwner().then(function (owner) {
                    if (owner.uid !== server.owner.id) {
                        db.models.User.findOrCreate({
                            where: {uid: server.owner.id}, defaults: {
                                uid: server.owner.id,
                                username: server.owner.username,
                                avatar: server.owner.avatarURL
                            }
                        }).spread(function (user) {
                            srv.setOwner(user);
                        });
                    }
                });
            }
        });
    }
};