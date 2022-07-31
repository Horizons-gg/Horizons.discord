import { Bots } from '@app/discord'
import * as Gamedig from 'gamedig'
import * as Discord from 'discord.js'

export function main(id: string, Host: Array<string>) {

    if (!Bots[id]) return
    const Client = Bots[id]


    Gamedig.query({
        type: 'minecraft',
        host: Host[0],
        port: Host[1]
    }).then(state => {
        if (state.raw.vanilla.raw.players.online === 0) Client.user.setActivity('No Players Online', { type: Discord.ActivityType.Watching }), Client.user.setStatus('idle')
        else Client.user.setActivity(`${state.raw.vanilla.raw.players.online}/${state.raw.vanilla.raw.players.max}`, { type: Discord.ActivityType.Watching }), Client.user.setStatus('online')
    }).catch(error => {
        Client.user.setActivity({ name: 'Server Offline', type: Discord.ActivityType.Watching })
        Client.user.setStatus('dnd')
    }
    )

    setTimeout(main.bind(null, id, Host), 1000 * 30)
}