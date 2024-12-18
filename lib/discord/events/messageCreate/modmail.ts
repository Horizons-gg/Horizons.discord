//? Dependencies

import Discord from 'discord.js'

import * as Colors from '@lib/discord/colors'
import * as Messages from '@lib/discord/messages'
import GuildRaw from '@lib/discord/common/guild'
import * as Verification from '@lib/discord/common/verify'



//? Send to Modmail

export async function Send(message: string, user: Discord.User) {

    if (message.length <= 0) return
    if (message.length > 1900) return user.send('Your message is too long!')

    const Guild = await GuildRaw()

    const Modmail = Guild.channels.cache.find(channel => channel.name === '📬mail') as Discord.GuildTextBasedChannel
    if (!Modmail) return console.error('Unable to find Modmail Channel!') //todo: send error to user

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


//? Respond to User

export async function Respond(message: Discord.Message, sender: Discord.User) {

    if (message.author.bot) return
    if (message.content.length <= 0) return
    if (message.content.length > 1900) return message.reply('Your message is too long!')

    const Guild = await GuildRaw()
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
                .setColor(Colors.success)
                .setTimestamp(new Date())
        ]
    })
    .then(() => message.react('📨'))
    .catch(() => {
        message.react('⚠️').catch(() => { })
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setDescription(`Unable to send message to ${User}!\nThey likely have server DM's Disabled, please contact them directly.`)
                    .setColor(Colors.danger)
            ]
        })
    })

}