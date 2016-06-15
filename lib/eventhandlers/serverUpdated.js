var db = require('../db/sql_db');

module.exports = {
    name: 'serverUpdated',
    handler:function (oldServer, newServer) {
        db.models.Server.update({
            sid: newServer.id,
            name: newServer.name,
            region: newServer.region,
            icon: newServer.iconURL
        }, {where: {sid: newServer.id}});
    }
};