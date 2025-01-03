import Discord from 'discord.js'
import App from 'app'

import Verification from 'module/verification'

import Colors from 'lib/colors.ts'



export default function (member: Discord.GuildMember) {

    const Landing = App.channel(App.config.channels.landing) as Discord.TextChannel
    const General = App.channel(App.config.channels.general) as Discord.TextChannel


    Landing.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setColor(Colors.success)
                .setDescription(`<@${member.id}> (${member.user.username}) joined the server`)
        ]
    })

    General.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(`${member.user.username} has joined the server!`)
                .setDescription(`**${member.user.username}** just joined the Discord.`)
                .setThumbnail(member.user.avatarURL({ extension: 'jpg', 'size': 512 }))
                .setColor(member.displayColor)
        ]
    })
        .then(msg => setTimeout(() => msg.delete().catch(console.error), 1000 * 60 * 15))


    const AccountAge = (new Date().valueOf() - member.user.createdAt.valueOf()) / 1000 / 60 / 60 / 24
    if (AccountAge < 12) {
        try {
            Verification.initialize(member)
        } catch (err) {
            console.error(err)
        }
    }

}