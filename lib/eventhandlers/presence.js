var db = require('../db/sql_db.js');

module.exports = {
    name: 'presence', 
    handler: function (oldUser, newUser) {
        if (newUser.username !== null) {
            db.models.User.upsert({
                uid: newUser.id,
                username: newUser.username,
                status: newUser.status,
                avatar: newUser.avatarURL
            });
        }
    }
};