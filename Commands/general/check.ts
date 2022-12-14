import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User, TextChannel } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';

export const data = new SlashCommandBuilder()
    .setName('check')
    .setDescription('Do you have the right ip? Check with this command')
    .addStringOption((o) => o.setName(`ip`).setDescription(`Put the ip here (no port needed!)`).setRequired(true))

export function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    const user = interaction.member?.user;
    if(!(user instanceof User)) return;

    if(client.config.cooldown.enabled && client.cooldowns.includes(`${user.tag}`)) {
        return interaction.reply({
            content: ` 🔴 **Please wait! This command is on cooldown!**`,
            ephemeral: true
        })
    }

    const ip = interaction.options.getString("ip") || "null";
    const embed = new EmbedBuilder();

    embed.setTitle(ip.includes(client.config.ips.main) ? "✅ Correct IP! Congrats!" : ip.includes(client.config.ips.n00b) ? "✅ N00bBot Proxy Found!" : "❌ Incorrect IP! Keep searching!");
    embed.setColor(ip.includes(client.config.ips.main) || ip.includes(client.config.ips.n00b) ? "#9d3838" : "#00ff00");
    
    client.cooldowns = [...client.cooldowns, `${user.tag}`];
    setTimeout(() => {
        client.cooldowns = client.cooldowns.filter((v) => v !== `${user.tag}`);
    }, client.config.cooldown.time * 1000)

    interaction.reply({
        embeds: [ embed ],
        ephemeral: true
    })

    const channel = client.channels.cache.find((channel: any) => channel.topic === interaction.member?.user.id) as TextChannel;
    
    channel?.send({
        embeds: [ embed ]
    })
}