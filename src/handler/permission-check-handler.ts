import { Interaction, PermissionFlagsBits, PermissionResolvable } from "discord.js";

const commandPermissions: Record<string, PermissionResolvable[]> = {
	subscribe: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
	unsubscribe: [],
	"set-channel": [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
	Share_AC_Button: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.CreatePublicThreads,
	],
};

export const permissionCheckHandler = (
	interaction: Interaction,
	command: string
): { success: boolean; missingPermissions?: string[] } => {
	const botMember = interaction.guild?.members.me;
	if (!botMember) return { success: false, missingPermissions: [] };
	const requiredPermissions = commandPermissions[command];
	if (!requiredPermissions) {
		return { success: false, missingPermissions: [] };
	}

	const missingPermissionFlags = requiredPermissions.filter(
		(permission) => !botMember.permissions.has(permission)
	);
	if (missingPermissionFlags.length > 0) {
		const missingPermissionNames = missingPermissionFlags
			.map((flag) =>
				Object.keys(PermissionFlagsBits).find(
					(key) => PermissionFlagsBits[key as keyof typeof PermissionFlagsBits] === flag
				)
			)
			.filter((name): name is string => name !== undefined);
		return { success: false, missingPermissions: missingPermissionNames };
	}
	return { success: true };
};
