import { Bots } from '@app/discord'
import * as Discord from 'discord.js'

let Mode = {}


export function main(id: string, Host: string) {

    if (!Bots[id]) return
    const Client = Bots[id]

    if (!Mode[id]) Mode[id] = 0


    fetch(`http://${Host}`)
        .then(res => res.json())
        .then(json => {
            setTimeout(main.bind(null, id, Host), 1000 * 10)
            Client.user.setStatus('online')

            if (Mode[id] === 0) {
                Mode[id] = 1
                Client.user.setActivity(`${json.Network.latency}ms to ${json.Location.city || 'City'}`, { type: Discord.ActivityType.Watching })
                return
            }
            if (Mode[id] === 1) {
                Mode[id] = 2
                Client.user.setActivity(`${Math.round(json.CPU.usage)}% CPU Usage`)
                return
            }
            if (Mode[id] === 2) {
                Mode[id] = 0
                Client.user.setActivity(`${json.Memory.used}GB / ${Math.round(json.Memory.total)}GB`, { type: Discord.ActivityType.Watching })
                return
            }
        })
        .catch(err => {
            Client.user.setStatus('dnd')
            Client.user.setActivity('Connection Error', { type: Discord.ActivityType.Watching })
        })

}