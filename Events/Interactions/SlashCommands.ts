import { ChatInputCommandInteraction } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';

export const name = "interactionCreate";
export function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    if(!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) {
        return interaction.reply({
            content: " 🔴 **This command is unavailable**",
            ephemeral: true
        });
    };

    if(command.developer && interaction.user.id !== client.config.dev) {
        return interaction.reply({
            content: " 🔴 **This command is developer only**",
            ephemeral: true
        });
    };

    command.execute(interaction, client);
}