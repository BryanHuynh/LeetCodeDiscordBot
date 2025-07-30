import {
	CacheType,
	ChatInputCommandInteraction,
	Client,
	CommandInteraction,
	Interaction,
	SlashCommandBuilder,
} from "discord.js";
import { AccountLinkingService } from "../services/account-linking-service";
import { findOrCreatePrivateChannel } from "../utils/find-or-create-private-channel";
import { sendPrivateChannelGreetingMessage } from "../view/private-channel-request";

export const data = new SlashCommandBuilder()
	.setName("subscribe")
	.setDescription("Link your Discord with your LeetCode account")
	.addStringOption((option) =>
		option
			.setName("leetcode_account")
			.setDescription("What's your leetcode account name?")
			.setRequired(true)
	);

export async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
	const leetcode_account = interaction.options.getString("leetcode_account");
	if (!leetcode_account) return;
	try {
		const response = await AccountLinkingService.subscribe(
			leetcode_account!,
			interaction.user.id,
			interaction.guildId!,
			interaction.guild!.name
		);
		if (response) {
			await interaction.reply(`Your leetcode account is: ${leetcode_account} linked`);
			const privateChannel = await findOrCreatePrivateChannel(
				interaction.guild!,
				interaction.user,
				interaction.client,
			);
			if (privateChannel != null) {
				await sendPrivateChannelGreetingMessage(privateChannel, interaction.user, leetcode_account);
			}
		}
	} catch (err) {
		await interaction.reply(`unable to find leetcode account: ${leetcode_account}`);
	}
}
