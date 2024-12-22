import Discord from 'discord.js'
import { Bot } from '../'

import Gamedig from 'gamedig'



export default async function initialize(bot: Bot) {

    async function fetchData() {
        return await Gamedig.query({
            type: 'minecraft',
            host: bot.address[0],
            port: bot.address[1]
        })
            .then(data => data)
            .catch(() => null)
    }

    async function updatePresence(data: any) {
        const content = (): [string, Discord.ActivityType, Discord.PresenceStatusData] => {
            if (!data) return ['Server Offline', Discord.ActivityType.Watching, 'dnd']
            if (data.raw.vanilla.raw.players.online === 0) return ['No Players Online', Discord.ActivityType.Watching, 'idle']
            else return [`${data.raw.vanilla.raw.players.online} / ${data.raw.vanilla.raw.players.max} Players`, Discord.ActivityType.Watching, 'online']
        }

        const presence = content()
        await bot.client.user?.setActivity(presence[0], { type: presence[1] })
    }


    bot.client.user?.setActivity('Initializing...', { type: Discord.ActivityType.Watching })
    bot.client.user?.setStatus('idle')

    setInterval(async () => {
        const data = await fetchData()
        updatePresence(data)
    }, 1000 * 10)

}