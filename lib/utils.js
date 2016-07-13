var S = require('string');
var _ = require('underscore');

exprt = {
    replace: (str, replacer)=> {
        var keys = _.keys(replacer);
        var string = S(str);
        keys.forEach(function (key) {
            string = string.replaceAll('&{' + key + '}', replacer[key] || '');
        });
        return string.s;
    }
};

module.exports = exprt;