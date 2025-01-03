import Discord from 'discord.js'


import open from './open.ts'
import close from './close.ts'
import add from './add.ts'
import remove from './remove.ts'



export default {
    data: new Discord.SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket Commands')
        .setDMPermission(false)

        .addSubcommand(open.data)
        .addSubcommand(close.data)
        .addSubcommand(add.data)
        .addSubcommand(remove.data),

    subcommands: {
        open,
        close,
        add,
        remove,
    }
}
