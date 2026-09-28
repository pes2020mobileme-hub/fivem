import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';
import { getServerStatus } from '../utils/fivem';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('players')
    .setDescription('List online players'),

  async execute(interaction) {
    await interaction.deferReply();
    const status = await getServerStatus();

    if (!status.online || status.playerList.length === 0) {
      await interaction.editReply({ content: 'No players online or server is offline.' });
      return;
    }

    const list = status.playerList
      .slice(0, 25)
      .map((p) => `\`[${p.id}]\` **${p.name}** — ${p.ping}ms`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`👥 Online Players (${status.players}/${status.maxPlayers})`)
      .setDescription(list)
      .setColor(0x00f0ff)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
