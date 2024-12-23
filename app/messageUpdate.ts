import App from './'

import Discord from 'discord.js'
import Colors from '@lib/colors'
import Ticket from './tickets'



export default function (oldMessage: Discord.Message<boolean> | Discord.PartialMessage, newMessage: Discord.Message<boolean> | Discord.PartialMessage) {

    // if (oldMessage.author?.bot) return
    if (oldMessage.content === newMessage.content) return
    if (oldMessage.channel.isDMBased()) return
    if (oldMessage.channel.parentId !== App.config.support.open && oldMessage.channel.parentId !== App.config.support.closed) return



}