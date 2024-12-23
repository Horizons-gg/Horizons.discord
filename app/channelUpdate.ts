import App from './'

import Discord from 'discord.js'
import Colors from '@lib/colors'
import Ticket from './tickets'



export default function (oldChannel: Discord.DMChannel | Discord.NonThreadGuildBasedChannel, newChannel: Discord.DMChannel | Discord.NonThreadGuildBasedChannel) {

    if (newChannel.isDMBased()) return
    

}