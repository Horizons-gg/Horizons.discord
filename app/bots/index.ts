import config from '@config'
import Discord from 'discord.js'

import Method from './methods'



export class Bot {

    client: Discord.Client

    name: string
    token: string
    method: string
    address: [string, number]


    constructor(name: string, token: string, method: string, address: string) {
        this.name = name
        this.token = token
        this.method = method

        const [host, port] = address.split(':') as [string, string | number]
        this.address = [host, parseInt(port as string)]

        this.client = new Discord.Client({
            intents: [Discord.GatewayIntentBits.Guilds]
        })

        this.login()
    }


    async login() {
        await this.client.login(this.token)
            .then(() => console.log(`Bot "${this.name}" logged in as "${this.client.user?.tag}"`))
            .catch(console.error)

        this.client.on('ready', this.startup.bind(this))
    }


    async startup() {
        switch (this.method) {
            case 'system': return Method.system(this)

            default: {
                this.client.destroy()
                console.error(`Method "${this.method}" not found, shutting down "${this.name}"...`)
                return
            }
        }
    }


}


export default function initialize() {
    for (const bot of config.bots) {

        if (!bot.enabled) {
            console.warn(`Bot "${bot.name}" is disabled, skipping...`)
            continue
        }

        new Bot(bot.name, bot.token, bot.method, bot.address)
    }
}