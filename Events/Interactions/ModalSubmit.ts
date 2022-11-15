const { EmbedBuilder } = require('@discordjs/builders');
import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(!interaction.isModalSubmit()) return;

        if(interaction.customId === `application`) {
            let finding = interaction.fields.getTextInputValue(`finding`);
            let challenges = interaction.fields.getTextInputValue(`challenges`);

            let embed = new EmbedBuilder()
            .setTitle(`${interaction.member.user.tag} - Application`)
            .addFields(
                { name: `Finding the IP`, value: finding },
                { name: `Challenges`, value: challenges }
            )
            .setTimestamp()

            let cat = client.channels.cache.find(c => c.id === client.config.guild.channels.appcat)
            let chan = await cat.children.create({
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

            let btns = new ActionRowBuilder()
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

            let m = await chan.send({
                content: `Thank you for applying **${interaction.member.nickname}**!\nYou may be asked some extra questions\nPlease be patient. Thank you!\nUser ID: \`${interaction.member.user.id}\``,
                embeds: [embed],
                components: [btns],
            }).catch(console.error);

            let applink = `https://discord.com/channels/${client.config.guild.id}/${chan.id}/${m.id}`;

            await interaction.reply({content: `Thank you for applying! Your application has been sent for review! To view it click **[here](${applink})**`, ephemeral: true})
        }
    }
}
