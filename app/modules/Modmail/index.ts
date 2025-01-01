import Discord from 'discord.js'
import App from 'app'

import Colors from 'lib/colors.ts'



export function send(message: string, user: Discord.User) {

    if (message.length <= 0) return
    if (message.length > 1900) return user.send('Your message is too long!')

    const Guild = App.guild()

    const Modmail = Guild.channels.cache.get(App.config.channels.mail) as Discord.GuildTextBasedChannel
    if (!Modmail) return console.error('Unable to find Modmail Channel!')

    Modmail.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setAuthor({ name: `${user.displayName}  |  ${user.username}  |  ${user.id}`, iconURL: user.displayAvatarURL({ size: 64 }), url: `https://discordapp.com/users/${user.id}` })
                .setDescription(message)
                .setColor(Colors.info)
                .setTimestamp(new Date())
        ]
    })
    .then(() => {
        user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription(`Your message has been successfully sent to Modmail!`)
                    .setColor(Colors.success)
            ]
        })
    })

}


export async function respond(message: Discord.Message, sender: Discord.User) {

    if (message.author.bot) return
    if (message.content.length <= 0) return
    if (message.content.length > 1900) return message.reply('Your message is too long!')

    const Guild = App.guild()
    const Reference = message.channel.messages.cache.get(message.reference?.messageId as string) || await message.channel.messages.fetch(message.reference?.messageId as string)

    if (!Reference.id) return
    if (!Reference.embeds[0]) return
    if (!Reference.embeds[0].author?.name.includes('  |  ')) return

    const RawUserId = (Reference.embeds[0].author?.name as string).split('  |  ')[2]
    const User = (Guild.members.cache.get(RawUserId) || await Guild.members.fetch(RawUserId).catch(() => { }))?.user as Discord.User
    if (!User) return message.react('⛔').catch(() => { })

    User.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setAuthor({ name: `${sender.displayName}`, iconURL: sender.displayAvatarURL({ size: 64 }), url: `https://discordapp.com/users/${sender.id}` })
                .setDescription(message.content)
                .setColor(Colors.primary)
                .setTimestamp(new Date())
        ]
    })
    .then(() => message.react('📨'))
    .catch(() => {
        const channel = message.channel as Discord.TextChannel
        message.react('⚠️').catch(() => { })
        channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription(`Unable to send message to ${User}!\nThey likely have server DM's Disabled, please contact them directly.`)
                    .setColor(Colors.danger)
            ]
        })
    })

}


export default {
    send,
    respond
}