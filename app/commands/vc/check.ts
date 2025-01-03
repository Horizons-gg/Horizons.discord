import Discord from 'discord.js'
import App from 'app'

import Messages from 'lib/messages.ts'



export default async function CheckPerms(interaction: Discord.ChatInputCommandInteraction) {
    const member = interaction.member as Discord.GuildMember
    const channel = member.voice.channel as Discord.VoiceChannel
    const category = App.channel(App.config.clickNcreate).parent as Discord.CategoryChannel

    try {
        if (!channel) throw new Error('This command can only be used in voice channels.')
        if (channel.parentId !== category.id) throw new Error('This command can only be used in personal voice channels (Click \'n\' Create).')

        if (member.roles.cache.has(App.config.roles.staff)) return true

        const msg = (await channel.messages.fetch({ limit: 1, after: '0' })).first()
        const owner = msg?.mentions.members.first()

        if (owner?.id !== member.id) throw new Error('You do not own this voice channel.')
        return true

    } catch (error) {
        Messages.reply(interaction, { description: (error as Error).message, color: 'danger', ephemeral: true })
        return false
    }
}