import { DiscordClient } from '../Utils/DiscordClient';
import { makeid } from "../Utils/Hashing"
import { whisperChat } from "../Utils/IngameChat"
import fs from 'fs';
export function handleIngameCommands(client: DiscordClient) {
    const { bot } = client;
    bot.on("player_chat", data =>{
        var message = String(data.plainMessage);
        if (message.includes("?verify")){
            var username = JSON.parse(data.networkName).text
            var code = makeid(10)
            whisperChat(bot,"Your verification code is " + code + ". Use the /verify command in the discord to complete the verification.","Techfox")
            verification(username,code)
        }
    
    })
}


function verification(username:string,hash:string){
    let datajson = fs.readFileSync(__dirname + "/../Verification/pendingVerification.json","utf-8");
    let data = JSON.parse(datajson);  
    data[hash] = username
    data = JSON.stringify(data)
    fs.writeFileSync(__dirname + "/../Verification/pendingVerification.json",data, { encoding: "utf-8" })
}



