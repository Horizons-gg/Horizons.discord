// -@ts-nocheck

import Discord from 'discord.js'
import Commands from './commands'

import Ticket from './tickets'



export async function Commands(interaction: Discord.ChatInputCommandInteraction) {
    const command = interaction.commandName
    const subcommand = interaction.options.getSubcommand()

    if (!command) return interaction.editReply({ content: `No command matching ${interaction.commandName} was found.` })

    if (!subcommand) Commands.lib[command].execute(interaction)
    else Commands.lib[command].subcommands[subcommand].execute(interaction)
}



export async function ModalSubmit(interaction: Discord.ModalSubmitInteraction) {
    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)

    // if (ext === 'ticket') return NewTicket(interaction)

    if (!ext) return interaction.reply({ content: `No ModalID matching ${ext} was found.`, ephemeral: true })

}



export async function Button(interaction: Discord.ButtonInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)

    if (ext === 'ticket') switch (args[0]) {
        default: interaction.editReply({ content: `No ButtonID matching ${args[0]} was found.` })

        case 'create': return Ticket.create(interaction.user.id).then((channel) => interaction.editReply(`Ticket created in ${channel}`))
        case 'open': return Ticket.open(interaction.channel as Discord.TextChannel).then(() => interaction.deleteReply())
        case 'close': return Ticket.close(interaction.channel as Discord.TextChannel).then(() => interaction.deleteReply())

        case 'low': return Ticket.update(interaction.channel as Discord.TextChannel, { priority: 'low' }).then(() => interaction.deleteReply())
        case 'high': return Ticket.update(interaction.channel as Discord.TextChannel, { priority: 'high' }).then(() => interaction.deleteReply())

        case 'cancel': return interaction.channel?.delete()
        case 'delete': return interaction.channel?.delete()
    }

    if (!ext) return interaction.editReply({ content: `No ButtonID matching ${ext} was found.` })

}



export async function StringSelectMenu(interaction: Discord.StringSelectMenuInteraction) {
    await interaction.deferReply({ ephemeral: true })

    const ext = interaction.customId.split('.')[0]
    const args = interaction.customId.split('.').slice(1)
    const channel = interaction.channel as Discord.TextChannel

    if (!channel) return interaction.editReply({ content: `This interaction is not valid in this context.` })


    if (ext === 'ticket') switch (args[0]) {
        default: return interaction.editReply({ content: `No StringSelectMenu matching ${args[0]} was found.` })

        case 'service': return Ticket.update(channel, { service: interaction.values[0] }).then(() => { interaction.message.delete(); interaction.deleteReply() })
    }


    if (!ext) return interaction.editReply({ content: `No ModalID matching ${ext} was found.` })

}