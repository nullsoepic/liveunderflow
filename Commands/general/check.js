const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Do you have the right ip? Check with this command')
    .addStringOption((o) => o.setName(`ip`).setDescription(`Put the ip here (no port needed!)`).setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {
        if(client.config.cooldown.enabled && client.cooldowns.includes(`${interaction.member.user.tag}`)) {
            return interaction.reply({
                content: ` 🔴 **Please wait! This command is on cooldown!**`,
                ephemeral: true
            })
        }

        const ip = interaction.options.getString("ip")
        let embed = new EmbedBuilder()
        if(ip.includes(client.config.ips.main)) {
            embed.setTitle("✅ Correct IP! Congrats!")
        } else if(ip.includes(client.config.ips.n00b)) {
            embed.setTitle("✅ N00bBot Proxy Found!")
        } else {
            embed.setTitle("❌ Incorrect IP! Keep searching!")
        }

        client.cooldowns = [...client.cooldowns, `${interaction.member.user.tag}`]
        setTimeout(() => {
            client.cooldowns = client.cooldowns.filter(function(v) {
                return v !== `${interaction.member.user.tag}`;
            });
        }, client.config.cooldown.time * 1000)

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }

}
