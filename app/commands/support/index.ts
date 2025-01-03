import Discord from 'discord.js'

import ticket from './ticket.ts'
import panel from './panel.ts'
import application from './application.ts'
import report from './report.ts'



export default {
    data: new Discord.SlashCommandBuilder()
        .setName('support')
        .setDescription('Commands to Seek Support in Horizons')
        .setDMPermission(false)

        .addSubcommand(ticket.data)
        .addSubcommand(panel.data)
        .addSubcommand(application.data)
        .addSubcommand(report.data),

    subcommands: {
        ticket,
        panel,
        application,
        report,
    }
}
