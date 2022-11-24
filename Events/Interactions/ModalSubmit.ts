import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';

export const name = "interactionCreate";
export async function execute(interaction, client: DiscordClient) {
    if(!interaction.isModalSubmit()) return;

    if(interaction.customId === `application`) {
        const finding = interaction.fields.getTextInputValue(`finding`);
        const challenges = interaction.fields.getTextInputValue(`challenges`);

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.member.user.tag} - Application`)
        .addFields(
            { name: `Finding the IP`, value: finding },
            { name: `Challenges`, value: challenges }
        )
        .setTimestamp()

        const cat = client.channels.cache.find(c => c.id === client.config.guild.channels.app_category) as CategoryChannel
        const chan = await cat?.children?.create({
            name: `${interaction.member.user.tag}`,
            type: ChannelType.GuildText,
            topic: `${interaction.member.user.id}`,
            reason: `RW Role application channel`,
            permissionOverwrites: [{
                id: interaction.member.user.id,
                allow: [PermissionFlagsBits.ViewChannel, 
                        PermissionFlagsBits.SendMessages]
            },
            {
                id: interaction.guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: client.config.guild.roles.rwx,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages]
            },
            {
                id: client.config.guild.roles.rw,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
            }]
        })

        const btns = new ActionRowBuilder()
        btns.addComponents(
            new ButtonBuilder()
            .setCustomId(`apply:close`)
            .setLabel(`Close`)
            .setStyle(ButtonStyle.Danger)
            .setEmoji(`⛔`)
        )

        btns.addComponents(
            new ButtonBuilder()
            .setCustomId(`apply:approve`)
            .setLabel(`Approve`)
            .setStyle(ButtonStyle.Success)
            .setEmoji(`✅`)
        )

        const m = await chan.send({
            content: `Thank you for applying **${interaction.member.nickname || interaction.member.user.tag}**!\nYou may be asked some extra questions\nPlease be patient. Thank you!\nUser ID: \`${interaction.member.user.id}\``,
            embeds: [embed],
            //@ts-ignore
            components: [btns],
        }).catch(console.error);

        //@ts-ignore
        const applink = `https://discord.com/channels/${client.config.guild.id}/${chan.id}/${m.id}`;

        await interaction.reply({content: `Thank you for applying! Your application has been sent for review! To view it click **[here](${applink})**`, ephemeral: true})
    }
}