import App from '@app/index'
import Discord from 'discord.js'


import ticket from './ticket'



export default {
    data: new Discord.SlashCommandBuilder()
        .setName('support')
        .setDescription('Commands to Seek Support in Horizons')
        .setDMPermission(false)

        .addSubcommand(ticket.data),

    subcommands: {
        ticket
    }
}
