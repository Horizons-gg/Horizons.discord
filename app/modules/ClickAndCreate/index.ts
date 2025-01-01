import Discord from 'discord.js'
import App from 'app'


export default function ClickAndCreate(client: Discord.Client) {
    client.on('voiceStateUpdate', async (oldState, newState) => {

        const channels = App.guild().channels
        const parent = App.channel(App.config.clickNcreate).parent as Discord.CategoryChannel
        const member = newState.member



        if (newState.channel?.parentId === parent.id) {
            if (newState.channel?.id === App.config.clickNcreate) {
                const vc = await channels.create({
                    name: `${member?.user.username} Channel`,
                    type: Discord.ChannelType.GuildVoice,
                    parent: parent.id,
                })

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