import Discord from 'discord.js'
import Colors from 'lib/colors.ts'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('panel')
        .setDescription('Open the support panel')
        .addBooleanOption(option => option
            .setName('noreply')
            .setDescription('Stop the bot from replying to the command')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('variant')
            .setDescription('The variant of the panel')
            .setRequired(false)
            .setChoices([
                { name: 'Default', value: 'default' },
                { name: 'Support Only', value: 'support' },
            ])
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: false })

        const variantId = interaction.options.getString('variant') || 'default'
        const noreply = interaction.options.getBoolean('noreply') || false

        const variant = () => {
            switch (variantId) {

                default: return {
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`<:support:845624848466182164> **Community Support**`)
                            .setDescription(`>>> Need Assistance? The Horizons Staff Team will help you with any issues you may be having.\n\nInterested in joining the Staff Team? Apply here!`)
                            .setThumbnail('https://i.imgur.com/MVGVVBr.png')
                            .setColor(Colors.success)
                    ],

                    components: [
                        new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('ticket.create')
                                    .setLabel('Support Ticket')
                                    .setStyle(Discord.ButtonStyle.Success)
                                    .setEmoji('🎫'),

                                new Discord.ButtonBuilder()
                                    .setCustomId('application.create')
                                    .setLabel('Staff Application')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setEmoji('📝'),

                                new Discord.ButtonBuilder()
                                    .setCustomId('report.create')
                                    .setLabel('Report Member')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setEmoji('⚠️')
                            )
                    ]
                }

                // case 'support': return
            }
        }

        if (noreply) {
            if (!interaction.channel?.isSendable()) return
            await interaction.channel?.send(variant())
            interaction.deleteReply()
        } else {
            await interaction.editReply(variant())
        }

    }
}