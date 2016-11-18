let eris = require('../lib/client');
let db = require('../lib/db');

/** @namespace eris.users */
module.exports = {
    event: 'checkUsers',
    enabled: true,
    handler: ()=>eris.users.map(user=>db.models.User.update({online: true}, {where: {uid: user.id}}))
};