import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, TextChannel } from "discord.js";
import { DiscordClient } from "../../Utils/DiscordClient";

export const data = new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for the rw role!')

export async function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    const channel = client.channels.cache.find((channel: any) => channel.topic === interaction.member?.user.id) as TextChannel;
    if(channel) return interaction.reply({
        content: "You have already made a ticket, you cannot make another one.",
        ephemeral: true
    })

    const modal = new ModalBuilder()
        .setCustomId(`application`)
        .setTitle(`RW Application`);

    const finding = new TextInputBuilder()
    .setCustomId(`finding`)
    .setLabel(`How I found the IP`)
    .setMaxLength(1024)
    .setMinLength(100)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(`Explain how you have found the IP of the LiveOverflow server!`)
    .setRequired(true);

    const challenges = new TextInputBuilder()
    .setCustomId(`challenges`)
    .setLabel(`Solved Challenges`)
    .setMinLength(10)
    .setMaxLength(1024)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(`How and which challenges have you solved, if possible link a repo with your code`)
    .setRequired(true);

    const info = new TextInputBuilder()
    .setCustomId(`info`)
    .setLabel(`GUIDELINES`)
    .setMinLength(1)
    .setMaxLength(1230)
    .setRequired(false)
    .setStyle(TextInputStyle.Paragraph)
    .setValue(`   READ ME - THIS WILL NOT BE SUBMITTED\n\nThis command lets you apply for the rw role which lets you access solutions to problems and chat to others who have the same role\n\nYou must explain which problems you solved and how you solved them\nPlease do not apply immediately after joining the server.\n\n    READ FROM TOP`)

    const inforow = new ActionRowBuilder().addComponents(info);
    const row1 = new ActionRowBuilder().addComponents(finding);
    const row2 = new ActionRowBuilder().addComponents(challenges);

    //@ts-ignore
    modal.addComponents(inforow, row1, row2);

    await interaction.showModal(modal);
}