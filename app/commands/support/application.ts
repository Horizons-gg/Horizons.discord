import Discord from 'discord.js'

import Modal from '../../modals/application'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('application')
        .setDescription('Submit an Application'),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        interaction.showModal(Modal)
    }
}