var db = require('./db/sql_db');
var fs = require('fs');
var utils = require('./lib/utils');
var shortid = require('shortid');

fs.readFile('./list.txt', 'utf8', function (err, file) {
    if (!err) {
        var list = file.split('\n');
        imprt(0);

        function imprt(index) {
            var e = list[index].split('||');
            var waifu = {
                name: e[0].trim(),
                source: e[1].trim(),
                pic: e[2].trim()
            };
            utils.uploadFile(waifu.pic).then(function (link) {
                db.models.Character.create({
                    id: shortid.generate(),
                    name: waifu.name,
                    source: waifu.source,
                    type: 'waifu'
                }).then((waifu)=> {
                    waifu.createCharacterPicture({link: link});
                    console.log(waifu.name);
                });
                if (list[index + 1] !== undefined)imprt(index + 1)
            }).catch(()=> {
                if (list[index + 1] !== undefined)imprt(index + 1)
            });
        }
    } else console.log(err);
});