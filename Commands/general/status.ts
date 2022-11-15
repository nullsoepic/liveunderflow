import { SlashCommandBuilder, EmbedBuilder, ActivityType } from 'discord.js';
import axios from 'axios';

module.exports = {
    data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the server status!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: true
        })

        const embed = new EmbedBuilder()
        const guild = await client.guilds.cache.find(g => g.id === client.config.guild.id)
        const channel = await guild.channels.cache.find(c => c.id === client.config.guild.channels.statchan);

        try {
            const ip = client.config.ips.main;
            const url = `https://api.mcsrvstat.us/2/${ip}`;
        
            const { data } = await axios.get(url);

            if (!data.online) {
                client.user.setStatus('dnd');
                client.user.setActivity(`OFFLINE`, {type: ActivityType.Playing});
                channel.setName(`🔴 OFFLINE`)
                embed.setColor(`Red`)
                embed.setTitle(`LiveOverflow SMP • OFFLINE`)
                embed.setDescription(`The server is currently offline`)
            } else {
                client.user.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
                embed.setTitle(`LiveOverflow SMP • ${data.players.online}/${data.players.max}`)
                embed.setDescription(`Current server status`)
                if(data.players.online >= data.players.max) {
                    channel.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                    client.user.setStatus('idle');
                    embed.setColor(`Orange`)
                } else {
                    channel.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                    client.user.setStatus('online');
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

}
