import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { loadCommands } from '../../Handlers/commandHandler';
import { loadEvents } from '../../Handlers/eventHandler';
import { DiscordClient } from '../../Utils/DiscordClient';

export const developer = true;

export const data = new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Dev Only: Reload commands!')
    //.setDefaultMemberPermissions(PermissionFlagsBits)
    .addSubcommand((options) => options.setName('events').setDescription('Reload Events'))
    .addSubcommand((options) => options.setName('commands').setDescription('Reload Commands'))

export function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    const subCommand = interaction.options.getSubcommand();

    switch(subCommand) {
        case "events":
            client.removeAllListeners()
            interaction.reply({content: ' 🟢 **Events Reloaded**', ephemeral: true});
            loadEvents(client);
            break;
        case "commands":
            loadCommands(client);
            interaction.reply({content: ' 🟢 **Commands Reloaded**', ephemeral: true});
            break;
    }
}