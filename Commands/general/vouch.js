const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Vouch for someone else to get the rw role!')
    .addUserOption((o) => o.setName(`user`).setDescription(`Who do you want to vouch for?`).setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        let e = new EmbedBuilder()
        
        if(interaction.guild.roles.cache.some(r => r.id === client.config.guild.roles.rw)) {
            let user = interaction.options.getMember(`user`);
            if(user.id === interaction.member.id) {
                e.setTitle(`You can't vouch for yourself!`);
                e.setColor(`Red`);
                interaction.reply({
                    embeds: [e],
                    ephemeral: true
                })

                return true;
            }
            user.roles.add(interaction.guild.roles.cache.find(r => r.id === client.config.guild.roles.rw))
            e.setTitle(`Thanks for vouching!`);
            e.setDescription(`The member has recieved their role`);
            e.setColor(`Green`);

        } else {
            e.setTitle(`You can't vouch.`);
            e.setDescription(`Only users who have the \`rw\` role can vouch for others!`);
            e.setColor(`Red`);
        }

        let chan = client.channels.cache.find(c => c.id === client.config.guild.channels.vouchchan)
        chan.send({
            embeds: [new EmbedBuilder().setDescription(`**${interaction.member.user.tag} vouched for ${user.tag}**`)]
        })

        interaction.reply({
                embeds: [e],
                ephemeral: true
            })
        }

}
