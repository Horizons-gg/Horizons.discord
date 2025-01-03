import Discord from 'discord.js'

import lock from './lock.ts'
import unlock from "./unlock.ts"
import edit from "./edit.ts"
import kick from "./kick.ts"



export default {
    data: new Discord.SlashCommandBuilder()
        .setName('vc')
        .setDescription('Voice Channel Commands')
        .setDMPermission(false)

        .addSubcommand(lock.data)
        .addSubcommand(unlock.data)
        .addSubcommand(edit.data)
        .addSubcommand(kick.data),

    subcommands: {
        lock,
        unlock,
        edit,
        kick,
    }
}
