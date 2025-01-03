import Discord from 'discord.js'

import Ticket from 'module/tickets'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('ticket')
        .setDescription('Open a New Support Ticket'),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        Ticket.create(interaction.user.id)
            .then(res => {
                if (typeof res === 'string') return interaction.editReply({ content: res })

                interaction.editReply({
                    content: `Your Ticket has been Created in ${res}`
                })
            })
    }
}