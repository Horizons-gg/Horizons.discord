import App from '@app/index'
import Discord from 'discord.js'


import start from './start'
import override from './override'



export default {
    data: new Discord.SlashCommandBuilder()
        .setName('verify')
        .setDescription('Manual Verification Commands')
        .setDMPermission(false)

        .addSubcommand(start.data)
        .addSubcommand(override.data),

    subcommands: {
        start,
        override
    }
}
