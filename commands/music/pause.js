const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require('discord.js');
const { BotNotInVoiceChannel, UserNotInVoiceChannel } = require('../../string.json');

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Met en pause la musique en cours.'
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        /**
         * @type StreamDispatcher
         */
        const dispatcher = message.client.server.dispatcher;

        console.log(message.member.voice.channel);
        if (!message.member.voice.channel) {
            return message.say(UserNotInVoiceChannel);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        if (dispatcher) {
            dispatcher.pause();
        }

        return message.say(":pause_button: La musique a été mis en pause !");
    }
}