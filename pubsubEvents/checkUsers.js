var eris = require('../lib/client');
var db = require('../lib/db');

/** @namespace eris.users */
module.exports = {
    event: 'checkUsers',
    enabled: true,
    handler: ()=>eris.users.map(user=>db.models.User.update({online: true}, {where: {uid: user.id}}))
};