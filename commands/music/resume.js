const { Command, CommandoMessage } = require("discord.js-commando");
const { StreamDispatcher } = require('discord.js');
const { BotNotInVoiceChannel, UserNotInVoiceChannel } = require('../../string.json');

module.exports = class ResumeCommand extends Command {
    constructor(client) {
        super(client,{
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Relance la musique.'
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

        if (!message.member.voice.channel) {
            return message.say(UserNotInVoiceChannel);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        if (dispatcher) {
            dispatcher.resume();
        }

        return message.say(":notes: Début de la lecture.");
    }
}