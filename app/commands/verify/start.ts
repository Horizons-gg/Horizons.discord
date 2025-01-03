import Discord from 'discord.js'
import App from 'app'

import Message from 'lib/messages.ts'
import Verification from 'module/verification'



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('start')
        .setDescription('Initiate the Account Verification Process on the target account (Use to Filter out Bots)')

        .addUserOption(
            new Discord.SlashCommandUserOption()
                .setName('target')
                .setDescription('Target User')
                .setRequired(true)
        )

        .addIntegerOption(
            new Discord.SlashCommandIntegerOption()
                .setName('time')
                .setDescription('Time to Verify before the user is kicked in minutes')
                .setMinValue(5)
                .setMaxValue(86400)
                .setRequired(false)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const Guild = await App.guild()
        const User = await App.user(interaction.user.id)
        const Administrator = Guild.roles.cache.find(r => r.name == 'Administrator') as Discord.Role

        if (!User || !User.roles.cache.has(Administrator.id)) return


        const Target = interaction.options.getMember('target') as Discord.GuildMember
        const Time = interaction.options.getInteger('time') as number


        try {
            const code = Verification.initialize(Target, Time)
            Message.reply(interaction, {
                ephemeral: true,
                title: 'Verification Process Initiated',
                description: `Verification Process Initiated for ${Target}\n${Target.user.username} will be kicked <t:${Math.floor((new Date().getTime() + ((Time || 15) * 60 * 1000)) / 1000)}:R> if they do not verify their account!\`\`\`Verification Code: ${code}\`\`\``,
                color: 'success'
            })
        } catch (error) {
            Message.reply(interaction, {
                ephemeral: true,
                title: 'Verification Process Failed to Initiate',
                description: `Verification Process Failed to Initiate for ${Target}\n\`\`\`${error}\`\`\``,
                color: 'danger'
            })
        }
    }
}