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
import { SubscriptionRepository } from "../services/database-services/subscription-repository";
import { container } from "tsyringe";
import { validateLeetCodeAccount } from "../services/leetcode-service";

export const data = new SlashCommandBuilder()
	.setName("subscribe")
	.setDescription("Link your Discord with your LeetCode account")
	.addStringOption((option) =>
		option
			.setName("leetcode_account")
			.setDescription("What's your leetcode account name?")
			.setRequired(true)
	);

class AlreadySubscribedError extends Error {}
class InvalidLeetCodeAccountError extends Error {}
class LeetcodeIdAlreadyExistsError extends Error {}

export async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
	const leetcode_account = interaction.options.getString("leetcode_account");
	if (!leetcode_account) return;

	try {
		const subscriptionRepo = container.resolve(SubscriptionRepository);
		const subscription = await subscriptionRepo.getSubscriptionsBasedOnGuildAndDiscordId(
			interaction.guildId!,
			interaction.user.id
		);
		await subscriptionRepo
			.checkIfSubscriptionExistsForLeetcodeIdAndGuildId(
				leetcode_account!,
				interaction.guildId!
			)
			.then((res) => {
				if (res) throw new LeetcodeIdAlreadyExistsError();
			});

		if (subscription != null) throw new AlreadySubscribedError();

		const isValidAccount = await validateLeetCodeAccount(leetcode_account);
		if (!isValidAccount) throw new InvalidLeetCodeAccountError();
		const response = await AccountLinkingService.subscribe(
			leetcode_account!,
			interaction.user.id,
			interaction.user.username,
			interaction.guildId!,
			interaction.guild!.name
		);
		if (response) {
			const privateChannel = await findOrCreatePrivateChannel(
				interaction.guild!,
				interaction.user,
				interaction.client
			);
			if (privateChannel != null) {
				await sendPrivateChannelGreetingMessage(
					privateChannel,
					interaction.user,
					leetcode_account
				);
			}
			await interaction.reply({
				content: `Your leetcode account is: ${leetcode_account} linked`,
				ephemeral: true,
			});
		} else {
			throw new Error();
		}
	} catch (err) {
		if (err instanceof AlreadySubscribedError) {
			interaction.reply({
				content: "you are already subscribed, please unsubscribe first",
				ephemeral: true,
			});
		} else if (err instanceof InvalidLeetCodeAccountError) {
			interaction.reply({
				content: `${leetcode_account} is not a valid leetcode account`,
				ephemeral: true,
			});
		} else if (err instanceof LeetcodeIdAlreadyExistsError) {
			interaction.reply({
				content: `${leetcode_account} is already linked. Please contact server admin to resolve`,
				ephemeral: true,
			});
		} else {
			interaction.reply({ content: "unable to subscibe", ephemeral: true });
		}
	}
}
