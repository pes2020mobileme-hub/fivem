import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { getServerStatus } from '../utils/fivem';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Show FiveM server status'),

  async execute(interaction) {
    await interaction.deferReply();
    const status = await getServerStatus();

    const embed = new EmbedBuilder()
      .setTitle('🖥️ Server Status')
      .setColor(status.online ? 0x00f0ff : 0xff0044)
      .addFields(
        { name: 'Server', value: status.name, inline: true },
        { name: 'Status', value: status.online ? '🟢 Online' : '🔴 Offline', inline: true },
        { name: 'Players', value: `${status.players}/${status.maxPlayers}`, inline: true },
        { name: 'Resources', value: String(status.resources), inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'FiveM Bot Ultimate V3' });

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
