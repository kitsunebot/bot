var lang = require('../lib/lang');

module.exports = {
    label: 'commands',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        return lang.computeResponse(msg, 'commands.default');
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};