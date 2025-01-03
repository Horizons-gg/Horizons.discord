import Discord from 'discord.js'

import Ticket from 'module/tickets'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Add a user to the ticket')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User to add to the ticket')
            .setRequired(true)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.addUser(interaction)
            .then(() => interaction.deleteReply())
            .catch(msg => interaction.editReply({ content: msg }))
    }
}