import Discord from 'discord.js'
import Modal from 'modals/report.ts'



export default function Report(interaction: Discord.ButtonInteraction, args: string[]) {

    return interaction.showModal(Modal)

}