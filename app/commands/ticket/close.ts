import Discord from 'discord.js'

import Ticket from 'module/tickets'



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