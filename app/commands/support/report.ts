import Discord from 'discord.js'

import Modal from 'modals/report.ts'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('report')
        .setDescription('Report a Member to our Staff'),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        interaction.showModal(Modal)
    }
}