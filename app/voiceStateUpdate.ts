import App from './'

import Discord from 'discord.js'
import Colors from '@lib/colors'
import Ticket from './tickets'



export default async function (oldState: Discord.VoiceState, newState: Discord.VoiceState) {

    const channels = App.guild().channels
    const parent = App.channel(App.config.clickNcreate).parent as Discord.CategoryChannel
    const member = newState.member


    if (oldState.channel?.parentId !== parent.id && newState.channel?.parentId !== parent.id) return

    if (newState.channel?.id === App.config.clickNcreate) {
        const vc = await channels.create({
            name: `${member?.user.username} Channel`,
            type: Discord.ChannelType.GuildVoice,
            parent: parent.id,
        })

        member?.voice.setChannel(vc)
    }

    if (oldState.channel?.members.size === 0 && oldState.channel?.id !== App.config.clickNcreate) {
        oldState.channel.delete()
    }

}