let lang = require('../lib/lang');

module.exports = {
    label: 'chatlog',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        return lang.computeResponse(msg, 'chatlog.default')
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    },
    subcommands: [require('./chatlog_create')]
};