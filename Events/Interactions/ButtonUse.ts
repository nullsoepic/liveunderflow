import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder, TextChannel } from 'discord.js';
import { setTimeout } from 'node:timers/promises';
import { DiscordClient } from '../../Utils/DiscordClient';
const wait = setTimeout;

export const name = "interactionCreate";
export async function execute(interaction, client: DiscordClient) {
    if(!interaction.isButton()) return;
    const chan = client.channels.cache.find(c => c.id === client.config.guild.channels.log_channel)

    if(interaction.customId === `apply:close`) {
        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({
                content: `**You are not allowed to close this channel.**`,
                ephemeral: true
            })
        }

        interaction.reply({
            content: `⚠️ **Please confirm that you would like to delete the channel - <@${interaction.member.user.id}>.**`,
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId(`apply:close:confirm`)
                    .setLabel(`Confirm`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`💠`)
                ).addComponents(
                    new ButtonBuilder()
                    .setCustomId(`apply:close:cancel`)
                    .setLabel(`Cancel`)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(`❌`)
                )
            ]
        })
    }

    if(interaction.customId === `apply:approve`) {
        if(!interaction.member.roles.cache.find(r => r.id === client.config.guild.roles.rw)) {

            return interaction.reply({
                content: `You are not allowed to approve users for the RW role`,
                ephemeral: true
            })
        }
        
        if(interaction.channel.topic?.includes('Approved')) {
            return interaction.reply({
                content: `This application has already been approved!`,
                ephemeral: true
            })
        }

        const usr = interaction.guild.members.cache.find(m => m.id === interaction.channel.topic);
        usr.roles.add(interaction.guild.roles.cache.find(r => r.id === client.config.guild.roles.rw))
        interaction.reply({
            content: `**🥳 Congrats <@${usr.user.id}>! You have been approved for the \`rw\` role!**`
        })
        
        interaction.channel.setTopic(`${interaction.channel.topic} - Approved`, `The user has been approved`)
        
        if(chan instanceof TextChannel) chan?.send({
            embeds: [new EmbedBuilder().setDescription(`**${interaction.member.user.tag} approved: ${interaction.channel.name}**`)]
        })
    }

    if(interaction.customId === `apply:close:confirm`) {
        interaction.reply({
            content: `**Deletion Confirmed** - Deleting channel - <@${interaction.member.user.id}>`
        })
        await wait(3000)
        interaction.channel.delete()
        
        if(chan instanceof TextChannel) chan?.send({
            embeds: [new EmbedBuilder().setDescription(`**${interaction.member.user.tag} deleted channel: ${interaction.channel.name}**`)]
        })
    }

    if(interaction.customId !== `apply:close:cancel`) return;
    interaction.reply({
        content: `**✅ Deletion Canceled** - <@${interaction.member.user.id}>`
    })
}
