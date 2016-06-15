var cache = require('../cache');

module.exports = {
    name:'userBanned',
    handler: function (user, server) {
        cache.getServer(server.id, function (srv) {
            srv.modlog(user, 'banned');
        });
    }
};