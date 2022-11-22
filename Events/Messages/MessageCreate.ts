import { DiscordClient } from "../../Utils/DiscordClient"

export const name = "messageCreate"
export function execute(message, client: DiscordClient) {
	if(blacklist(message.content)) {
		message.delete()
		message.channel.send({content: `:x: Your message contained a blacklisted phase ${message.member.tag}`})
	}

	function blacklist(string: string) {
		return new RegExp(`(?:${client.config.filter.join("|")})`, "gi").test(string) ? true : false
	}
}