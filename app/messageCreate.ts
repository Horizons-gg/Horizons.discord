import App from './'

import Discord from 'discord.js'
import Ticket from './tickets'



export default async function (message: Discord.Message<boolean>) {

    const channel = message.channel
    const user = message.author

    if (message.author.bot) return


    if (channel.type === Discord.ChannelType.GuildText) {
        if (channel.parentId === App.config.support.open || channel.parentId === App.config.support.closed) {
            let data = await Ticket.fetchData(channel as Discord.TextChannel)
            if (data[1] !== user.id) return
            if (data[2] !== 'null') return

            data[2] = message.id
            Ticket.update(channel as Discord.TextChannel, { description: message.content })
            Ticket.updateData(channel as Discord.TextChannel, data)
        }
    }

}