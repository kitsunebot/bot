let eris = require('../lib/client');
let lang = require('../lib/lang');

module.exports = {
    label: 'test',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        eris.joinVoiceChannel('102568250553950208').then(c=>{
            console.log(1);
            c.stopPlaying();
        }).catch(console.log);
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};