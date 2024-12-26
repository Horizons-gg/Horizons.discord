import Discord from 'discord.js'
import App from '@app/index'

import Ticket from '@app/tickets'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('close')
        .setDescription('Close the ticket in the current channel'),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.close(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
}