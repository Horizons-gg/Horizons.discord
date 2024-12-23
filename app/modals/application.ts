import Discord from 'discord.js'

export default new Discord.ModalBuilder()
    .setTitle('Staff Application')
    .setCustomId('application')

    .addComponents(
        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Preferred Name')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('name')

                    .setPlaceholder('E.g. John Doe')
                    .setMinLength(2)
                    .setMaxLength(30)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Staff Position/s')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('position')

                    .setPlaceholder('Discord Moderator, Space Engineers Moderator, etc...')
                    .setMinLength(3)
                    .setMaxLength(50)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('What Region do you live in?')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('region')

                    .setPlaceholder('Australia, Europe, United States, etc...')
                    .setMaxLength(30)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Past Experience')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setCustomId('experience')

                    .setPlaceholder('E.g. I have been a moderator on "Other Server" for 2 years...')
                    .setMinLength(20)
                    .setMaxLength(800)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Statement')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setCustomId('statement')

                    .setPlaceholder('E.g. I would like to become a moderator in Horizons because...')
                    .setMinLength(50)
                    .setMaxLength(800)

                    .setRequired(true)
            )
    )