import Discord from 'discord.js'

import Ticket from 'module/tickets'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('open')
        .setDescription('Open the ticket in the current channel'),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.open(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
}