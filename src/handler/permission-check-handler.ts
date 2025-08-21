import { Interaction, PermissionFlagsBits, PermissionResolvable, PermissionsBitField } from "discord.js";

const requiredPermissions: PermissionResolvable[] = [
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.CreatePublicThreads,
    PermissionFlagsBits.CreatePrivateThreads,
    PermissionFlagsBits.UseApplicationCommands
];

export const PermissionCheckHandler = (
	interaction: Interaction
): { success: boolean; missingPermissions?: PermissionResolvable[] } => {
	const botMember = interaction.guild?.members.me;
	if (!botMember) throw new Error("unable to get bot member");

	const missingPermissions = requiredPermissions.filter(
		(permission) => !botMember.permissions.has(permission)
	);
	if (missingPermissions.length > 0) {
		return { success: false, missingPermissions: missingPermissions };
	}
	return { success: true };
};
