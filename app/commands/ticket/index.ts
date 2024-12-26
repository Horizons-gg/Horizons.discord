import App from '@app/index'
import Discord from 'discord.js'


import open from './open'
import close from './close'
import add from './add'
import remove from './remove'



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
