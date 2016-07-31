var db = require('../lib/db');
var lang = require('../lib/lang');

module.exports = {
    label: 'remove',
    enabled: false,
    isSubcommand: true,
    generator: (msg, args)=> {

    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};