import Discord from 'discord.js'
import { Bot } from '../'



export default async function initialize(bot: Bot) {

    async function fetchData() {
        return await fetch(`http://${bot.address.join(':')}`)
            .then(res => res.json())
            .catch(() => null)
    }

    async function updatePresence(data: any, page: number) {
        const content = (): [string, Discord.ActivityType, Discord.PresenceStatusData] => {
            if (!data) return ['Connection Error', Discord.ActivityType.Watching, 'dnd']
            switch(page) {
                default: return ['Initializing...', Discord.ActivityType.Watching, 'idle']

                case 1: return [`${data.Network.latency}ms to ${data.Location.city || 'City'}`, Discord.ActivityType.Watching, 'online']
                case 2: return [`${Math.round(data.CPU.usage)}% CPU Usage`, Discord.ActivityType.Watching, 'online']
                case 3: return [`${data.Memory.used}GB / ${Math.round(data.Memory.total)}GB`, Discord.ActivityType.Watching, 'online']
            }
        }

        const presence = content()
        bot.client.user?.setActivity(presence[0], { type: presence[1] })
        bot.client.user?.setStatus(presence[2])
    }


    let page = 1
    bot.client.user?.setActivity('Initializing...', { type: Discord.ActivityType.Watching })
    bot.client.user?.setStatus('idle')

    setInterval(async () => {
        const data = await fetchData()
        updatePresence(data, page)
        page = page + 1 > 3 ? 1 : page + 1
    }, 1000 * 10)

}