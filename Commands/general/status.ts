import { SlashCommandBuilder, EmbedBuilder, ActivityType, ChatInputCommandInteraction } from 'discord.js';
import axios from 'axios';
import { DrippyClient } from '../../Utils/DrippyClient';

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
            embed.setDescription(client.config['in-game-bot'].enabled ? `Online Players:\n${Array.from(client.bot.playerManager.getPlayers().values()).map((player) => player.name).join('\n - ')}` : `Current server status.`)


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

    interaction.editReply({
        embeds: [embed],
    })
}