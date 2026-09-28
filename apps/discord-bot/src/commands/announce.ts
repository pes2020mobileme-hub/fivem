import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { requirePermission } from '../utils/permissions';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement to the server')
    .addStringOption((o) => o.setName('message').setDescription('Announcement message').setRequired(true)),

  permission: 'ADMIN',

  async execute(interaction) {
    if (!(await requirePermission(interaction, 'ADMIN'))) return;

    const message = interaction.options.getString('message', true);

    const embed = new EmbedBuilder()
      .setTitle('📢 Server Announcement')
      .setDescription(message)
      .setColor(0xbf00ff)
      .setFooter({ text: `Announced by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
