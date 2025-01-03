import Discord from 'discord.js'
import App from 'app'
import Messages from "lib/messages.ts"

import CheckPerms from "./check.ts"



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('edit')
        .setDescription('Edit your voice channel')

        .addStringOption(option => option
            .setName('name')
            .setDescription('Change the name of your voice channel')
            .setRequired(false)

            .setMinLength(2)
            .setMaxLength(15)
        )

        .addIntegerOption(option => option
            .setName('limit')
            .setDescription('Change the user limit of your voice channel')
            .setRequired(false)

            .setMinValue(1)
            .setMaxValue(99)
        )

        .addBooleanOption(option => option
            .setName('ptt')
            .setDescription('Enable Push-to-Talk for your voice channel')
            .setRequired(false)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const isAuth = await CheckPerms(interaction)
        if (!isAuth) return

        const member = interaction.member as Discord.GuildMember
        const channel = member.voice.channel as Discord.VoiceChannel

        const name = interaction.options.getString('name')
        const limit = interaction.options.getInteger('limit')
        const ptt = interaction.options.getBoolean('ptt')

        try {
            if (name) channel.setName(name)
            if (limit) channel.setUserLimit(limit)
            if (ptt) channel.permissionOverwrites.edit(App.guild().id, { UseVAD: ptt })
            Messages.reply(interaction, { description: '✅ Your channel has been updated.', color: 'success', ephemeral: true })
        } catch (error) {
            Messages.reply(interaction, { title: '❌ Unable to update your channel.', description: (error as Error).message, color: 'danger', ephemeral: true })
        }
    }
}