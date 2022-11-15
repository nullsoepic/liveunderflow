import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { DrippyClient } from '../../Utils/DrippyClient';

export const data = new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Vouch for someone else to get the rw role!')
    .addUserOption((o) => o.setName(`user`).setDescription(`Who do you want to vouch for?`).setRequired(true))


export async function execute(interaction: ChatInputCommandInteraction, client: DrippyClient) {
    const embed = new EmbedBuilder()
    
    if(!interaction.guild?.roles.cache.some(r => r.id === client.config.guild.roles.rw)) {
        embed.setTitle(`You can't vouch.`);
        embed.setDescription(`Only users who have the \`rw\` role can vouch for others!`);
        embed.setColor(`Red`);
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return true;
    }
    //@ts-ignore
    const member: any = interaction.options.getMember(`user`);

    const { user } = member;
    //@ts-ignore
    if(member.id === interaction.member?.id) {
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

    const chan = client.channels.cache.find(c => c.id === client.config.guild.channels.vouchchan)
    //@ts-ignore
    chan?.send({
        //@ts-ignore
        embeds: [new EmbedBuilder().setDescription(`**${interaction.member?.user.tag} vouched for ${user.tag}**`)]
    })

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}