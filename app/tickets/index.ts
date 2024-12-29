import Discord from 'discord.js'
import App from '@app/index'
import Colors from '@lib/colors'



export class TicketController {

    priorityCooldown: { channel: string, time: number }[]

    constructor() {
        this.priorityCooldown = []
    }



    fetchService(id?: string): { id: string, name: string, role: string | null } | undefined {
        if (id === 'new') return { id: 'new', name: '✨ New Ticket', role: null }
        const service = App.services.find(s => id === s.id)
        if (!service) return undefined
        return service as { id: string, name: string, role: string | null }
    }

    fetchController(channel: Discord.TextChannel): Promise<Discord.Message> {
        return new Promise(async (resolve, reject) => {
            const controller = channel.messages.cache.get(channel.topic?.split('-')[0] as string) || await channel.messages.fetch(channel.topic?.split('-')[0] as string).catch(() => undefined)
            if (!controller?.content) return reject('Ticket Controller Not Found!')
            return resolve(controller)
        })
    }

    fetchData(channel: Discord.TextChannel): Promise<[Ticket, Discord.Message]> {
        return new Promise(async (resolve, reject) => {
            const controller = await this.fetchController(channel).catch(reject)
            if (!controller) return

            const data = JSON.parse(controller?.content.replaceAll('||', '') || '{}') as Ticket
            if (!data) return reject('Ticket Data Not Found!')

            return resolve([data, controller])
        })
    }

    setData(channel: Discord.TextChannel, options: Ticket): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const [data, controller] = await this.fetchData(channel)

                const content = `||${JSON.stringify({ ...data, ...options })}||`
                if (controller?.content === content) return resolve(true)

