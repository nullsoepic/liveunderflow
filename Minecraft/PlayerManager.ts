import { EmbedBuilder, Message } from 'discord.js';
import { uploadImage } from '../Functions/uploadImage';
import { DiscordClient } from '../Utils/DiscordClient';
import { MinecraftClient } from '../Utils/MinecraftClient';
import { Player } from './Player';

type CountCache = {
    count?: number,
    message?: Message
}

export class PlayerManager {
    private client: DiscordClient;
    private bot: MinecraftClient;
    private players: Map<string, Player>;
    public joinCache: Map<string, CountCache>;
    public leaveCache: Map<string, CountCache>;

    constructor(client: DiscordClient) {
        this.client = client;
        this.bot = client.bot;
        this.players = new Map();
        this.joinCache = new Map();
        this.leaveCache = new Map();

        setInterval(() => {
            this.joinCache = new Map();
            this.leaveCache = new Map();
        }, 60 * 1000 * 5)

        // Adds a player to the list of players on join and removes them on leave
        this.bot.on('player_info', async (packet) => {
            const { data } = packet;
            switch (packet.action) {
                case 0:
                    const player = new Player(data[0]?.name, data[0]?.UUID, this.bot);
                    this.players.set(data[0]?.UUID, player);
                    this.loadPicture(player);
                    break;
                case 4:
                    this.logLeave(this.getPlayerByUUID(data[0]?.UUID))
                    break;
            }
        });
    }

    async loadPicture(player: Player) {
        if(this.bot.profileCache.has(player.uuid)) return;
        //Filters out a lot of unecessary stuff like noob bots
        if(this.client.config['in-game-bot'].muted.find((entry) => entry.name === player.name)) return;
        const image = await player.downloadImage();
        const attachments = await uploadImage(image, this.client);
        return this.bot.profileCache.set(player.uuid, attachments[0].url);
    }

    async logLeave(player: Player | undefined) {
        if (this.client.config['in-game-bot'].muted.find((entry) => entry.name === player?.name)) return;
        const uuid = player?.uuid || '';

        if(this.leaveCache.has(uuid)) {
            const entry = this.leaveCache.get(uuid)
            this.leaveCache.set(uuid, {
                count: (entry?.count || 1) + 1,
                message: entry?.message
            })
            
            const embed = new EmbedBuilder()

            embed.setAuthor({
                name: entry?.message?.embeds[0].author?.name || 'John Doe',
                iconURL: entry?.message?.embeds[0].author?.iconURL
            })
            embed.setDescription(`${player?.name} has left the game. (${(entry?.count || 1) + 1})`)
            embed.setColor('#9d3838')

            return entry?.message?.edit({
                embeds: [embed]
            })
        };

        const message = await this.client.sendEmbedMessage(
            this.client.config.guild.channels.relay_channel,
            player?.name || 'John Doe',
            `${player?.name} has left the game.`,
            player?.getHeadURL() || this.client.config.constants.defaultProfile,
            '#9d3838'
        );

        this.leaveCache.set(uuid || '', {
            count: 1,
            message: message
        })
        this.players.delete(uuid || '');
    }

    // Returns a Map of online players
    getPlayers() {
        return this.players;
    }

    // Returns an Array of online players
    getPlayerArray() {
        return Array.from(this.getPlayers().values());
    }

    getPlayerByName(name: string) {
        return this.getPlayerArray().find((player) => player.name === name);
    }

    getPlayerByUUID(uuid: string) {
        return this.getPlayerArray().find((player) => player.uuid === uuid);
    }
}
