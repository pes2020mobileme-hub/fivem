import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { requirePermission } from '../utils/permissions';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a player from the server')
    .addStringOption((o) => o.setName('identifier').setDescription('License / Steam / Discord ID').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Ban reason').setRequired(true))
    .addIntegerOption((o) =>
      o.setName('duration').setDescription('Duration in hours (0 = permanent)').setRequired(false)
    ),

  permission: 'MODERATOR',

  async execute(interaction) {
    if (!(await requirePermission(interaction, 'MODERATOR'))) return;

    const identifier = interaction.options.getString('identifier', true);
    const reason = interaction.options.getString('reason', true);
    const duration = interaction.options.getInteger('duration') ?? 0;

    // In production: call API / database + RCON / txAdmin
    const embed = new EmbedBuilder()
      .setTitle('🔨 Player Banned')
      .setColor(0xff0044)
      .addFields(
        { name: 'Identifier', value: `\`${identifier}\``, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Duration', value: duration === 0 ? 'Permanent' : `${duration} hours`, inline: true },
        { name: 'Banned by', value: interaction.user.tag, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'FiveM Bot Ultimate V3' });

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
