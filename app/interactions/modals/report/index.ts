import Discord from 'discord.js'
import App from 'app'

import Messages from 'lib/messages.ts'
import Colors from 'lib/colors.ts'



export default function Report(interaction: Discord.ModalSubmitInteraction) {

    const PingRole = App.guild().roles.cache.get(App.config.roles.staff) as Discord.Role
    const FormsChannel = App.channel(App.config.channels.forms) as Discord.TextChannel
    if (!FormsChannel) return Messages.reply(interaction, {
        title: 'Failed to Submit Report',
        description: 'The `📰forms` channel does not exist.',
        color: 'danger',
        ephemeral: true
    })


    const Form = new Discord.EmbedBuilder()
        .setTitle('⚠️ Member Report')
        .setAuthor({ name: `Report Submitted by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || 'https://archive.org/download/discordprofilepictures/discordblue.png' })
        .setDescription(`**Submit by <@${interaction.user.id}>**\`\`\`${interaction.fields.getTextInputValue('reason')}\`\`\`\n_ _`)
        .setColor(Colors.danger)
        .setTimestamp(new Date())

        .addFields(
            { name: 'Reported Member', value: `\`${interaction.fields.getTextInputValue('reported')}\``, inline: true },
            { name: 'Related Service', value: `\`${interaction.fields.getTextInputValue('service')}\``, inline: true },
            { name: 'Region', value: `\`${interaction.fields.getTextInputValue('region') || 'N/A'}\``, inline: true }
        )



    const Actions = new Discord.ActionRowBuilder<Discord.MessageActionRowComponentBuilder>()
        .addComponents(
            new Discord.ButtonBuilder()
                .setLabel('Message')
                .setStyle(Discord.ButtonStyle.Link)
                .setEmoji('📨')
                .setURL(`discord://-/users/${interaction.user.id}`)
        )


    FormsChannel.send({ content: PingRole.toString(), embeds: [Form], components: [Actions] })
        .then(() => Messages.reply(interaction, {
            title: '✅ Report Submitted',
            description: 'Your report has been submitted, please be patient while our staff look into your report.\n\n*You will be contacted if any further information is required.*',
            color: 'success',
            ephemeral: true
        }))
        .catch(err => Messages.reply(interaction, {
            title: 'Error while Submitting Report',
            description: err,
            color: 'danger',
            ephemeral: true
        }))

}