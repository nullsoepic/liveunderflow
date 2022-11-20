import { SlashCommandBuilder, EmbedBuilder, ActivityType, ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import axios from 'axios';
import { DrippyClient } from '../../Utils/DrippyClient';
import { read, MIME_PNG } from 'jimp';
import { Player } from '../../Minecraft/Player';
import { groupByN } from '../../Utils/Sort';

export const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the server status!');

export async function execute(interaction: ChatInputCommandInteraction, client: DrippyClient) {
    await interaction.deferReply({
        ephemeral: true
    })

    const embed = new EmbedBuilder()
    const guild = await client.guilds.cache.find(g => g.id === client.config.guild.id)
    const channel = await guild?.channels.cache.find(c => c.id === client.config.guild.channels.statchan);

    try {
        const ip = client.config.ips.main;
        const url = `https://api.mcsrvstat.us/2/${ip}`;
    
        const { data } = await axios.get(url);

        if (!data.online) {
            client.user?.setStatus('dnd');
            client.user?.setActivity(`OFFLINE`, {type: ActivityType.Playing});
            channel?.setName(`🔴 OFFLINE`)
            embed.setColor(`Red`)
            embed.setTitle(`LiveOverflow SMP • OFFLINE`)
            embed.setDescription(`The server is currently offline`)
        } else {
            client.user?.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
            embed.setTitle(`LiveOverflow SMP • ${data.players.online}/${data.players.max}`)
            if(client.config['in-game-bot'].enabled) embed.setImage(`attachment://tab.png`)
            else embed.setDescription(`Current server status.`)


            if(data.players.online >= data.players.max) {
                channel?.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                client.user?.setStatus('idle');
                embed.setColor(`Orange`)
            } else {
                channel?.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                client.user?.setStatus('online');
                embed.setColor(`Green`)
            }
        }
    } catch(error) {
        console.error(error)
    }

    if(client.config['in-game-bot'].enabled) interaction.editReply({
        embeds: [embed],
        files: [await renderTabImage(client.bot.playerManager.getPlayerArray())]
    })
    else interaction.editReply({
        embeds: [embed],
    })
}

async function renderTabImage(players: Player[]) {
    const grouping = groupByN(10, players).filter((row) => row.filter(player => !player.name.startsWith('N00bBot')));
    const canvas = await read(2000, (grouping.length * 180) + grouping.length * 20, '#36393e');
    
    for(var i = 0; i < grouping.length; i++) {
        const group = grouping[i];
        for(var l = 0; l < group.length; l++) {
            const player = group[l];

            const image = await player.downloadImage();
            if(!image) continue;
            const mathX = (l * 180) + (l * 20);
            const mathY = (i * 180) + (i * 20);
            canvas.composite(image, mathX, mathY);
        }
    }
    const imageBuffer = await canvas.getBufferAsync(MIME_PNG);
    return new AttachmentBuilder(imageBuffer, { name: 'tab.png' })
}