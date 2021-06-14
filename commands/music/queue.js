const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");
const { BotNotInVoiceChannel } = require('../../string.json');


module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: "Pour afficher la file d'attente.",
            args: [
                {
                    key: 'page',
                    prompt: "Quelle page veux tu afficher ?",
                    default: 1,
                    type: 'integer'
                }
            ]
        });
    }
    /**
     * 
     * @param {CommandoMessage} message 
     * @param {Number} query 
     */
    async run(message, { page }) {
        const server = message.client.server;

        if (!message.client.voice.connections.first()) {
            return message.say(BotNotInVoiceChannel);
        }

        const numberOfItems = 10;
        const startingItem = (page - 1) * 10;
        const queueLength = server.queue.length;

        var itemsPerPage = startingItem + numberOfItems;
        var totalPages = 1;

        var embed = new MessageEmbed()
            .setTitle(`File d'attente pour ${message.author.username}`)
            .setColor("PURPLE")
            .addField(":notes: Musique en cours d'écoute : ", `[${server.currentVideo.title}]` + `(${server.currentVideo.url})`);

        if (queueLength > 0)
            var value = "";

            if (queueLength > numberOfItems) {
                totalPages = Math.ceil(queueLength / numberOfItems);
            }

            if (page <= 0 || (page) > totalPages) {
                return message.say(":x: Cette page n'existe pas !");
            }

            if ( (queueLength -startingItem) < numberOfItems ) {
                itemsPerPage = (queueLength - startingItem) + startingItem;
            }

            for (let i = startingItem; i < itemsPerPage; i++) {
                const video = server.queue[i];
                value += "`" + (i + 1) + ".`[ " + video.title + "](" + video.url + ")\n";
            }
            embed.addField("A venir :", value);
            embed.setFooter(`Page ${page}/${totalPages}`);

            return message.say(embed);
        }
        
    }