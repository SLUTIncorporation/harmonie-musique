const { VoiceConnection } = require('discord.js');
const { Command, CommandoMessage } = require("discord.js-commando");
const { UserNotInVoiceChannel} = require('../../string.json');
const { key } = require('../../config.json');

const ytdl = require('ytdl-core');
const ytsr = require('youtube-search');
const ytpl = require('ytpl')

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Lis une musique depuis Youtube.',
            args: [
                {
                    key: 'term',
                    prompt: 'Quel musique veux tu lire ?',
                    type: 'string'
                }
            ]
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message, { term }) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.say(UserNotInVoiceChannel);
        }

        const server = message.client.server;

        await voiceChannel.join().then((connection) => {

            //Playlist
            if (ytpl.validateID(term)){
                ytpl(term).then((result) =>{
                    result.items.forEach((video) => {
                        server.queue.push({ title: video.title, url: video.shortUrl })
                    });

                    server.currentVideo = server.queue[0];
                    this.runVideo(message, connection).then(() => {
                        message.say(":notes: `" + result.items.length + "` musique a été ajouté à la file d'attente.")
                    });

                })
            } else {

            // Vidéo.
            ytsr(term, { key: key, maxResults: 1, type: 'video' }).then((results) => {

                if (results.results[0]) {
                    const foundVideo = { url: results.results[0].link, title: results.results[0].title };

                if (server.currentVideo.url != "") {
                    server.queue.push(foundVideo);
                    return message.say("Le titre : " + "`" + foundVideo.title + "`" + "a été ajouté à la file d'attente.");
                }
                
                server.currentVideo = foundVideo;
                this.runVideo(message, connection);
                }

            });
        }});
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {VoiceConnection} connection 
     * @param {*} video 
     */
    async runVideo(message, connection) {
        const server = message.client.server;
        const dispatcher = connection.play(ytdl( server.currentVideo.url, {filter: 'audioonly' }) );

        server.queue.shift();
        server.dispatcher = dispatcher;
        server.connection = connection;

        dispatcher.on('finish', () => {
            if (server.queue[0]) {
                server.currentVideo = server.queue[0];
                return this.runVideo(message, connection, server.currentVideo.url);
            }
        });
        return message.say(":notes: Lecture en cours de : " + "`" + server.currentVideo.title + "`")
    }
}
