let lang = require('../lib/lang');

module.exports = {
    label: 'ping',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        return lang.computeResponse(msg, 'ping')
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};