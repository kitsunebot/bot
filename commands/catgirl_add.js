var db = require('../lib/db');
var utils = require('../lib/utils');
var fcache = require('../lib/cache.js');
var lang = require('../lib/lang.js');

module.exports = {
    label: 'catgirl',
    enabled: true,
    isSubcommand: false,
    generator: (msg, args)=> {
        if (args.length === 0 || args.length > 2) {
            //todo send args err
            console.log(1);
        } else {
            db.models.Character.find({where: {id: 'SkyVBlzWg'}}).then((waifu)=> {
                return utils.uploadFile(args[args.length - 1]).then((url)=> {
                    //noinspection JSUnresolvedFunction
                    return waifu.createCharacterPicture({
                        link: url,
                        verified: (fcache.getGlobalUserPerm(msg.author.id) > 5)
                    }).then(()=> {
                        msg.channel.createMessage(lang.computeResponse(msg, 'catgirl.createPicture.default'));
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
        caseInsensitive: true,
    }
};