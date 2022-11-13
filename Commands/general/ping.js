const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('A simple ping command!'),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const date = Date.now()
        let embed = new EmbedBuilder()
        .setTitle('🟢 Pong!')
        .setDescription(`**< Ping >** \n${date - interaction.createdTimestamp}ms`)
        .setColor('Green')
        .setFooter({
            text: `${client.config.name} - API Latency`
        })
        if(date - interaction.createdTimestamp > 90) {
            embed.setColor('Orange')
            embed.setTitle('🟠 Pong!')
        } else if (date - interaction.createdTimestamp > 180) {
            embed.setColor('Red')
            embed.setTitle('🔴 Pong!')
        }

        interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }

}
