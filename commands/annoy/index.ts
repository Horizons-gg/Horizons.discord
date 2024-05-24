//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandBuilder()
    .setName('annoy')
    .setDescription('Annoy the Selected Member.')
    .setDMPermission(false)

    .addUserOption(option => option
        .setName('member')
        .setDescription('Select a member to annoy')
        .setRequired(true)
    )

    .addIntegerOption(option => option
        .setName('duration')
        .setDescription('How many seconds should the member be annoyed for?')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(60)
    )

    .addStringOption(option => option
        .setName('reason')
        .setDescription('Why are you annoying this member?')
        .setRequired(false)
        .addChoices(
            { name: 'annoy', value: 'annoy you' },
            { name: 'attention', value: 'get your attention' }
        )
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const User = interaction.options.getUser('member')
    const Duration = interaction.options.getInteger('duration')
    const Channel = interaction.channel

    if (!User) return interaction.reply({ content: `Failed to fetch user: <@${User || 0}>`, ephemeral: true })
    if (!Duration) return interaction.reply({ content: `Failed to fetch duration: ${Duration || 0}`, ephemeral: true })
    if (!Channel) return interaction.reply({ content: `Failed to verify channel: "${interaction.channelId || 0}"`, ephemeral: true })


    interaction.reply({ embeds: [{ description: `You got it boss! 👍\nLets annoy ${User} for ${Duration} seconds!` }], ephemeral: false })
        .then(msg => setTimeout(() => msg.delete().catch(console.warn), (Duration * 1000) + 5000))


    const Message = (user: Discord.User, channel: Discord.TextBasedChannel) => {
        channel.send({ content: `${user}, ${interaction.user.displayName || interaction.user.globalName} is trying to ${interaction.options.getString('reason') || 'annoy you'}!` })
            .then(msg => setTimeout(() => msg.delete().catch(console.warn), 2500))
            .catch(console.error)
    }


    for (let i = 0; i < (Duration / 2); i++) {
        setTimeout(() => Message(User, Channel), i * 2000)
    }

}