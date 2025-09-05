import {
	CacheType,
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	PermissionResolvable,
	SlashCommandBuilder,
} from "discord.js";
import { AccountLinkingService } from "../services/account-linking-service";

export const data = new SlashCommandBuilder()
	.setName("unsubscribe")
	.setDescription("unlink your Discord with your LeetCode account");

export async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
	AccountLinkingService.unsubscribe(interaction.user.id, interaction.guildId)
		.then((res) => {
			if (!res) {
				throw new Error("unable to unsubscribe");
			}
			interaction.reply({
				content: "successfully unlinked your leetcode account",
				ephemeral: true,
			});
		})
		.catch((err) => {
			interaction.reply({
				content:
					"We could not find a leetcode account associated with your discord account",
				ephemeral: true,
			});
		});
}
