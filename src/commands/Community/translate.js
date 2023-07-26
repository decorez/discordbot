const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translator')
    .addStringOption(option => option.setName('message').setDescription('What do you want to translate?').setRequired(true))
    .addStringOption(option => option.setName('language').setDescription('The language you want to translate to').addChoices(
        {name: 'English', value:'en'},
        {name: 'Indonesia', value:'id'},
        {name: 'Korea', value:'ko'},
        {name: 'Japanese', value:'ja'},
        {name: 'French', value:'fr'},
        {name: 'German', value:'de'},
        {name: 'China', value:'ch'},
    ).setRequired(true)),
    async execute(interaction){

        const{ options } = interaction;
        const text = options.getString('message');
        const lan = options.getString('language');
        
        await interaction.reply({ content: `⚒️ Translating your language...`, ephemeral: true });

        const applied = await translate(text, { to: `${lan}`});

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`🔎 Translate Succsesful`)
        .addFields({ name: 'Old Text', value: `\`\`\`${text}\`\`\``, inline: false})
        .addFields({ name: 'Translated Text', value: `\`\`\`${applied.text}\`\`\``, inline: false})

        await interaction.editReply({ content: '', embeds: [embed], ephemeral: true})

    }
}