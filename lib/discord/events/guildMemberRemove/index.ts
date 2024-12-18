//? Dependencies

import Config from '@lib/config'

import Discord from 'discord.js'
import * as Colors from '@lib/discord/colors'



//? Handler

export default (member: Discord.GuildMember | Discord.PartialGuildMember) => {

    if (member.guild.id !== Config.discord.guild) return


    const LandingChannel = member.guild.channels.cache.find(channel => channel.name == "🪂joins-leaves") as Discord.TextBasedChannel

    if (LandingChannel) LandingChannel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(Colors.danger)
                .setDescription(`${member.user.username} left the server`)
        ]
    })

}