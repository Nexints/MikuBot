module.exports = {
    async execute() {

        // Able to use sequelize databases in plugins and have them loaded.
        const Sequelize = require('sequelize');

        const sequelize = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            // SQLite only
            storage: 'database.sqlite',
        });

        const moderation = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            // SQLite only
            storage: 'moderation.sqlite',
        });

        // Databases used.
        const logging = moderation.define('logging', {
            startChannel: {
                type: Sequelize.STRING,
            },
            endChannel: {
                type: Sequelize.STRING,
            },
        });

        const blacklist = moderation.define('blacklist', {
            user: {
                type: Sequelize.STRING,
            },
            channel: {
                type: Sequelize.STRING,
            },
        });

        const optOut = sequelize.define('optout', {
            author: {
                type: Sequelize.STRING,
                unique: true,
            }
        });

        await logging.sync();
        await blacklist.sync();
        await optOut.sync();
    }
}

