import Discord from 'discord.js'
import App from 'app'

import Message from 'lib/messages.ts'

import Modmail from 'module/modmail'
import Verification from 'module/verification'


export default async function (message: Discord.Message<boolean>) {

    const guild = App.guild()
    const channel = message.channel

    if (message.author.bot) return


    if (channel === App.channel(App.config.channels.mail)) Modmail.respond(message, message.author)

    if (channel.type === Discord.ChannelType.DM && !message.author.bot) {

        const Logs = guild.channels.cache.find(channel => channel.name === '🪵logs') as Discord.TextChannel
        if (!Logs) return channel.send('An error has occurred whilst trying to retrieve "LogsChannel", please contact Koda for assistance.'), console.error('An error has occurred whilst trying to retrieve "LogsChannel"')


        Verification.attempt(message.author.id, message.content)
            .then(() => {
                message.react('✅').catch(() => { })
                Message.send(channel, {
                    title: 'Account Age Verified',
                    description: `Your Account Age has been successfully verified!`,
                    color: 'success'
                })

                Message.send(App.channel(App.config.channels.logs) as Discord.TextChannel, {
                    title: `${message.author.username} has Verified their Account Age ✅`,
                    description: `${message.author} has successfully verified their account age!`,
                    color: 'success'
                })
            })
            .catch((error: string) => {
                const Data = error.split('-')

                if (Data[0] === 'NO_SESSION') Modmail.send(message.content, message.author)
                if (Data[0] === 'INVALID_KEY') message.react('❌').catch(() => { }), Message.send(App.channel(App.config.channels.logs) as Discord.TextChannel, {
                    title: `${message.author.username} Entered Incorrect Validation Code 💢`,
                    description: `${message.author} has entered the incorrect code to verify their account age!\n\nCode Entered by User: \`${Data[2]}\`\nValidation Code: \`${Data[1]}\``,
                    color: 'warning'
                })
            })
    }

}