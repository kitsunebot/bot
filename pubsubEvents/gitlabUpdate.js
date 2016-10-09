var eris = require('../lib/client');

module.exports = {
    event: 'gitlabUpdate',
    enabled: true,
    handler: (gitlab)=> {
        if (eris.channelGuildMap[gitlab.channel] !== undefined) {
            if (gitlab.event === 'Push Hook') {
                eris.createMessage(gitlab.channel, lang.computeLangString(eris.channelGuildMap[github.channel], 'gitlab.push', false, {
                    repo_name: gitlab.payload.project.path_with_namespace,
                    vcsurl: URL.parse(gitlab.payload.project.git_http_url).host,
                    ref: gitlab.payload.ref.split('/')[gitlab.payload.ref.split('/').length - 1],
                    commits: gitlab.payload.commits.map(commit=>lang.computeLangString(eris.channelGuildMap[github.channel], 'gitlab.commit', false, {
                        message: commit.message,
                        committer: commit.author.name,
                        commit_id: commit.id.slice(0, 7),
                    })).join('\n')
                }));
            }
        }
    }
};