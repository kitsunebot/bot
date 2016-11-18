let lang = require('../lib/lang');

module.exports = {
    label: 'gitlab',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        return lang.computeResponse(msg, 'gitlab._help');
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    },
    subcommands: [require('./gitlab_create'), require('./gitlab_remove')]
};