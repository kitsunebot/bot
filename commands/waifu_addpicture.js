var Promise = require('bluebird');
var validator = require('validator');

var db = require('../db/sql_db');
var lang = require('../lib/lang');
var utils = require('../lib/utils');
var cch = require('../lib/cache');
var eris = require('../lib/client');

module.exports = {
    label: 'addpicture',
    enabled: true,
    isSubcommand: true,
    generator: (msg, args)=> {
        if (args.length === 0 || args.length > 2) {
            //todo send args err
            console.log(1);
        } else {
            Promise.resolve().then(()=> {
                if (args.length === 2) {
                    if (!validator.isURL(args[0]) && validator.isURL(args[1])) {
                        return Promise.resolve(args[0]);
                    } else {
                        return Promise.reject();
                    }
                } else {
                    return db.models.User.find({where: {uid: msg.author.id}}).then((user)=> {
                        return user.getWaifu().then((waifu)=> {
                            if (waifu !== null && waifu !== undefined) return Promise.resolve(waifu);
                            else return Promise.reject();
                        });
                    });
                }
            }).then((waifu)=> {
                return utils.uploadFile(args[args.length - 1]).then((url)=> {
                    return cch.getGlobalUserPerm(msg.author.id).then((perm)=> {
                        return waifu.createCharacterPicture({link: url, verified: (perm > 5)}).then(()=> {
                            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'waifu.createPicture'));
                        });
                    });
                });
            }).catch((err)=> {
                console.log(err);
                //todo send error
            });
        }
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true
    }
};