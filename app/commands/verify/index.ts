import Discord from 'discord.js'

import start from './start.ts'
import override from './override.ts'



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
