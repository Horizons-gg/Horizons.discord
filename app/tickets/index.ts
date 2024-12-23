import Discord from 'discord.js'
import App from '@app/index'
import Colors from '@lib/colors'



export class TicketController {

    constructor() { }

    fetchService(id?: string): { id: string, name: string, role: string | null } | undefined {
        if (id === 'new') return { id: 'new', name: '✨ New Ticket', role: null }
        const service = App.services.find(s => id === s.id)
        if (!service) return undefined
        return service as { id: string, name: string, role: string | null }
    }

    async fetchController(channel: Discord.TextBasedChannel): Promise<Discord.Message | undefined> {
        const messages = await channel.messages.fetch({ limit: 1, after: '0' })
        return messages.first()
    }

    async fetchData(channel: Discord.TextChannel): Promise<Ticket | null> {
        const controller = await this.fetchController(channel)
        const data = JSON.parse(controller?.content.replaceAll('||', '') || '{}')
        if (!data) return null
        return data
    }

    async setData(channel: Discord.TextChannel, options: Ticket): Promise<boolean | undefined> {
        const data = await this.fetchData(channel)
        if (!data) return false

        const controller = await this.fetchController(channel)
        return await controller?.edit({ content: `||${JSON.stringify({ ...data, ...options })}||` })
            .then(() => true)
            .catch(() => false)
    }

    async open(channel: Discord.TextChannel): Promise<Discord.TextChannel> {
        const controller = await this.fetchController(channel)
        if (!controller) return channel

        this.setData(channel, { state: 'open' }).then(() => this.update(channel))
        return channel
    }

    async close(channel: Discord.TextChannel): Promise<Discord.TextChannel> {
        const controller = await this.fetchController(channel)
        if (!controller) return channel

        this.setData(channel, { state: 'closed' }).then(() => this.update(channel))
        return channel
    }

    async setPriority(channel: Discord.TextChannel, priority: 'low' | 'high'): Promise<Discord.TextChannel> {
        this.setData(channel, { priority }).then(() => this.update(channel))
        return channel
    }

    async setService(channel: Discord.TextChannel, service: string): Promise<Discord.TextChannel | string> {
        const data = await this.fetchData(channel)
        const ownerId = channel.topic as string

        const serviceData = this.fetchService(service)
        if (!serviceData) return `Service "${service}" Not Found!`

        channel.setName(channel.name.replace(channel.name.split('-')[0], service))
        this.setData(channel, { designation: service, state: 'open' }).then(() => this.update(channel))

        channel.send(`>>> ### ${this.fetchService(service)?.name}  -  ${data?.priority === 'low' ? 'Low Priority 🔷' : 'High Priority 🔶'}\n${data?.priority === 'low' ? '@here' : '@everyone'}${serviceData.role !== null ? ` <@&${serviceData.role}>` : ''}`)

        channel.permissionOverwrites.create(ownerId, {
            SendMessages: true,
        })

        return channel
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


    async archive(channel: Discord.TextChannel): Promise<Discord.TextChannel> {
        const data = await this.fetchData(channel)
        let messages: Discord.Message[] = []

        let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null))

        while (message) {
            await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    messagePage.forEach(msg => messages.push(msg))

                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null
                })
        }

        messages.reverse()

        const archive = App.channel(App.config.channels.archive) as Discord.TextChannel
        await archive.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`📂 ${channel.name} - ${new Date(channel.createdTimestamp).toLocaleString()}`)
                    .setColor(Colors.primary)
            ],
            files: [
                new Discord.AttachmentBuilder(
                    Buffer.from(messages.map(msg => `[${new Date(msg.createdTimestamp).toLocaleString()}] (${msg.author.username}): ${msg.content}`).join('\n\n'), 'utf-8'), { 'name': `${channel.name}.txt`, description: 'Tickets' }
                )
            ]
        })

        channel.delete()
        return channel

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

        await channel.send(`||${JSON.stringify({ designation: 'new', state: 'pending', priority: 'low', created: new Date().getTime(), members: [] } as Ticket)}||`).then(msg => msg.pin())

        await this.update(channel)
        return channel
    }


    async update(channel: Discord.TextChannel): Promise<any> {
        if (!channel.topic) return 'Ticket Owner Not Found!'

        const data = await this.fetchData(channel)
        if (!data) return 'Ticket Data Not Found!'

        const controller = await this.fetchController(channel)
        if (!controller) return 'Controller Not Found!'

        const owner = await App.user(channel.topic)


        if (data.state == 'open' && channel.parentId !== App.config.support.open) channel.setParent(App.config.support.open)
        if (data.state == 'closed' && channel.parentId !== App.config.support.closed) channel.setParent(App.config.support.closed)
        if (channel.name.split('-')[0] !== data.designation) channel.setName(channel.name.replace(channel.name.split('-')[0], data.designation || 'undefined'))


        const actions = () => {
            switch (data.state) {
                case 'pending': return [
                    new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                        .addComponents([
                            new Discord.ButtonBuilder()
                                .setCustomId('ticket.cancel')
                                .setLabel('Cancel Ticket')
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setEmoji('🚫'),

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
                        ]),
                    new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                        .addComponents([
                            new Discord.StringSelectMenuBuilder()
                                .setCustomId('ticket.service')
                                .setPlaceholder('⚠️ Please Select a Service to Continue...')
                                .addOptions(App.services.map(service => ({ label: service.name, value: service.id }))),
                        ])
                ]

                case 'open': return [
                    new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
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
                ]

                case 'closed': return [
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

                default: return [
                    new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
                        .addComponents([
                            new Discord.ButtonBuilder()
                                .setCustomId('error')
                                .setLabel('Something Went Wrong!')
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setEmoji('❌'),
                        ])
                ]
            }
        }


        controller.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setAuthor({ name: `${this.fetchService(data.designation)?.name} - ${owner?.nickname || owner.user?.globalName || owner.user.username}` })
                    .setTitle(data.state === 'open' ? '🔓 Ticket Opened' : '🔒 Ticket Closed')
                    .setColor(data.state === 'open' ? Colors.success : Colors.danger)
                    .setThumbnail(owner.user.avatarURL())
                    .setFields([
                        { name: 'Ticket Owner', value: `<@${channel.topic}>`, inline: true },
                        { name: 'Service Designation', value: `${this.fetchService(data.designation)?.name}`, inline: true },
                        { name: 'Ticket Priority', value: data.priority === 'low' ? '🔷 Low Priority' : '🔶 High Priority', inline: true },

                        { name: 'Created', value: `<t:${Math.floor(new Date(data.created || 0).getTime() / 1000)}:F>`, inline: true },
                        { name: 'Closed', value: data.state === 'closed' ? `<t:${Math.floor(new Date().getTime() / 1000)}:F>` : '\`In Progress...\`', inline: true },
                    ])

            ],
            components: actions()
        })

    }
}


const ticketController = new TicketController()
export default ticketController