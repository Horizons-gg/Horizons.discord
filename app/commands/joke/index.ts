import Discord from 'discord.js'


export default {
    data: new Discord.SlashCommandBuilder()
        .setName('joke')
        .setDescription('Tell a joke')
        .addStringOption(option => option
            .setName('keyword')
            .setDescription('Keyword to search for a joke')
            .setRequired(false),
        ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
        const keyword = interaction.options.getString('keyword')

        const joke: { type: 'single' | 'twopart', setup: string, delivery: string, joke: string } = await fetch(`https://v2.jokeapi.dev/joke/Any${keyword ? `?contains=${keyword}` : ''}`)
            .then(res => res.json())
            .then(json => {
                if (json.error) return interaction.reply({ content: `Sorry... I couldn't find any jokes matching your keyword.`, ephemeral: true })
                return json
            })
            .catch(err => {
                interaction.reply({ content: `An error occurred: ${err}`, ephemeral: true })
            })

        if (joke.type === 'single') {
            interaction.reply({ content: joke.joke })
        }

        if (joke.type === 'twopart') {
            const channel = interaction.channel as Discord.TextChannel
            await interaction.reply({ content: joke.setup })
            
            await channel.sendTyping()
            
            setTimeout(() => {
                interaction.followUp({ content: joke.delivery })
            }, 5000)
        }
    }
}