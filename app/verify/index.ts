import Discord from 'discord.js'
import App from '../'

import Message from '@lib/message'
import Colors from '@lib/colors'



const Sessions: {
    id: string
    key: string
    timer: NodeJS.Timeout
}[] = []



export function initialize(user: Discord.GuildMember, time?: number): Promise<string> {
    return new Promise(async (resolve, reject) => {

        if (user.user.bot) return reject('You cannot Request Account Verification for a Discord Bot!')

        const Time = time || 15
        const Key = Math.random().toString(36).substring(2, 15)

        const Guild = await App.guild()
        const GeneralChannel = Guild.channels.cache.find(channel => channel.name == "🌐general") as Discord.TextBasedChannel
        const DevSpam = Guild.channels.cache.get('669408058564411393') as Discord.TextBasedChannel


        if (Sessions.find(session => session.id === user.id)) return reject('Session Already Exists!')


        user.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle('Anti-Bot Detection System - Verification Required')
                    .setDescription(`Hey there, our system has flagged your account as a potential bot, for security purposes we require you to verify your account.\n\nPlease reply with the following code to verify your account: \`${Key}\`\n\n*Please Note that if you do not verify your account <t:${Math.floor((new Date().getTime() + (Time * 60 * 1000)) / 1000)}:R>, your account will be removed!*\n\nIf you have any issues please contact a staff member immediately.`)
                    .setColor(Colors.warning)
            ]
        }).catch(() => {
            GeneralChannel.send({
                content: `${user}`,
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('Anti-Bot Detection System - Verification Required')
                        .setDescription(`Please DM ${App.client.user} the following code to verify your account: \`${Key}\`\n\n*Please Note that you may need to "Allow direct messages from server members."*\nhttps://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-\n\n*Please Complete this Process <t:${Math.floor((new Date().getTime() + (Time * 60 * 1000)) / 1000)}:R>*`)
                        .setColor(Colors.warning)
                ]
            }).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 1000 * 60 * Time))
        })


        Sessions.push({
            id: user.id,
            key: Key,
            timer: setTimeout(() => {

                const index = Sessions.findIndex(session => session.id === user.id)
                user.kick('Failed to Verify Account Age').catch(() => { })
                Sessions.splice(index, 1)

                Message({
                    notification: true,
                    color: 'danger',
                    title: 'Member Kicked 💥',
                    description: `${user} (${user.user.username}) has been kicked from the server as they failed to validate their account age in a timely manner.`
                })

            }, 1000 * 60 * Time)
        })

        return resolve(Key)

    })
}


export function attempt(user: string, key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const Session = Sessions.find(session => session.id === user)

        if (!Session) return reject(`NO_SESSION-${key}`)
        if (Session.key !== key) return reject(`INVALID_KEY-${Session.key}-${key}`)

        clearTimeout(Session.timer)
        Sessions.splice(Sessions.indexOf(Session), 1)

        return resolve(true)

    })
}


export function override(user: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

        const Session = Sessions.find(session => session.id === user)

        if (!Session) return reject(`This user does not have an active Account Verification Session!`)

        clearTimeout(Session.timer)
        Sessions.splice(Sessions.indexOf(Session), 1)

        return resolve(true)

    })
}


export default {
    initialize,
    attempt,
    override
}