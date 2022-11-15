const { ChatInputCommandInteraction } = require('discord.js')

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     *
     */
    execute(interaction, client) {
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
}
