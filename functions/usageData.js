const Sequelize = require('sequelize');
const { optOutChk } = require('./optOut.js');

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

const addCommandsUsed = async function (member) {
    let command;
    if (!(await optOutChk(member))) {
        command = await queryCommand();
        command.value += 1;
        await command.save();
    }
    return command;
}

const queryCommand = async function () {
    await usage.sync();
    let command = await usage.findOne({
        where: {
            type: "command"
        }
    });
    if (command === null) {
        await usage.create({
            type: 'command',
            value: 0
        });
        command = await usage.findOne({
            where: {
                type: "command"
            }
        });
    }
    return command;
}

module.exports = {
    addCommandsUsed,
    queryCommand
};