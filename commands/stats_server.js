var db = require('../db/sql_db');
var lang = require('../lib/lang');

module.exports = {
    label: 'server',
    enabled: false,
    isSubcommand: true,
    generator: (msg, args)=> {

    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};