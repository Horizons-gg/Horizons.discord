import App from './'

import Message from '@lib/message'

import Discord from 'discord.js'
import Ticket from './tickets'
import Verification from './verify'
import Modmail from './modmail'



export default async function (message: Discord.Message<boolean>) {

    const guild = await App.guild()
    const channel = message.channel
    const user = message.author

    if (message.author.bot) return


    if (channel === guild.channels.cache.get(App.config.channels.mail)) Modmail.respond(message, message.author)

    if (channel.type === Discord.ChannelType.GuildText) {
        if (channel.parentId === App.config.support.open || channel.parentId === App.config.support.closed) {
            let data = await Ticket.fetchData(channel as Discord.TextChannel)
            if (data[1] !== user.id) return
            if (data[2] !== 'null') return

            data[2] = message.id
            Ticket.update(channel as Discord.TextChannel, { description: message.content })

            const staff = () => {
                switch (data[0]) {
                    default: return App.config.support.staff.general
                    case 'se': return App.config.support.staff.se
                    case 'rust': return App.config.support.staff.rust
                    case 'dayz': return App.config.support.staff.dayz
                    case 'mc': return App.config.support.staff.mc
                }
            }


            await channel.send(`>>> ### 🎫 Ticket Designation - ${Ticket.fetchService(data[0])}\n` + (data[3] === 'high' ? '@everyone' : '@here') + (staff() === null ? '' : ` <@&${staff()}>`))
            Ticket.updateData(channel as Discord.TextChannel, data)
        }
    }


    if (message.channel.type === Discord.ChannelType.DM && !message.author.bot) {

        const DevSpam = guild.channels.cache.find(channel => channel.name === '🪵logs') as Discord.TextBasedChannel
        if (!DevSpam) return channel.send('An error has occurred whilst trying to retrieve "DevSpam", please contact Koda for assistance.'), console.error('An error has occurred whilst trying to retrieve "DevSpam"')


        Verification.attempt(message.author.id, message.content)
            .then(() => {
                message.react('✅').catch(() => { })
                channel.send(Message.send({
                    variant: 'success',
                    title: 'Account Age Verified',
                    description: `Your Account Age has been successfully verified!`,
                    ephemeral: false
                }))

                Message.notify({
                    variant: 'success',
                    title: `${message.author.username} has Verified their Account Age ✅`,
                    description: `${message.author} has successfully verified their account age!`,
                    color: 'success'
                })
            })
            .catch((error: string) => {
                const Data = error.split('-')

                if (Data[0] === 'NO_SESSION') Modmail.send(message.content, message.author)
                if (Data[0] === 'INVALID_KEY') message.react('❌').catch(() => { }), Message.notify({
                    title: `${message.author.username} Entered Incorrect Validation Code 💢`,
                    description: `${message.author} has entered the incorrect code to verify their account age!\n\nCode Entered by User: \`${Data[2]}\`\nValidation Code: \`${Data[1]}\``,
                    color: 'warning'
                })
            })
    }

}