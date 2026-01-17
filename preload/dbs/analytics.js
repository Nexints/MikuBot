module.exports = {
    async execute() {

        // Able to use sequelize databases in plugins and have them loaded.
        const Sequelize = require('sequelize');

        const analytics = new Sequelize('database', 'user', 'password', {
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            // SQLite only
            storage: 'analytics.sqlite',
        });

        // Databases used.
        const usage = analytics.define('commands', {
            type: {
                type: Sequelize.STRING,
            },
            value: {
                type: Sequelize.DOUBLE,
            },
        });

        await usage.sync();
    }
}

