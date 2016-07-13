var story = require('storyboard').mainStory;
var fs = require('fs');
var flatten = require('flat');

var config = require('../config');
var cache = require('./cache');
var utils = require('./utils');

var langfiles = {};

fs.readdir('./lang', (err, files)=> {
    if (err) {
        story.fatal('Error reading langfile', {attach: err});
        process.exit(1);
    } else {
        files.forEach((file)=> {
            try {
                var f = require('../lang/' + file);
                langfiles[f.lang] = flatten(f.strings);
            } catch (e) {
                story.warn('Error reading langfile ' + file, {attach: e});
            }
        });
        if (langfiles[config.languages.default] === undefined) {
            story.fatal('Unable to load default langfile.');
            process.exit(1);
        }
    }
});

var resolve = (lang, key)=> {
    if (langfiles[lang][key] !== undefined) return langfiles[lang][key];
    else return langfiles[config.languages.default][key];
};

var computeLangString = (id, key, isUser, replacer)=> {
    var lang = (isUser ? require('./cache').getUserLanguage(id) : require('./cache').getGuildLanguage(id));
    var str = resolve(lang, key);
    return utils.replace(str, replacer);
};

var computeResponse = (msg, key, replacer)=> {
    var isPrivate = msg.channel.guild === undefined;
    return (isPrivate ? '' : utils.replace(langfiles[config.languages.default]['username'], {username: (isPrivate ? msg.author.user.username : msg.member.nick)}))+ ' ' + computeLangString(isPrivate ? msg.author.id : msg.channel.guild.id, key, isPrivate, replacer);
};

module.exports = {
    langfiles: langfiles,
    resolve: resolve,
    computeLangString: computeLangString,
    computeResponse: computeResponse
};