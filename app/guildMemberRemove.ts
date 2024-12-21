import App from './'

import Discord from 'discord.js'
import Colors from '@lib/colors'



export default function (member: Discord.GuildMember | Discord.PartialGuildMember) {

    const Landing = App.channel(App.config.channels.landing) as Discord.TextBasedChannel

    
    Landing.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(Colors.danger)
                .setDescription(`${member.user.username} left the server`)
        ]
    })

}