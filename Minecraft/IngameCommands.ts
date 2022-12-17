import { DiscordClient } from '../Utils/DiscordClient';
import { MinecraftClient } from '../Utils/MinecraftClient';
import {hash, makeid} from "../Utils/Hashing"
import {writeChat, whisperChat} from "../Utils/IngameChat"
import fs from 'fs';
export function handleIngameCommands(client: DiscordClient) {
    const { bot } = client;
    bot.on("player_chat", data =>{
        var message = String(data.plainMessage);
        if (message.includes("?seed")){
            writeChat(bot,"Test")
        }
        if (message.includes("?discord")){
            writeChat(bot,"Invite: https://discord.gg/paCcuuP964")
        }
        if (message.includes("?verify")){
            var username = JSON.parse(data.networkName).text
            //console.log(JSON.parse(data.networkName).text)
            //var code = hash(username).substring(0,10)
            var code = makeid(10)
            whisperChat(bot,"Your verification code is " + code + ". Use the /verify command in the discord to complete the verification.","Techfox")
            //writeChat(bot,"Your verification code is " + code + ". Use the /verify command in the discord to complete the verification.")
            verification(username,code)
        }
    
    })
}


function verification(username:string,hash:string){
    let datajson = fs.readFileSync(__dirname + "/../Verification/pendingVerification.json","utf-8");
    let data = JSON.parse(datajson);  
    //var j = {hash:username}
    data[hash] = username
    //dataj.push(j)
    data = JSON.stringify(data)
    fs.writeFileSync(__dirname + "/../Verification/pendingVerification.json",data, { encoding: "utf-8" })
    //fs.writeFileSync("/../Verification/pendingVerification.json",data, { encoding: "utf-8" })
}



