import { Events, Interaction } from "discord.js";
import * as subscribe from "../commands/subscribe";
import * as setChannel from "../commands/set-channel";
import * as acShare from "../commands/ac-share";
import * as unsubscribe from "../commands/unsubscribe";
import { permissionCheckHandler } from "./permission-check-handler";

export const InteractionCreateHandler = {
	execute(interaction: Interaction) {
		if (interaction.isChatInputCommand()) {
			const permissionCheck = permissionCheckHandler(interaction, interaction.commandName);
			if (!permissionCheck.success) {
				interaction.reply({
					content: `Bot is missing permission: ${permissionCheck.missingPermissions?.map(
						(permission) => permission.toString()
					)}. Contact admin to grant permission(s).`,
					ephemeral: true,
				});
				return;
			}
			if (interaction.commandName === "subscribe") subscribe.execute(interaction);
			if (interaction.commandName === "set-channel") setChannel.execute(interaction);
			if (interaction.commandName === "unsubscribe") unsubscribe.execute(interaction);
		} else if (interaction.isButton()) {
			const permissionCheck = permissionCheckHandler(interaction, interaction.customId);
			if (!permissionCheck.success) {
				interaction.followUp({
					content: `Bot is missing permission: ${permissionCheck.missingPermissions?.map(
						(permission) => permission.toString()
					)}. Contact admin to grant permission(s).`,
					ephemeral: true,
				});
				return;
			}
			if (interaction.customId == "Share_AC_Button") acShare.execute(interaction);
		}
	},
};
