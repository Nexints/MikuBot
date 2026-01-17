const { version, versionID, botChannel } = require('../../config.js');
const { latestVersion } = require('../../index.js');

const Sequelize = require('sequelize');

const devdb = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'devdb.sqlite',
});

const chatLog = devdb.define('chatLog', {
    channelId: Sequelize.STRING,
    content: Sequelize.TEXT,
    author: Sequelize.STRING
});

const updates = devdb.define('updates', {
    channelId: {
        type: Sequelize.STRING,
    },
    channel: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING,
    },
});

module.exports = {
    // Example of a help menu given by the bot.
    // Input: none
    // Expected Return: An array of strings.
    help() {
        return [
            'Developer:',
            '/print (args) - Prints stuff to the console!',
            'By default, /print prints what possible arguments there are.',
        ];
    },
    // Example of a command in the CLI (command line) of the bot.
    // Input: command given by the bot, readline function, client
    // Expected Return: true or false depending on if the command was valid or not. Otherwise, this breaks the code used to determine if a command is valid or not.
    async command(command) {
        switch (command.split(" ")[0].toLowerCase()) {
            case "/print": // Prints various things. This mostly serves as a developer command.
                let print;
                if (command.split(" ")[1] != undefined) {
                    print = command.split(" ")[1].toLowerCase();
                }
                switch (print) {
                    case "v":
                    case 'version':
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] Printing the version`);
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] ${version} (Version ID: ${versionID}) / Latest version ID: ${latestVersion}.`);
                        if (latestVersion > versionID) {
                            console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] ${latestVersion - versionID} commits behind.`);
                        } else if (latestVersion == 0) {
                            console.log("[" + DateFormatter.format(Date.now()) + `] [WARN] The bot can't check for updates!`);
                        } else if (latestVersion < versionID) {
                            console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] ${versionID - latestVersion} commits ahead.`);
                        } else {
                            console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] Running the latest version.`);
                        }
                        console.log("[" + DateFormatter.format(Date.now()) + '] [INFO]', '\x1b[36m--------------------- Nex 2025 ---------------------\x1b[0m');
                        break;
                    case "b":
                    case 'build':
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] Printing the build!`);
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] v${version}-${botChannel}.`);
                        console.log("[" + DateFormatter.format(Date.now()) + '] [INFO]', '\x1b[36m--------------------- Nex 2025 ---------------------\x1b[0m');
                        break;
                    default:
                        console.log("[" + DateFormatter.format(Date.now()) + `] [WARN] Not a valid argument.`);
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] Valid arguments:`);
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] version - prints version info`);
                        console.log("[" + DateFormatter.format(Date.now()) + `] [INFO] build - prints bot build`);
                        console.log("[" + DateFormatter.format(Date.now()) + '] [INFO]', '\x1b[36m--------------------- Nex 2025 ---------------------\x1b[0m');
                }
                return true;
            default:
                return false;
        }
    }
}