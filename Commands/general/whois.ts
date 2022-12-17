import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, User, Colors } from 'discord.js';
import { DiscordClient } from '../../Utils/DiscordClient';
import fs from 'fs';
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
export const data = new SlashCommandBuilder()
    .setName('whois')
    .setDescription('Lookup a user by their IGN or Discord Name')
    .addStringOption((o) => o.setName(`type`).setDescription(`Lookup by minecraft or discord`).setRequired(true).addChoices({name:"Minecraft",value:"minecraft"},{name:"Discord",value:"discord"}))
    .addStringOption((o) => o.setName(`user`).setDescription(`If you chose minecraft: IGN; if you chose discord: Username#Discriminator`).setRequired(true))
export function execute(interaction: ChatInputCommandInteraction, client: DiscordClient) {
    const type = interaction.options.getString("type") || "null"
    const user = interaction.options.getString("user") || "null"
    let users = fs.readFileSync(__dirname + "/../../Verification/doneVerification.json","utf-8");
    var usersData = JSON.parse(users)
    const embed = new EmbedBuilder()
    switch (type.toLowerCase()){
        case "minecraft":{
            let discord = getKeyByValue(usersData,user)
            if (discord == undefined){
                embed.setColor(Colors.Red)
                embed.setTitle(`The Minecraft Account ${user} has not been verified yet or doesnt exist`)
            } else {
                embed.setColor(Colors.Green)
                embed.setTitle(`The Minecraft Account ${user} is linked to ${discord} on Discord.`)
            }
            break
        }
        case "discord":{
            if (usersData.hasOwnProperty(user)){
                let ingame = usersData[user]
                embed.setColor(Colors.Green)
                embed.setTitle(`The Account ${user} is linked to ${ingame} Ingame.`)
            } else {
                embed.setColor(Colors.Red)
                embed.setTitle(`The Account ${user} has not been verified yet or doesnt exist`)
            }
            break
        }
        default:{
            embed.setColor(Colors.Red)
            embed.setTitle("Please choose between the minecraft or the discord option when defining the type!")
            break
        }
    }
    interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}