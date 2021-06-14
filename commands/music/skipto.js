const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotInVoiceChannel, BotNotInVoiceChannel } = require('../../string.json');
const ytdl = require('ytdl-core');


module.exports = class SkipToCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skipto',
            group: 'music',
            memberName: 'skipto',
            description: "Passe la musique a une certaines position dans la file d'attente.",
            args: [
                {
                    key: 'index',
                    prompt: "A quelle position de la file d'attente veux tu te rendre ?",
                    type: 'integer'
                }
            ]
        });
    }
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, { index }) {
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        if (!voiceChannel) {
            return message.say(UserNotInVoiceChannel);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        index--;

        if (!server.queue[index]) {
            server.currentVideo = {url: "", title: ":x: Rien pour le moment !"};
            return message.say(":x: Cette position dans la file d'attente est introuvable.")
        }

        server.currentVideo = server.queue[index];
        server.dispatcher = server.connection.play( await ytdl(server.currentVideo.url, {filter: 'audioonly' }));
        server.queue.splice(index, 1);

        return message.say(":fast_forward: La musique a été passé.");
    }
}