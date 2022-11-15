import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

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
        const embed = new EmbedBuilder()
        
        if(!interaction.guild.roles.cache.some(r => r.id === client.config.guild.roles.rw)) {
            embed.setTitle(`You can't vouch.`);
            embed.setDescription(`Only users who have the \`rw\` role can vouch for others!`);
            embed.setColor(`Red`);
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return true;
        }

        const member = interaction.options.getMember(`user`);
        const { user } = member;
        if(member.id === interaction.member.id) {
            embed.setTitle(`You can't vouch for yourself!`);
            embed.setColor(`Red`);
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            return true;
        }

        member.roles.add(interaction.guild.roles.cache.find(r => r.id === client.config.guild.roles.rw))
        embed.setTitle(`Thanks for vouching!`);
        embed.setDescription(`The member has recieved their role!`);
        embed.setColor(`Green`);

        let chan = client.channels.cache.find(c => c.id === client.config.guild.channels.vouchchan)
        
        chan.send({
            embeds: [new EmbedBuilder().setDescription(`**${interaction.member.user.tag} vouched for ${user.tag}**`)]
        })

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}