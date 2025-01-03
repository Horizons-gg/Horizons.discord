import Discord from 'discord.js'


export default new Discord.ModalBuilder()
    .setTitle('Support Form')
    .setCustomId('ticket')

    .addComponents(

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Title of your Issue')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('title')

                    .setPlaceholder('E.g. My Ship Vanished!')
                    .setMinLength(3)
                    .setMaxLength(50)

                    .setRequired(true)
            ),


        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Briefly Describe your Issue')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setCustomId('description')

                    .setPlaceholder('E.g. I joined the server and my ship was gone!')
                    .setMinLength(10)
                    .setMaxLength(800)

                    .setRequired(true)
            )

    )