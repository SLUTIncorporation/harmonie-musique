const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotInVoiceChannel, BotNotInVoiceChannel } = require('../../string.json');
const ytdl = require('ytdl-core');


module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: "Passe la musique en cours d'écoute."
        });
    }
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        const voiceChannel = message.member.voice.channel;
        const server = message.client.server;

        if (!voiceChannel) {
            return message.say(UserNotInVoiceChannel);
        }

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        if (!server.queue[0]) {
            server.currentVideo = {url: "", title: ":x: Rien pour le moment !"};
            return message.say(":x: Il n'y a rien dans la file d'attente.")
        }

        server.currentVideo = server.queue[0];
        server.dispatcher = server.connection.play( await ytdl(server.currentVideo.url, {filter: 'audioonly' }));
        server.queue.shift();

        return message.say(":fast_forward: La musique a été passé.");
    }
}