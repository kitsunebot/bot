let Promise = require('bluebird');
let validator = require('validator');

let db = require('../lib/db');
let lang = require('../lib/lang');
let utils = require('../lib/utils');
let cch = require('../lib/cache');

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
                        return db.models.Character.find({where: {id: args[0], type: 'waifu'}}).then(waifu=> {
                            if (waifu !== null && waifu !== undefined)return Promise.resolve(waifu);
                            else return Promise.reject();
                        });
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
                    return waifu.createCharacterPicture({
                        link: url,
                        verified: (cch.getGlobalUserPerm(msg.author.id) > 5)
                    }).then(()=> {
                        msg.channel.createMessage(lang.computeResponse(msg, 'waifu.createPicture.default'));
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