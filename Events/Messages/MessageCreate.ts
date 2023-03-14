import { Message } from "discord.js"
import { DiscordClient } from "../../Utils/DiscordClient"

export const name = "messageCreate"
export function execute(message: Message, client: DiscordClient) {
	if(!blacklist(message.content)) return;
	message.delete()
	message.channel.send({content: `:x: Your message contained a blacklisted phase <@!${message.author.id}>!`})

	function blacklist(string: string) {
		return new RegExp(`(?:${client.config.filter.join("|")})`, "gi").test(string) ? true : false
	}
}