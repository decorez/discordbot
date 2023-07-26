const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences] }); 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

const process = require('node:process')

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

//poll

const pollschema = require('../src/Schemas.js/votes');
client.on('interactionCreate', async (i) => {
  if (!i.guild) return;
  if (!i.message) return;
  if (!i.isButton) return;

  const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });
  if (!data) return;
  const msg = await i.channel.messages.fetch(data.Msg);

  if (i.customId === 'up') {
    if (data.UpMembers.includes(i.user.id))
      return await i.reply({
        content: `You cannot vote again. You have already sent an upvote on this poll.`,
        ephemeral: true,
      });

    let downvotes = data.Downvote;
    if (data.DownMembers.includes(i.user.id)) {
      downvotes = downvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: `Upvotes`,
        value: `> **${data.Upvote + 1}** Votes`,
        inline: true,
      },
      {
        name: 'Downvotes',
        value: `> **${downvotes}** Votes`,
        inline: true,
      },
      { name: `Author`, value: `> <@${data.Owner}>` }
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('up')
        .setLabel('✅')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('down')
        .setLabel('❌')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('votes')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)
    );

    await i.update({ embeds: [newembed], components: [buttons] });

    data.Upvote++;

    if (data.DownMembers.includes(i.user.id)) {
      data.Downvote = data.Downvote - 1;
    }

    data.UpMembers.push(i.user.id);
    data.DownMembers.pull(i.user.id);
    data.save();
  }

  if (i.customId === 'down') {
    if (data.DownMembers.includes(i.user.id))
      return await i.reply({
        content: `You cannot downvote twice on this poll!`,
        ephemeral: true,
      });

    let upvotes = data.Upvote;
    if (data.UpMembers.includes(i.user.id)) {
      upvotes = upvotes - 1;
    }

    const newembed = EmbedBuilder.from(msg.embeds[0]).setFields(
      {
        name: `Upvotes`,
        value: `> **${upvotes}** Votes`,
        inline: true,
      },
      {
        name: 'Downvotes',
        value: `> **${data.Downvote + 1}** Votes`,
        inline: true,
      },
      { name: `Author`, value: `> <@${data.Owner}>` }
    );

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('up')
        .setLabel('✅')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('down')
        .setLabel('❌')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('votes')
        .setLabel('Votes')
        .setStyle(ButtonStyle.Secondary)
    );

    await i.update({ embeds: [newembed], components: [buttons] });

    data.Downvote++;

    if (data.UpMembers.includes(i.user.id)) {
      data.Upvote = data.Upvote - 1;
    }

    data.DownMembers.push(i.user.id);
    data.UpMembers.pull(i.user.id);
    data.save();
  }

  if (i.customId === 'votes') {
    let upvoters = [];
    data.UpMembers.forEach((member) => {
      upvoters.push(`<@${member}>`);
    });

    let downvoters = [];
    data.DownMembers.forEach((member) => {
      downvoters.push(`<@${member}>`);
    });

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({ name: '🤚 Poll System' })
      .setFooter({ text: '🤚 Poll Members' })
      .setTimestamp()
      .setTitle(`Poll votes`)
      .addFields({
        name: `Upvoters (${upvoters.length})`,
        value: `> ${upvoters.join(', ').slice(0, 1020) || `No upvoters!`}`,
        inline: true,
      })
      .addFields({
        name: `Downvotes (${downvoters.length})`,
        value: `> ${downvoters.join(', ').slice(0, 1020) || `No downvoters!`}`,
        inline: true,
      });

    await i.reply({ embeds: [embed], ephemeral: true });
  }
});
