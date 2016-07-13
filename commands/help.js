var cache = require('../lib/cache');
var lang = require('../lib/lang');

module.exports = {
    label: 'help',
    enabled: true,
    generator: (msg, args)=> {
        return lang.computeResponse(msg, 'help');
    },
    options: {
        caseInsensitive: true,
        deleteCommand: true
    }
};