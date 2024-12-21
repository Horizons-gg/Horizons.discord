import Discord from 'discord.js'
import App from '@app/index'
import Colors from '@lib/colors'



export class TicketController {

    constructor() {

    }

    async fetchData(channel: Discord.TextChannel): Promise<string[]> {
        const controller = await this.fetchController(channel)
        return controller?.content.replaceAll('||', '').split('-') as string[]
    }

    async updateData(channel: Discord.TextChannel, data: string[]): Promise<boolean> {
        const controller = await this.fetchController(channel)
        controller?.edit({ content: `||${data.join('-')}||` })
        return true
    }

    async open(channel: Discord.TextChannel): Promise<Discord.TextChannel> {
        await channel.edit({ parent: App.config.support.open })
        return channel
    }

    async close(channel: Discord.TextChannel): Promise<Discord.TextChannel> {
        await channel.edit({ parent: App.config.support.closed })
        return channel
    }

    async fetchController(channel: Discord.TextBasedChannel): Promise<Discord.Message | undefined> {
        const messages = await channel.messages.fetch({ limit: 1, after: '0' })
        return messages.first()
    }

    async findTickets(owner: string): Promise<Discord.Collection<string, Discord.GuildBasedChannel>> {
        const guild = await App.guild()
        const channels = guild.channels.cache.filter(channel => {
            if (channel.type !== Discord.ChannelType.GuildText) return
            if (channel.parentId !== App.config.support.open) return
            if (channel.topic !== owner) return
            return channel
        })

        return channels
    }


    async create(ownerId: string): Promise<Discord.TextChannel | string> {

        const owner = await App.user(ownerId)
        const guild = await App.guild()


        const ownersTickets = await this.findTickets(ownerId)
        if (ownersTickets.size > 0) return 'You already have an open ticket, please close it before opening a new one.'


        const channel = await guild.channels.create({
            name: `new-${owner?.nickname || owner.user?.globalName || owner.user.username}`,
            topic: owner.id,
            parent: App.config.support.open
        })

        channel.permissionOverwrites.create(ownerId, {
            ViewChannel: true,
            SendMessages: false,
        })

        const controller = await channel.send({ content: `||new-${owner.id}-null-${new Date().getTime()}-null||` })
        this.update(channel, { description: '\`N/A\`', service: 'new', priority: 'N/A' })
        await channel.send({
            components: [
                new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                    .addComponents([
                        new Discord.StringSelectMenuBuilder()
                            .setCustomId('ticket.service')
                            .setPlaceholder('⚠️ Please Select a Service to Continue...')
                            .addOptions([
                                { label: '🌐 General', value: 'general' },
                                { label: '🚀 Space Engineers', value: 'se' },
                                { label: '🏹 Rust', value: 'rust' },
                                { label: '🧟 DayZ', value: 'dayz' },
                                { label: '🔨 Minecraft', value: 'mc' },
                            ]),
                    ]),
            ]
        })
        controller.pin()


        return channel

    }


    async update(channel: Discord.TextChannel, details?: { description?: string, service?: string, priority?: 'N/A' | 'low' | 'high' }): Promise<Discord.TextChannel | string> {
        if (!channel.topic) return 'Ticket Owner Not Found!'

        const owner = await App.user((await this.fetchData(channel))[1])

        const controller = await this.fetchController(channel)
        if (!controller) return 'Controller Not Found!'


        const priority = () => {
            if (details?.priority === undefined) return undefined
            if (details?.priority === 'low') return '🔷 Low Priority'
            if (details?.priority === 'high') return '🔶 High Priority'
        }

        const service = () => {
            switch (details?.service) {
                case 'new': return '\`✨ New Ticket\`'
                case 'general': return '\`🌐 General\`'
                case 'se': return '\`🚀 Space Engineers\`'
                case 'rust': return '\`🏹 Rust\`'
                case 'dayz': return '\`🧟 DayZ\`'
                case 'mc': return '\`🔨 Minecraft\`'
                default: return undefined
            }
        }

        const field = (item: number | string) => {
            try {
                if (typeof item === 'string') {
                    if (item === 'description') {
                        if (details?.description === undefined) return controller.embeds[0].description
                        else return details?.description
                    }
                }
                else return controller.embeds[0].fields[item].value
            }
            catch (error) {
                return '\`N/A\`'
            }
        }


        if (details?.service) {
            let channelData = await this.fetchData(channel)
            let channelName = channel.name.split('-')

            channelData[0] = details.service
            channelName[0] = details.service

            channel.edit({ name: channelName.join('-') }).catch(console.error)
            await this.updateData(channel, channelData)

            if (details.service !== 'new') await channel.permissionOverwrites.edit(owner.id, { SendMessages: true })
        }


        controller.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(channel.parent?.id === App.config.support.open ? '🔓 Ticket Opened' : '🔒 Ticket Closed')
                    .setAuthor({ name: `${owner?.nickname || owner.user?.globalName || owner.user.username} - ${owner.id}` })
                    .setDescription(`${field('description')}`)
                    .setColor(channel.parent?.id === App.config.support.open ? Colors.success : Colors.danger)

                    .setFields([
                        { name: 'Ticket Owner', value: `${owner}`, inline: true },
                        { name: 'Service Designation', value: `${service() || field(1)}`, inline: true },
                        { name: 'Ticket Priority', value: `${priority() || field(2)}`, inline: true },

                        { name: 'Created', value: `<t:${Math.floor(new Date(controller.createdTimestamp).getTime() / 1000)}:F>`, inline: true },
                        channel.parent?.id === App.config.support.closed ? { name: 'Closed', value: `<t:${Math.floor(new Date().getTime() / 1000)}:F>`, inline: true } : { name: '\u200B', value: '\u200B', inline: true },
                    ])

                    .setThumbnail(owner.user.avatarURL())
            ],

            components: [
                channel.parent?.id === App.config.support.open ? new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                    .addComponents([
                        new Discord.ButtonBuilder()
                            .setCustomId('ticket.close')
                            .setLabel('Close Ticket')
                            .setStyle(Discord.ButtonStyle.Danger)
                            .setEmoji('🔒'),

                        new Discord.ButtonBuilder()
                            .setCustomId('ticket.low')
                            .setLabel('Low Priority')
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setEmoji('🔷'),

                        new Discord.ButtonBuilder()
                            .setCustomId('ticket.high')
                            .setLabel('High Priority')
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setEmoji('🔶'),
                    ])
                    :
                    new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                        .addComponents([
                            new Discord.ButtonBuilder()
                                .setCustomId('ticket.open')
                                .setLabel('Open Ticket')
                                .setStyle(Discord.ButtonStyle.Success)
                                .setEmoji('🔓'),

                            new Discord.ButtonBuilder()
                                .setCustomId('ticket.archive')
                                .setLabel('Archive Ticket')
                                .setStyle(Discord.ButtonStyle.Primary)
                                .setEmoji('📂'),

                            new Discord.ButtonBuilder()
                                .setCustomId('ticket.delete')
                                .setLabel('Delete Ticket')
                                .setStyle(Discord.ButtonStyle.Danger)
                                .setEmoji('🗑️'),
                        ])
            ]
        })

        return channel

    }

}


const ticketController = new TicketController()
export default ticketController