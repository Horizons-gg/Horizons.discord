//? Dependencies

import { ObjectId } from 'mongodb'

import { Collection } from '@lib/mongodb'
import { Guild as GetGuild, User as GetUser } from '@lib/discord'



//? Method

export default function (channel: string, user: string) {
    return new Promise(async (resolve, reject) => {

        const Setup = (await (await Collection('setup')).findOne({ _id: 'support' }) || {}) as Support
        const Tickets = await Collection('tickets')

        const Ticket = await Tickets.findOne({ channel: channel }) as Ticket
        if (!Ticket) return reject('Ticket does not exist.')

        const User = await GetUser(user)
        if (!User.roles.cache.hasAny(...Setup.permissions.delete)) return reject('You do not have permission to delete tickets.')


        await Tickets.deleteOne({ channel: channel })
            .then(async () => {

                const Guild = await GetGuild()
                const Channel = Guild.channels.cache.get(channel) || await Guild.channels.fetch(channel)

                if (!Channel) return reject('Channel does not exist.')

                Channel.delete()
                    .then(() => resolve('Ticket has been deleted.'))
                    .catch(err => reject('Failed to delete ticket channel!'))

            })
            .catch(err => {
                console.error(err)
                reject('Failed to delete ticket in database, read console for more information.')
            })

    })
}