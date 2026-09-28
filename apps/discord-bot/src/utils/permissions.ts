import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';

const ROLE_NAMES: Record<string, string[]> = {
  ADMIN: ['Admin', 'Administrator', 'Owner'],
  MODERATOR: ['Admin', 'Administrator', 'Owner', 'Moderator', 'Mod'],
  SUPPORT: ['Admin', 'Administrator', 'Owner', 'Moderator', 'Mod', 'Support'],
  PLAYER: [],
};

export function hasPermission(
  interaction: ChatInputCommandInteraction,
  required: 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'PLAYER' = 'PLAYER'
): boolean {
  if (required === 'PLAYER') return true;
  if (!interaction.guild || !interaction.member) return false;

  const member = interaction.member as GuildMember;
  if (member.permissions.has('Administrator')) return true;

  const allowedRoles = ROLE_NAMES[required] || [];
  return member.roles.cache.some((role) => allowedRoles.includes(role.name));
}

export async function requirePermission(
  interaction: ChatInputCommandInteraction,
  required: 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'PLAYER' = 'PLAYER'
): Promise<boolean> {
  if (hasPermission(interaction, required)) return true;

  await interaction.reply({
    content: `❌ You need **${required}** permission to use this command.`,
    ephemeral: true,
  });
  return false;
}
