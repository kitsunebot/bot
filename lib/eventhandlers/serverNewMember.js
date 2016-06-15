var story = require('storyboard').mainStory;

var db = require('../db/sql_db');

module.exports = {
    name:'serverNewMember',
    handler:function (server, user) {
        story.debug('serverNewMember', user.username + '[' + user.id + '] joined ' + server.name + '[' + server.id + ']');
        if (user.username !== null) {
            db.models.User.upsert({
                uid: user.id,
                username: user.username,
                status: user.status,
                avatar: user.avatarURL
            });
        }
    }
};