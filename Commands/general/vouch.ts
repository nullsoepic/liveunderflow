import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, GuildMemberRoleManager, TextChannel } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';

export const data = new SlashCommandBuilder()
    .setName('vouch')
    .setDescription('Vouch for someone else to get the rw role!')
    .addUserOption((o) => o.setName(`user`).setDescription(`Who do you want to vouch for?`).setRequired(true))


export async function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    const embed = new EmbedBuilder()
    
    //@ts-ignore
    if(!(interaction.member.roles as GuildMemberRoleManager).cache.has(r => r.id === client.config.guild.roles.rw)) {
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
    
    if(member.id === interaction.user.id) {
        embed.setTitle(`You can't vouch for yourself!`);
        embed.setColor(`Red`);
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        return true;
    }

    const channel = client.channels.cache.find((channel: any) => channel.topic === user.id) as TextChannel;
    if(!channel) return interaction.reply({
        content: "This user does not have a ticket.",
        ephemeral: true
    })

    member.roles.add(interaction.guild?.roles.cache.find(r => r.id === client.config.guild.roles.rw))
    embed.setTitle(`Thanks for vouching!`);
    embed.setDescription(`The member has recieved their role!`);
    embed.setColor(`Green`);

    const chan = client.channels.cache.find(c => c.id === client.config.guild.channels.log_channel)
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
