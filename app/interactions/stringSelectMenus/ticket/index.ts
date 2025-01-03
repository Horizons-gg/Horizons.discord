import Discord from 'discord.js'
import Ticket from 'module/tickets'



export default function ServiceMenu(interaction: Discord.StringSelectMenuInteraction, args: string[]) {

    const channel = interaction.channel as Discord.TextChannel

    return Ticket.setService(channel, interaction.values[0])
        .then(() => interaction.deferUpdate())
        .catch(msg => interaction.reply({ content: msg, ephemeral: true }))

}