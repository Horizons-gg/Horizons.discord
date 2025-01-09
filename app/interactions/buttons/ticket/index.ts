import Discord from 'discord.js'
import App from 'app'
import Ticket from "module/tickets"



export default function TicketButtons(interaction: Discord.ButtonInteraction, args: string[]) {

    switch (args[0]) {
        default: return interaction.reply({ content: `No ButtonID matching ${args[0]} was found.`, ephemeral: true })

        case 'create': return Ticket.create(interaction.user.id).then((channel) => interaction.reply({ content: `Ticket created in ${channel}`, ephemeral: true }))
        case 'open': return Ticket.open(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'close': return Ticket.close(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'notify': return Ticket.notify(interaction).then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))

        case 'low': return Ticket.setPriority(interaction.channel as Discord.TextChannel, 'low').then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))
        case 'high': return Ticket.setPriority(interaction.channel as Discord.TextChannel, 'high').then(() => interaction.deferUpdate()).catch(msg => interaction.reply({ content: msg, ephemeral: true }))

        case 'cancel': return interaction.channel?.delete()
        case 'delete': return App.user(interaction.user.id).roles.cache.has(App.config.roles.staff) ? interaction.channel?.delete() : interaction.reply({ content: `You do not have permission to delete this channel.`, ephemeral: true })
        case 'archive': return App.user(interaction.user.id).roles.cache.has(App.config.roles.staff) ? Ticket.archive(interaction) : interaction.reply({ content: `You do not have permission to archive this channel.`, ephemeral: true })
    }

}