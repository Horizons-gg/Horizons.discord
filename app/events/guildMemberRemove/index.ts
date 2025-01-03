import Discord from 'discord.js'
import App from 'app'

import Colors from 'lib/colors.ts'



export default function (member: Discord.GuildMember | Discord.PartialGuildMember) {

    const Landing = App.channel(App.config.channels.landing) as Discord.TextChannel

    Landing.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(Colors.danger)
                .setDescription(`${member.user.username} left the server`)
        ]
    })

}