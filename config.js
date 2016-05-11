module.exports = {
    login: {
        token: 'MTYwMDEzNzk0NTExMjkwMzY4.CewK0w.AsBX6YYRIIIGfC92W_4gi33ewW4'
    },
    options: {
        pm2: {
            process: 'foxbot'
        }
    },
    mailgun: {
        apiKey: '', //todo
        domain: ''
    },
    redis: {
        host: 'hoellenfuchs.fuechschen.org',
        db: 1,
        password: 'Tnb8kQ0PPQqcCEP5Y9f7RusF42FhNZIdQE16bgjT6ACOYDndd7Z70vQWWNbc',
        pubsub: {
            prefix: 'foxbot_'
        }
    },
    db: {
        database: 'foxbot',
        username: 'foxbot',
        password: 'zo3OyaV185mENEQoq4zEbEHiXoGE6a',
        options: {
            dialect: 'mariadb',
            host: 'hoellenfuchs.fuechschen.org',
            port: 3306
        }
    },
    languages: {
        default: 'en',
        all: ['en', 'de']
    },
    apiKeys: {
        twitch: '3j6j7bnu3ftoy6y2qp8z71xm8y621z0'
    }
};