import Discord from 'discord.js'
import Modal from 'modals/application.ts'



export default function Application(interaction: Discord.ButtonInteraction, args: string[]) {

    return interaction.showModal(Modal)

}