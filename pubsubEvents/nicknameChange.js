let eris = require('../lib/client');

module.exports = {
    event: 'nicknameChange',
    enabled: true,
    handler: (nick)=> {
        eris.guilds.map((g)=> {
            return g
        }).forEach((g, index)=> {
            setTimeout(()=> {
                eris.editNickname(g.id, nick)
            }, index * 10000);
        });
    }
};