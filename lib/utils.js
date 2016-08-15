var S = require('string');
var _ = require('underscore');
var request = require('request');
var validator = require('validator');
var Promise = require('bluebird');

var config = require('../config');

class FUtils {
    replace(str, replacer) {
        var keys = _.keys(replacer);
        var string = S(str);
        keys.forEach(function (key) {
            string = string.replaceAll('&{' + key + '}', replacer[key] || '');
        });
        return string.s;
    }

    uploadFile(file) {
        if (validator.isURL(file)) {
            return new Promise(function (resolve, reject) {
                request.post({
                    url: config.file.post_url,
                    formData: {data: request.get(file)},
                    headers: {'x-auth-fue': config.file.auth}
                }, function (err, resp, body) {
                    if (err)reject(err);
                    else if (resp.statusCode !== 201) reject(resp.statusCode);
                    else resolve(JSON.parse(body).loc);
                });
            });
        } else {
            return Promise.reject('invalid file type');
            //todo
        }
    }
}


module.exports = new FUtils();