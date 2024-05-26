//? Dependencies

import Discord from 'discord.js'



//? Command

export const command = new Discord.SlashCommandSubcommandBuilder()
    .setName('timeout')
    .setDescription('Advanced Timeout Command')

    .addUserOption(option => option
        .setName('member')
        .setDescription('Select a member to timeout')
        .setRequired(true)
    )

    .addIntegerOption(option => option
        .setName('seconds')
        .setDescription('Time in Seconds (1 - 60)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(60)
    )
    .addIntegerOption(option => option
        .setName('minutes')
        .setDescription('Time in Minutes (1 - 60)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(60)
    )
    .addIntegerOption(option => option
        .setName('hours')
        .setDescription('Time in Hours (1 - 24)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(24)
    )
    .addIntegerOption(option => option
        .setName('days')
        .setDescription('Time in Days (1 - 365)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(365)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Guild = interaction.guild as Discord.Guild
    const User = Guild.members.cache.get(interaction.user.id) as Discord.GuildMember
    if (!User.roles.cache.find(r => r.name === 'Management')) return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true })


    const Member = interaction.options.getMember('member') as Discord.GuildMember

    const Seconds = (interaction.options.getInteger('seconds') || 0) * 1000
    const Minutes = (interaction.options.getInteger('minutes') || 0) * 60 * 1000
    const Hours = (interaction.options.getInteger('hours') || 0) * 60 * 60 * 1000
    const Days = (interaction.options.getInteger('days') || 0) * 24 * 60 * 60 * 1000

    const Duration = Seconds + Minutes + Hours + Days
    if (Duration <= 0) return interaction.reply({ content: `Failed to fetch duration: ${Duration}`, ephemeral: true })


    Member.timeout(Duration, `${interaction.user.username} has timed out ${Member.user.username}`)
        .then(() => interaction.reply({ content: `${Member} has been timed out.`, ephemeral: true }))
        .catch(error => interaction.reply({ content: `Error: ${error}`, ephemeral: true }))

}