import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { requirePermission } from '../utils/permissions';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a player from the server')
    .addIntegerOption((o) => o.setName('id').setDescription('Server player ID').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Kick reason').setRequired(false)),

  permission: 'MODERATOR',

  async execute(interaction) {
    if (!(await requirePermission(interaction, 'MODERATOR'))) return;

    const id = interaction.options.getInteger('id', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    const embed = new EmbedBuilder()
      .setTitle('👢 Player Kicked')
      .setColor(0xffaa00)
      .addFields(
        { name: 'Player ID', value: String(id), inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Kicked by', value: interaction.user.tag, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
