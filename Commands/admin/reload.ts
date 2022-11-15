import { SlashCommandBuilder } from 'discord.js';
import { loadCommands } from '../../Handlers/commandHandler';
import { loadEvents } from '../../Handlers/eventHandler';

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Dev Only: Reload commands!')
    //.setDefaultMemberPermissions(PermissionFlagsBits)
    .addSubcommand((options) => options.setName('events').setDescription('Reload Events'))
    .addSubcommand((options) => options.setName('commands').setDescription('Reload Commands')),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    execute(interaction, client) {
        const subCommand = interaction.options.getSubcommand();

        switch(subCommand) {
            case "events": {
                /**
                for(const [key,value] of client.events) {
                    client.removeListener(`${key}`, value, true);
                }
                */
                client.removeAllListeners()
                interaction.reply({content: ' 🟢 **Events Reloaded**', ephemeral: true});
                loadEvents(client);
            }
            break;
            case "commands": {
                loadCommands(client);
                interaction.reply({content: ' 🟢 **Commands Reloaded**', ephemeral: true});
            }
            break;
        }
    }

}