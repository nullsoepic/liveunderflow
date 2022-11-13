const fs = require('fs')

module.exports = {
    name: "messageCreate",
    execute(message, client) {
		if(blacklist(message.content)) {
			message.delete()
			message.channel.send({content: `:x: Your message contained a blacklisted phase ${message.member.tag}`})
		}

		function blacklist(string) {
			return new RegExp(`(?:${client.config.filter.join("|")})`, "gi").test(string) ? true : false
		}
		
    }
}
