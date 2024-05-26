//? Exports

export * as onduty from './onduty'
export * as verify from './verify'
export * as override from './override'
export * as topactivities from './topactivities'
export * as timeout from './timeout'




//? Dependencies

import Discord from 'discord.js'

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('staff')
    .setDescription('Commands for Staff Members')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8192)

    .addSubcommand(Subcommands.onduty.command)
    .addSubcommand(Subcommands.verify.command)
    .addSubcommand(Subcommands.override.command)
    .addSubcommand(Subcommands.topactivities.command)
    .addSubcommand(Subcommands.timeout.command)



//? Response

export const response = (interaction: Discord.ChatInputCommandInteraction) => {

}