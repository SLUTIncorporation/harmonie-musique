const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotInVoiceChannel } = require('../../string.json');


module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'music',
            memberName: 'join',
            description: 'Pour que je rejoigne le channel vocal.'
        });
    }
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.say(UserNotInVoiceChannel);
        }
        await voiceChannel.join();

        return message.say(":thumbsup: J'ai rejoins le channel" + "`" + voiceChannel.name + "`");
    }
}