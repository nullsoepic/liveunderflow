import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User, Colors } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';
import fs from 'fs';
import { whisperChat } from '../../Utils/IngameChat';
export const data = new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Yerify yourself with the ingame bot')
    .addStringOption((o) => o.setName(`code`).setDescription(`Put the code you recieved here.`).setRequired(true))

export function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
        const code = interaction.options.getString("code") || "null"
        let pending = fs.readFileSync(__dirname + "/../../Verification/pendingVerification.json","utf-8");
        let done = fs.readFileSync(__dirname + "/../../Verification/doneVerification.json","utf-8");
        var pendingData = JSON.parse(pending);
        var doneData = JSON.parse(done)
        var user = `${interaction.user.username}#${interaction.user.discriminator}`

        if (pendingData.hasOwnProperty(code)){
            const embed = new EmbedBuilder()
            embed.setColor(Colors.Green)
            embed.setTitle(`Ok. The account ${user} is now linked to ${pendingData[code]}`)
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            if (interaction.guild === null){
                return
            }
            // let verifiedRole =interaction.guild.roles.cache.find(r => r.id === client.config.guild.roles.verified)
            // if (verifiedRole === undefined){
            //     console.error("The verfied role doesnt exits or is not defined in the config")
            //     return
            // }
            // const usr = interaction.guild?.members.cache.find(m => m.id === interaction.user.username);
            // usr?.roles.add(verifiedRole).catch(console.error)

            //Ingame Verification Message
            const {bot} = client
            whisperChat(bot,"Your Verification Process is done. You are now verified as " + user, pendingData[code])

            doneData[user] = pendingData[code]
            delete pendingData[code]
            pendingData = JSON.stringify(pendingData)
            doneData = JSON.stringify(doneData)
            fs.writeFileSync(__dirname + "/../../Verification/pendingVerification.json",pendingData, { encoding: "utf-8" })
            fs.writeFileSync(__dirname + "/../../Verification/doneVerification.json",doneData, { encoding: "utf-8" })
        } else {
            const embed = new EmbedBuilder()
            embed.setColor(Colors.Red)
            embed.setTitle("This code doesnt exist.")
            interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }
    }