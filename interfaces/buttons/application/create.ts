//? Dependencies

import Discord from 'discord.js'

import Modal from '@lib/templates/modals/application'



//? Handle

export default async function (interaction: Discord.ButtonInteraction) {

    interaction.showModal(Modal)

}