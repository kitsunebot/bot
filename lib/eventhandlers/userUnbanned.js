var cache = require('../cache');

module.exports = {
    name: 'userUnbanned',
    handler:function (user, server) {
        cache.getServer(server.id, function (srv) {
            srv.modlog(user, 'unbanned');
        });
    }
};