                await controller?.edit({ content })
                    .then(() => resolve(true))
                    .catch(() => reject('Failed to edit ticket data!'))
            } catch (error) {
                reject(error)
            }
        })
    }

    open(interaction: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const channel = interaction.channel as Discord.TextChannel

            const controller = await this.fetchController(channel).catch(reject)
            if (!controller) return

            channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`🔓 Ticket opened by ${interaction.user}`)
                        .setColor(Colors.success)
                ]
            })

            await this.setData(channel, { state: 'open' }).then(() => this.update(channel))
            return resolve('Ticket Opened!')
        })
    }

    close(interaction: Discord.ButtonInteraction | Discord.ChatInputCommandInteraction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const channel = interaction.channel as Discord.TextChannel

            const controller = await this.fetchController(channel).catch(reject)
            if (!controller) return

            channel.send({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`🔒 Ticket closed by ${interaction.user}`)
                        .setColor(Colors.danger)
                ]
            })

            this.setData(channel, { state: 'closed' }).then(() => this.update(channel))
            return resolve('Ticket Closed!')
        })
    }

    addUser(interaction: Discord.ChatInputCommandInteraction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = interaction.channel as Discord.TextChannel

                const [data, controller] = await this.fetchData(channel)

                const member = interaction.options.getUser('user')
                if (!member) return reject('User not found!')
                if (data.members?.includes(member.id)) return reject('This user has already been added to the ticket!')
                data.members?.push(member.id)

                channel.permissionOverwrites.create(member.id, {
                    ViewChannel: true,
                    SendMessages: true
                })

                channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(`🛬 ${member} has been added to the ticket by ${interaction.user}`)
                            .setColor(Colors.info)
                    ]
                })

                this.setData(channel, { members: data.members })
                return resolve('User added to the ticket!')
            } catch (error) {
                reject(error)
            }
        })
    }

    removeUser(interaction: Discord.ChatInputCommandInteraction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = interaction.channel as Discord.TextChannel

                const [data, controller] = await this.fetchData(channel)

                const member = interaction.options.getUser('user')
                if (!member) return reject('User not found!')
                if (!data.members?.includes(member.id)) return reject('This user has not been added to the ticket!')
                data.members = data.members?.filter(id => id !== member.id)

                channel.permissionOverwrites.delete(member.id)

                channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setDescription(`🛫 ${member} has been removed from the ticket by ${interaction.user}`)
                            .setColor(Colors.info)
                    ]
                })

                this.setData(channel, { members: data.members })
                return resolve('User removed from the ticket!')
            } catch (error) {
                reject(error)
            }
        })
    }

    setPriority(channel: Discord.TextChannel, priority: 'low' | 'high'): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const cooldown = this.priorityCooldown.findIndex(p => p.channel === channel.id)
            const now = new Date()

            if (cooldown !== -1) {
                if (now.getTime() < this.priorityCooldown[cooldown].time) {
                    return reject(`You can only update the ticket priority every 10 seconds!`)
                } else {
                    this.priorityCooldown.splice(cooldown, 1)
                }
            }

            this.setData(channel, { priority })
                .then(() => this.update(channel))
                .catch(reject)

            this.priorityCooldown.push({ channel: channel.id, time: now.getTime() + (1000 * 10) })

            return resolve('Ticket Priority Updated!')
        })
    }

    notify(interaction: Discord.ButtonInteraction): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const channel = interaction.channel as Discord.TextChannel

                const [data, controller] = await this.fetchData(channel)

                const serviceData = this.fetchService(data.designation)
                if (!serviceData) return reject(`Service "${data.designation}" Not Found!`)

                const now = new Date()
                const nextNotify = new Date(data.notify || 0)
                const diff = now.getTime() - nextNotify.getTime()

                if (diff < 0) return reject(`You can notify staff again in <t:${Math.floor(nextNotify.getTime() / 1000)}:R>`)
                channel.send({
                    content: `@here ${serviceData.role !== null ? ` <@&${serviceData.role}>` : ''}`,
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle('🛎️ Staff Notification')
                            .setColor(Colors.warning)
                            .setDescription(`${interaction.user} has requested staff assistance!`)
                            .setFooter({ text: `You can notify staff again in 15 minutes` })
                    ]
                })

                this.setData(channel, { notify: now.getTime() + (1000 * 60 * 15) }).then(() => this.update(channel))
                return resolve('Staff Notified!')
            } catch (error) {
                reject(error)
            }
        })
    }

    setService(channel: Discord.TextChannel, service: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const [data, controller] = await this.fetchData(channel)
                if (data.designation !== 'new') return reject('Service can only be set for new tickets!')

                const ownerId = data?.owner
                if (!ownerId) return reject('Ticket Owner Not Found!')

                const serviceData = this.fetchService(service)
                if (!serviceData) return reject(`Service "${service}" Not Found!`)

                channel.setName(channel.name.replace(channel.name.split('-')[0], service))
                this.setData(channel, { designation: service, state: 'open' }).then(() => this.update(channel))

                channel.send(`>>> ### ${this.fetchService(service)?.name}  -  ${data?.priority === 'low' ? 'Low Priority 🔷' : 'High Priority 🔶'}\n${data?.priority === 'low' ? '@here' : '@everyone'}${serviceData.role !== null ? ` <@&${serviceData.role}>` : ''}`)

                channel.permissionOverwrites.edit(ownerId, {
                    ViewChannel: true,
                    SendMessages: true,
                })

                return resolve('Service Updated!')
            } catch (error) {
                reject(error)
            }
        })
    }


    findTickets(owner: string): Discord.Collection<string, Discord.GuildBasedChannel> {
        const guild = App.guild()
        const channels = guild.channels.cache.filter(channel => {
            if (channel.type !== Discord.ChannelType.GuildText) return
            if (channel.parentId !== App.config.support.open) return
            if (channel.topic?.split('-')[1] !== owner) return
            return channel
        })

        return channels
    }


    async archive(interaction: Discord.ButtonInteraction): Promise<Discord.TextChannel> {
        const channel = interaction.channel as Discord.TextChannel

        const [data, controller] = await this.fetchData(channel)
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


        let involvedStaff = messages.map(msg => msg.author.id).filter((id, index, self) => self.indexOf(id) === index)

        involvedStaff = involvedStaff.filter(id => {
            if (id === data.owner) return false
            if (id === App.config.client) return false
            if (data.members?.includes(id)) return false
            return true
        })

        const archive = App.channel(App.config.channels.archive) as Discord.TextChannel
        await archive.send({
            content: `||${data.owner} - ${this.fetchService(data.designation)?.name} - ${new Date(channel.createdTimestamp).toLocaleString()}||`,
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`${App.user(data.owner as string).user.username} | ${new Date(channel.createdTimestamp).toLocaleString()}`)
                    .setColor(Colors.primary)
                    .setFields([
                        { name: 'Service', value: `${this.fetchService(data.designation)?.name}`, inline: true },
                        { name: 'Stats', value: `Messages: \`${messages.length}\``, inline: true },
                        { name: 'Created', value: `<t:${Math.floor(new Date(data.created || 0).getTime() / 1000)}:F>`, inline: true },

                        { name: 'Owner', value: `<@${data.owner}>`, inline: true },
                        { name: 'Staff', value: `${involvedStaff.map(id => `<@${id}>`).join('\n') || 'N/A'}`, inline: true },
                        { name: 'Members', value: `${data.members?.map(id => `<@${id}>`).join('\n') || 'N/A'}`, inline: true },
                    ])
                    .setFooter({ text: `Archived by ${interaction.user.globalName} / ${interaction.user.username}` })
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
        const owner = App.user(ownerId)
        const guild = App.guild()

        const ownersTickets = this.findTickets(ownerId)
        if (ownersTickets.size > 0) return 'You already have an open ticket, please close it before opening a new one.'

        const channel = await guild.channels.create({
            name: `new-${owner?.nickname || owner.user?.globalName || owner.user.username}`,
            parent: App.config.support.open
        })

        channel.permissionOverwrites.create(ownerId, {
            ViewChannel: true,
            SendMessages: false,
        })

        const controller = await channel.send(`||${JSON.stringify({
            owner: ownerId,
            designation: 'new',
            state: 'pending',
            priority: 'low',
            created: new Date().getTime(),
            notify: new Date().getTime() + (1000 * 60 * 15),
            members: []
        } as Ticket)}||`)
        controller.pin()

        await channel.setTopic(`${controller.id}-${owner.id}`)

        await this.update(channel)
        return channel
    }


    async update(channel: Discord.TextChannel): Promise<any> {
        const [data, controller] = await this.fetchData(channel)
        if (!data) return 'Ticket Data Not Found!'

        const owner = App.user(data.owner as string)
        if (!owner) return 'Ticket Owner Not Found!'


        if (data.state == 'open' && channel.parentId !== App.config.support.open) channel.setParent(App.config.support.open, { lockPermissions: false })
        if (data.state == 'closed' && channel.parentId !== App.config.support.closed) channel.setParent(App.config.support.closed, { lockPermissions: false })
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
                                .setCustomId('ticket.notify')
                                .setLabel('Request Staff')
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setEmoji('🛎️'),
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


        const stateVis = (): [string, number] => {
            switch (data.state) {
                case 'open': return ['🔓 Ticket Opened', Colors.success]
                case 'closed': return ['🔒 Ticket Closed', Colors.danger]
                case 'pending': return ['🕒 Ticket Pending', Colors.secondary]
                default: return ['❓ Error', Colors.danger]
            }
        }

        controller.edit({
            embeds: [
                new Discord.EmbedBuilder()
                    .setAuthor({ name: `${this.fetchService(data.designation)?.name} - ${owner?.nickname || owner.user?.globalName || owner.user.username}` })
                    .setTitle(stateVis()[0])
                    .setColor(stateVis()[1])
                    .setThumbnail(owner.user.avatarURL())
                    .setFields([
                        { name: 'Ticket Owner', value: `<@${data.owner}>`, inline: true },
                        { name: 'Service Designation', value: `${this.fetchService(data.designation)?.name}`, inline: true },
                        { name: 'Ticket Priority', value: data.priority === 'low' ? '🔷 Low Priority' : '🔶 High Priority', inline: true },

                        { name: 'Created', value: `<t:${Math.floor(new Date(data.created || 0).getTime() / 1000)}:F>`, inline: true },
                        data.state === 'closed' ? { name: 'Closed', value: `<t:${Math.floor(new Date().getTime() / 1000)}:F>`, inline: true } : { name: '\u200B', value: '\u200B', inline: true },
                    ])

            ],
            components: actions()
        })

    }
}


const ticketController = new TicketController()
export default ticketController