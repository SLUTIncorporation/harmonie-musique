const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: 'h/',
    owner: '235794907162345472',
    invite: 'https://discord.gg/2tbP9QgcmE'
});

client.on('ready', async () => {
    client.user.setActivity('La machines de guerre des chatons est opérationelle !');

});

client.registry
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerGroup('music', 'Music')
    .registerCommandsIn(path.join(__dirname, 'commands'));
    
client.server = {
    queue:  [],
    currentVideo: { url: "" , title: "" },
    dispatcher: null,
    connection:  null
};

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} -  (${client.user.id})`);
});

client.on('error', (error) => console.error(error));

client.login('ODE3NzYwNDk5MjA2NDU1MzA4.YEOM0A.nQ38fZA6sVFrcDJSKagKcaYg54Y');