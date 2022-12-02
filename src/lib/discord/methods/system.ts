//? Dependencies

import Discord from 'discord.js'

let Mode = {}



//? Method

export default function main(id: string, Host: string, Tag: string) {

    if (!Bots[id]) return
    const Client = Bots[id]

    if (!Mode[id]) Mode[id] = 0


    fetch(`http://${Host}`)
        .then(res => res.json())
        .then(json => {

            Systems[Tag] = json

            setTimeout(main.bind(null, id, Host), 1000 * 10)
            Client.user.setStatus('online')

            if (Mode[id] === 0) {
                Mode[id] = 1
                Client.user.setActivity(`${json.Network.latency}ms to ${json.Location.city || 'City'}`, { type: Discord.ActivityType.Watching })
                return
            }
            if (Mode[id] === 1) {
                Mode[id] = 2
                Client.user.setActivity(`${Math.round(json.CPU.usage)}% CPU Usage`, { type: Discord.ActivityType.Watching })
                return
            }
            if (Mode[id] === 2) {
                Mode[id] = 0
                Client.user.setActivity(`${json.Memory.used}GB / ${Math.round(json.Memory.total)}GB`, { type: Discord.ActivityType.Watching })
                return
            }
        })
        .catch(err => {

            Systems[Tag] = null

            setTimeout(main.bind(null, id, Host), 1000 * 10)

            Client.user.setStatus('dnd')
            Client.user.setActivity('Connection Error', { type: Discord.ActivityType.Watching })
        })

}