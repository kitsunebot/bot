var eris = require('../lib/client');

module.exports = {
    event: 'checkUsers',
    enabled: true,
    handler: ()=>eris.users.map(user=>db.models.User.update({online: true}, {where: {uid: user.id}}))
}
;