const { SlashCommandBuilder, EmbedAssertions } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('This is the help command'),
    async execute (interaction, client) {

        const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Help Center')
        .setDescription('Commands List: ')
        .addFields({ name: 'Page 1', value: 'Help & Resources' })
        .addFields({ name: 'Page 2', value: 'Community Commands' })
        .addFields({ name: 'Page 3', value: 'Moderation Commands' })

        const embed2 = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Community Commands')
        .addFields({ name: '/help', value: 'to see the commands list & support' })
        .addFields({ name: '/spotify', value: 'to see users spotify status' })
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Moderation Commands')
        .addFields({ name: '/purge', value: 'to purge channels messages' })
        .addFields({ name: '/userinfo', value: 'to see user basic info' })
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('page1')
            .setLabel('Page 1')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page2')
            .setLabel('Page 2')
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId('page3')
            .setLabel('Page 3')
            .setStyle(ButtonStyle.Success),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] });
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.customId === 'page1') {
                
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true })
                }
                await i.update({ embeds: [embed], components: [button] })

            }

            if (i.customId === 'page2') {
                
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true })
                }
                await i.update({ embeds: [embed2], components: [button] })

            }

            if (i.customId === 'page3') {
                
                if (i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true })
                }
                await i.update({ embeds: [embed3], components: [button] })

            }

        })

    }
}