import Discord from 'discord.js'
import App from 'app'
import Messages from "lib/messages.ts"

import CheckPerms from "./check.ts"



export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from your voice channel')

        .addUserOption(option => option
            .setName('user')
            .setDescription('User to kick')
            .setRequired(true)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const isAuth = await CheckPerms(interaction)
        if (!isAuth) return

        const member = interaction.member as Discord.GuildMember
        const channel = member.voice.channel as Discord.VoiceChannel

        const user = interaction.options.getUser('user')
        if (!user) return Messages.reply(interaction, { description: 'User not found', color: 'danger', ephemeral: true })

        if (!channel.members.has(user.id)) return Messages.reply(interaction, { description: 'User not found in your voice channel', color: 'danger', ephemeral: true })

        channel.members.get(user.id)?.voice.disconnect()
            .then(() => Messages.reply(interaction, { description: `Kicked ${user} from your voice channel`, color: 'success', ephemeral: true }))
            .catch(() => Messages.reply(interaction, { description: `Failed to kick ${user} from your voice channel`, color: 'danger', ephemeral: true }))
    }
}