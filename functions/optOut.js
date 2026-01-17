const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

const optOut = sequelize.define('optout', {
    author: {
        type: Sequelize.STRING,
        unique: true,
    }
});

const optOutChk = async function (firstMember, secondMember) {
    let optedOut = false;
    const optOutList = await optOut.findAll({ attributes: ['author'] });
    optOutList.forEach(optOutID => {
        if (optOutID.author == firstMember.id || optOutID.author == secondMember.id) {
            optedOut = true;
        }
    })
    return optedOut
}

const optOutChkSingle = async function (firstMember) {
    let optedOut = false;
    const optOutList = await optOut.findAll({ attributes: ['author'] });
    optOutList.forEach(optOutID => {
        if (optOutID.author == firstMember.id || optOutID.author == secondMember.id) {
            optedOut = true;
        }
    })
    return optedOut
}

module.exports = {
    optOutChk,
    optOutChkSingle
};