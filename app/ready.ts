import App from 'app'
import config from 'config'

import Discord from 'discord.js'
import { commands } from 'discord/commands'

import { NumberWithCommas } from 'lib/util.ts'



export default async function (client: Discord.Client) {

    console.info(`App Logged in as ${client.user?.tag}`)

    await App.client.application?.commands.set(commands).then(() => console.info(`Slash Commands Successfully Registered`))


    let Status = true
    const SwitchStatus = () => {
        client.user?.setPresence({
            status: 'online',
            activities: [{
                type: Discord.ActivityType.Watching,
                name: Status ? `${NumberWithCommas(client.guilds.cache.get(config.discord.guild)?.memberCount || 0)} Members` : `Message me for help!`
            }]
        }), Status = !Status
    }
    setInterval(SwitchStatus, 1000 * 15), SwitchStatus()

}