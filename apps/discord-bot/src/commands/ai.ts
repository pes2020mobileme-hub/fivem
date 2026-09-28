import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Ask the AI assistant')
    .addStringOption((o) => o.setName('prompt').setDescription('Your question').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const prompt = interaction.options.getString('prompt', true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ai/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }],
            type: 'chat',
          }),
        }
      );

      if (!res.ok) {
        throw new Error('AI service unavailable');
      }

      const data = await res.json();
      const content = data.content || 'No response';

      const embed = new EmbedBuilder()
        .setTitle('🧠 AI Assistant')
        .setDescription(content.slice(0, 4000))
        .setColor(0x00ffcc)
        .setFooter({ text: `Model: ${data.model || 'default'}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ content: '❌ AI service is currently unavailable.' });
    }
  },
};

export default command;
