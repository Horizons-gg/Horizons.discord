import Discord from 'discord.js'
import App from '@app/index'

import Ticket from '@app/tickets'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Remove a user to the ticket')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to add to the ticket')
            .setRequired(true)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.removeUser(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
}