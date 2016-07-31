var db = require('../lib/db');
var lang = require('../lib/lang');

module.exports = {
    label: 'add',
    enabled: false,
    isSubcommand: true,
    generator: (msg, args)=> {

    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};