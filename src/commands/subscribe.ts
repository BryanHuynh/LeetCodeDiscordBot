import {
	CacheType,
	ChatInputCommandInteraction,
	Client,
	CommandInteraction,
	Interaction,
	PermissionFlagsBits,
	PermissionResolvable,
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

function checkPermission(interaction: ChatInputCommandInteraction<CacheType>): {
	success: boolean;
	message?: string;
} {
	const requiredPermissions: PermissionResolvable[] = [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.ManageChannels,
	];

	const botMember = interaction.guild?.members.me;
	if (!botMember)
		return {
			success: false,
			message: "We were unable to properly check for bot permissions in your server",
		};
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
		return {
			success: false,
			message: `Bot is missing these permissions: ${missingPermissionNames}`,
		};
	}
	return { success: true };
}

export async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
	const permission_res = checkPermission(interaction);
	if (!permission_res.success) {
		interaction.reply({
			content: permission_res.message,
			ephemeral: true,
		});
		return;
	}
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
