var lang = require('../lib/lang');

module.exports = {
    label: 'github',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        return lang.computeResponse(msg, 'github._help');
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    },
    subcommands: [require('./github_create')]
};