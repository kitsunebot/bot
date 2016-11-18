let S = require('string');
let _ = require('underscore');
let request = require('request');
let validator = require('validator');
let Promise = require('bluebird');

let config = require('../config');

class FUtils {
    replace(str, replacer) {
        let keys = _.keys(replacer);
        let string = S(str);
        keys.forEach((key) => {
            //noinspection JSUnresolvedFunction
            string = string.replaceAll(`&{${key}}`, replacer[key] || '');
        });
        //noinspection JSUnresolvedletiable
        return string.s;
    }

    uploadFile(file) {
        if (validator.isURL(file)) {
            return new Promise((resolve, reject)=> {
                request.post({
                    url: config.file.post_url,
                    formData: {data: request.get(file)},
                    headers: {'x-auth-fue': config.file.auth}
                }, (err, resp, body)=> {
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