import Discord from 'discord.js'
import App from '@app/index'

import Colors, { Color } from './colors'



interface MessageOptions {
    notification?: boolean
    variant?: 'default' | 'success' | 'error'
    title: string
    description: string
    color?: Color
    ephemeral?: boolean
    components?: Discord.APIActionRowComponent<Discord.APIMessageActionRowComponent>[]
}


export default function Message(options: MessageOptions): Discord.InteractionReplyOptions {

    const defaultColor = () => {
        switch (options.variant) {
            default: return Colors.primary
            case 'success': return Colors.success
            case 'error': return Colors.danger
        }
    }

    if (!options.notification) return {
        ephemeral: options.ephemeral || true,
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(options.title)
                .setColor(options.color ? Colors[options.color] : defaultColor())
                .setDescription(options.description)
        ],
        components: options.components
    } as Discord.InteractionReplyOptions

    const channel = App.channel(App.config.channels.general) as Discord.TextBasedChannel
    channel.send({
        embeds: [
            new Discord.EmbedBuilder()
                .setTitle(options.title)
                .setColor(options.color ? Colors[options.color] : defaultColor())
                .setDescription(options.description)
        ],
        components: options.components
    })

    return {} as Discord.InteractionReplyOptions
}