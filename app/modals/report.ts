import Discord from 'discord.js'

export default new Discord.ModalBuilder()
    .setTitle('Member Report')
    .setCustomId('report')

    .addComponents(
        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Who are you Reporting?')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('reported')

                    .setPlaceholder('E.g. Bob#1234, IamBob...')
                    .setMinLength(1)
                    .setMaxLength(50)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Related Service')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('service')

                    .setPlaceholder('Discord, Space Engineers, DayZ, etc...')
                    .setMinLength(3)
                    .setMaxLength(30)

                    .setRequired(true)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Region (If Applicable)')
                    .setStyle(Discord.TextInputStyle.Short)
                    .setCustomId('region')

                    .setPlaceholder('Australia, Europe, United States, etc...')
                    .setMaxLength(30)

                    .setRequired(false)
            ),

        new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>()
            .addComponents(
                new Discord.TextInputBuilder()
                    .setLabel('Why are your Reporting this Member?')
                    .setStyle(Discord.TextInputStyle.Paragraph)
                    .setCustomId('reason')

                    .setPlaceholder('Please be detailed and include any evidence.')
                    .setMinLength(20)
                    .setMaxLength(800)

                    .setRequired(true)
            )
    )