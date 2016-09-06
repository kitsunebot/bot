var eris = require('../lib/client');
var lang = require('../lib/lang');
var fcache = require('../lib/cache');
var db = require('../lib/db');

module.exports = {
    label: 'initroles',
    enabled: true,
    isSubcommand: false,
    generator: (msg)=> {
        if (msg.author.id !== msg.channel.guild.ownerID)return lang.computeResponse(msg, 'no_permission', {
            required: 5,
            have: '!5'
        });
        var perm = msg.guild.members.find((member)=> {
            return member.user.id === eris.user.id
        }).permission;
        if (!perm.has('manageRoles'))return lang.computeResponse(msg, 'roles.failed');
        if (fcache.getGuild(msg.channel.guild.id).initialized)return lang.computeResponse(msg, 'roles.already');
        Promise.join(eris.createRole().then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {name: lang.computeLangString(msg.channel.guild.id, 'roles.regular', false)});
        }), eris.createRole().then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {name: lang.computeLangString(msg.channel.guild.id, 'roles.vip', false)});
        }), eris.createRole().then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {name: lang.computeLangString(msg.channel.guild.id, 'roles.moderator', false)});
        }), eris.createRole().then(role=> {
            return eris.editRole(msg.channel.guild.id, role.id, {name: lang.computeLangString(msg.channel.guild.id, 'roles.manager', false)});
        }), (regular, vip, moderator, manager)=> {
            db.models.Guild.update({
                role_regular: regular.id,
                role_vip: vip.id,
                role_moderator: moderator.id,
                role_manager: manager.id,
                initialized: true
            });
            eris.createMessage(msg.channel.id, lang.computeResponse(msg, 'roles.init'))
        })
    },
    options: {
        deleteCommand: true,
        caseInsensitive: true,
        serverOnly: true
    }
};