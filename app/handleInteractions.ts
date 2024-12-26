// -@ts-nocheck

import Discord from 'discord.js'
import Commands from './commands'

import Ticket from './tickets'
import Application from './application'
import Report from './report'

import ApplicationModal from './modals/application'
import ReportModal from './modals/report'



export async function Commands(interaction: Discord.ChatInputCommandInteraction) {
    const command = interaction.commandName
    const subcommand = interaction.options.getSubcommand()

    if (!command) return interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true })

    if (!subcommand) Commands.lib[command].execute(interaction)
    else Commands.lib[command].subcommands[subcommand].execute(interaction)
}



export async function ModalSubmit(interaction: Discord.ModalSubmitInteraction) {
    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)

    if (ext === 'application') return Application(interaction)
    if (ext === 'report') return Report(interaction)

    if (!ext) return interaction.reply({ content: `No ModalID matching ${ext} was found.`, ephemeral: true })

}



export async function Button(interaction: Discord.ButtonInteraction) {
    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)


    if (ext === 'application') interaction.showModal(ApplicationModal)
    if (ext === 'report') interaction.showModal(ReportModal)

    if (ext === 'ticket') switch (args[0]) {
        default: return interaction.reply({ content: `No ButtonID matching ${args[0]} was found.`, ephemeral: true })

        case 'create': return Ticket.create(interaction.user.id).then((channel) => interaction.reply({ content: `Ticket created in ${channel}`, ephemeral: true }))
        case 'open': return Ticket.open(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'close': return Ticket.close(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'notify': return Ticket.notify(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))

        case 'low': return Ticket.setPriority(interaction.channel as Discord.TextChannel, 'low').then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'high': return Ticket.setPriority(interaction.channel as Discord.TextChannel, 'high').then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))

        case 'cancel': return interaction.channel?.delete()
        case 'delete': return interaction.channel?.delete()
        case 'archive': return Ticket.archive(interaction)
    }


    if (!ext) return interaction.reply({ content: `No ButtonID matching ${ext} was found.`, ephemeral: true })

}



export async function StringSelectMenu(interaction: Discord.StringSelectMenuInteraction) {
    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)
    const channel = interaction.channel as Discord.TextChannel

    if (!channel) return interaction.reply({ content: `This interaction is not valid in this context.`, ephemeral: true })


    if (ext === 'ticket') switch (args[0]) {
        default: return interaction.reply({ content: `No StringSelectMenu matching ${args[0]} was found.`, ephemeral: true })

        case 'service': return Ticket.setService(channel, interaction.values[0]).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
    }


    if (!ext) return interaction.reply({ content: `No ModalID matching ${ext} was found.`, ephemeral: true })

}