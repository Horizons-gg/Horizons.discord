import App from './'
import config from '@config'

import Discord from 'discord.js'
import Commands from './commands'

import { NumberWithCommas } from '@lib/util'



export default function (client: Discord.Client) {

    console.info(`App Logged in as ${client.user?.tag}`)

    App.client.application?.commands.set(Commands.commands).then(() => console.info(`Slash Commands Successfully Registered`))


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