var story = require('storyboard').mainStory;
var fs = require('fs');
var flatten = require('flat');

var config = require('../config');
var cache = require('./cache');
var utils = require('./utils');

class LanguageProcessor {
    constructor() {
        var that = this;
        this.langfiles = {};

        fs.readdir('./lang', (err, files)=> {
            if (err) {
                story.fatal('Error reading langfile', {attach: err});
                process.exit(1);
            } else {
                files.forEach((file)=> {
                    try {
                        var f = require('../lang/' + file);
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
        var lang = (isUser ? require('./cache').getUserLanguage(id) : require('./cache').getGuild(id).getLanguage());
        var str = this.resolve(lang, key);
        return utils.replace(str, replacer);
    }

    computeResponse(msg, key, replacer, skipPrefix) {
        var isPrivate = msg.channel.guild === undefined;
        return (isPrivate || skipPrefix ? '' : utils.replace(this.langfiles[config.languages.default]['username'], {username: (isPrivate ? msg.author.username : (msg.member.nick ? msg.member.nick : msg.member.user.username))})) + ' ' + this.computeLangString(isPrivate ? msg.author.id : msg.channel.guild.id, key, isPrivate, replacer);
    }

}


module.exports = new LanguageProcessor();