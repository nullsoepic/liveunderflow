const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client, ActivityType } = require('discord.js')
const axios = require('axios');

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
        await interaction.deferReply()

        let emb = new EmbedBuilder()
        let g = await client.guilds.cache.find(g => g.id === client.config.guild.id)
        let chan = await g.channels.cache.find(c => c.id === client.config.guild.channels.statchan);

        try {
            let ip = client.config.ips.main;
            let url = `https://api.mcsrvstat.us/2/${ip}`;
        
            await axios.get(url)
            .then(function (res) {
                let data = res.data;
                if (data.online === false) {
                    client.user.setStatus('dnd');
                    client.user.setActivity(`OFFLINE`, {type: ActivityType.Playing});
                    chan.setName(`🔴 OFFLINE`)
                    emb.setColor(`Red`)
                    emb.setTitle(`LiveOverflow SMP • OFFLINE`)
                    emb.setDescription(`The server is currently offline`)
                } else {
                    client.user.setActivity(`${data.players.online}/${data.players.max} players`, { type: ActivityType.Watching });
                    emb.setTitle(`LiveOverflow SMP • ${data.players.online}/${data.players.max}`)
                    emb.setDescription(`Current server status`)
                    if(data.players.online == data.players.max) {
                        chan.setName(`🟠 ${data.players.online}/${data.players.max} Players`)
                        client.user.setStatus('idle');
                        emb.setColor(`Orange`)
                    } else {
                        chan.setName(`🟢 ${data.players.online}/${data.players.max} Players`)
                        client.user.setStatus('online');
                        emb.setColor(`Green`)
                    }
                }
            })
        } catch {
            console.error
        }

        interaction.editReply({
            embeds: [emb]
        })
    }

}
