import Discord from 'discord.js'
import App from '@app/index'

import Colors from '@lib/colors'
import Message from '@lib/message'
import Verification from '@app/verify'


export default {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('override')
        .setDescription('Override a Users Verification Process')
        .addUserOption(
            new Discord.SlashCommandUserOption()
                .setName('target')
                .setDescription('Target User')
                .setRequired(true)
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const Guild = await App.guild()
        const User = await App.user(interaction.user.id)
        const Administrator = Guild.roles.cache.find(r => r.name == 'Administrator') as Discord.Role

        if (!User || !User.roles.cache.has(Administrator.id)) return //todo: Add Failure Response


        const Target = interaction.options.getMember('target') as Discord.GuildMember
        const GeneralChannel = Guild.channels.cache.get(App.config.channels.general) as Discord.TextBasedChannel

        Verification.override(Target.id)
            .then(() => {
                interaction.reply(Message({
                    variant: 'success',
                    title: 'Verification Process Overridden',
                    description: `Verification Process Overridden for ${Target}!`,
                }))

                Target.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle('Account Verification Overridden!')
                            .setDescription(`An Administrator has overridden your Account Verification Session, you no longer need to enter your verification code and may continue to use Horizons as per usual!`)
                            .setColor(Colors.info)
                    ]
                }).catch(() => {
                    GeneralChannel.send({
                        content: `${Target}`,
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle('Account Verification Overridden!')
                                .setDescription(`An Administrator has overridden your Account Verification Session, you no longer need to enter your verification code and may continue to use Horizons as per usual!`)
                                .setColor(Colors.info)
                        ]
                    }).then(msg => setTimeout(() => { msg.delete().catch(() => { }) }, 1000 * 60 * 5))
                })
            })
            .catch(error => interaction.reply(Message({
                variant: 'error',
                title: 'Failed to Override Account Verification',
                description: `Failed to Override Account Verification for ${Target}!\n\`\`\`${error}\`\`\``,
            })))
    }
}