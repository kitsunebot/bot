let story = require('storyboard').mainStory;
let fs = require('fs');
let flatten = require('flat');

let config = require('../config');
let cache = require('./cache');
let utils = require('./utils');

class LanguageProcessor {
    constructor() {
        let that = this;
        this.langfiles = {};

        fs.readdir('./lang', (err, files)=> {
            if (err) {
                story.fatal('Error reading langfile', {attach: err});
                process.exit(1);
            } else {
                files.forEach((file)=> {
                    try {
                        let f = require('../lang/' + file);
                        that.langfiles[f.lang] = flatten(f.strings);
                    } catch (e) {
                        story.warn('Error reading langfile ' + file, {attach: e});
                    }
                });
                if (that.langfiles[config.languages.default] === undefined) {
                    story.fatal('Unable to load default langfile.');
                    process.exit(1);
                }
            }
        });
    }

    resolve(lang, key) {
        if (this.langfiles[lang][key] !== undefined) return this.langfiles[lang][key];
        else return this.langfiles[config.languages.default][key];
    }

    computeLangString(id, key, isUser, replacer) {
        let lang = (isUser ? require('./cache').getUserLanguage(id) : require('./cache').getGuild(id).getLanguage());
        let str = this.resolve(lang, key);
        return utils.replace(str, replacer);
    }

    computeResponse(msg, key, replacer, skipPrefix) {
        let isPrivate = msg.channel.guild === undefined;
        return (isPrivate || skipPrefix ? '' : utils.replace(this.langfiles[config.languages.default]['username'], {username: (isPrivate ? msg.author.username : (msg.member.nick ? msg.member.nick : msg.member.user.username))})) + ' ' + this.computeLangString(isPrivate ? msg.author.id : msg.channel.guild.id, key, isPrivate, replacer);
    }

}


module.exports = new LanguageProcessor();