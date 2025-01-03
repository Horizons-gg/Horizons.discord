import Discord from 'discord.js'
import App from 'app'


export default function ClickAndCreate(client: Discord.Client) {
    client.on('voiceStateUpdate', async (oldState, newState) => {

        const channels = App.guild().channels
        const parent = App.channel(App.config.clickNcreate).parent as Discord.CategoryChannel
        const member = newState.member


        if (!member) return


        if (newState.channel?.parentId === parent.id) {
            if (newState.channel?.id === App.config.clickNcreate) {
                const vc = await channels.create({
                    name: `${member?.user.username} Channel`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: parent.id,
                })

                vc.permissionOverwrites.create(member, { Connect: true })
                vc.send(`${member}\n>>> Hey ${member?.user.username}, welcome to your personal voice channel!\n\nIf you would like to modify this channel such as its name, user limit, or access, use the \`/vc\` command.`)

                member?.voice.setChannel(vc)
            }
        }

        if (oldState.channel?.parentId === parent.id) {
            if (oldState.channel?.members.size === 0 && oldState.channel?.id !== App.config.clickNcreate) {
                oldState.channel.delete()
            }
        }

    })
}