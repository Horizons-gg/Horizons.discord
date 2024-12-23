import App from '@app/index'
import Discord from 'discord.js'


import ticket from './ticket'
import panel from './panel'
import application from './application'
import report from './report'



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
