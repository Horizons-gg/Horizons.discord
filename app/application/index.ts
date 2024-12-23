import App from '../'
import Discord from 'discord.js'

import Colors from '@lib/colors'
import Message from '@lib/message'



export default async function (interaction: Discord.ModalSubmitInteraction) {

    const PingRole = App.guild().roles.cache.get(App.config.roles.management) as Discord.Role
    const FormsChannel = App.channel(App.config.channels.forms) as Discord.TextChannel
    if (!FormsChannel) return interaction.reply(
        Message.send({
            title: 'Failed to Submit Application',
            description: 'The `📰forms` channel does not exist.',
            ephemeral: true
        })
    )


    const Form = new Discord.EmbedBuilder()
        .setTitle('📝 Staff Application')
        .setAuthor({ name: `Application Submitted by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() || 'https://archive.org/download/discordprofilepictures/discordblue.png' })
        .setDescription(`**Submit by <@${interaction.user.id}>**\n\n**Statement**\`\`\`${interaction.fields.getTextInputValue('statement')}\`\`\`\n**Past Experience**\`\`\`${interaction.fields.getTextInputValue('experience')}\`\`\`\n_ _`)
        .setColor(Colors.primary)
        .setTimestamp(new Date())

        .addFields(
            { name: 'Preferred Name', value: `\`${interaction.fields.getTextInputValue('name')}\``, inline: true },
            { name: 'Position', value: `\`${interaction.fields.getTextInputValue('position')}\``, inline: true },
            { name: 'Region', value: `\`${interaction.fields.getTextInputValue('region')}\``, inline: true }
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
        .then(() => interaction.reply(
            Message.send({
                variant: 'success',
                title: '✅ Application Submitted',
                description: 'Your application has been submitted, please be patient whilst management reads through your application.\n\n*We will be in contact with you soon!*',
                ephemeral: true,
            }
            )))
        .catch(err => interaction.reply(
            Message.send({
                title: 'Error while Submitting Application',
                description: err,
                ephemeral: true
            })
        ))
}