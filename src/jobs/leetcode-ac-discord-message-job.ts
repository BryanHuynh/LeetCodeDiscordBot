import { Client } from "discord.js";
import { findNewAcs } from "../utils/find-new-acs";
import {
	sendPrivateChannelLCS,
} from "../view/private-channel-request";
import LeetCodeSubmissionBuilder from "../models/leetcode-submission-builder";
import logger from "../utils/logger";
import { findOrCreatePrivateChannel } from "../utils/find-or-create-private-channel";
import { container } from "tsyringe";
import { SubscriptionRepository } from "../services/database-services/subscription-repository";
import { AcCompletionRepository } from "../services/database-services/ac-completion-repository";

export const leetcodeAcDiscordMessageJob = async (
	client: Client
) => {
	const leetcode_id_acs = await findNewAcs();
	if (leetcode_id_acs == null || Object.keys(leetcode_id_acs).length == 0) return;
	const subscriptionRepo = container.resolve(SubscriptionRepository);
	const acCompletionRepo = container.resolve(AcCompletionRepository);

	for (const leetcode_id in leetcode_id_acs) {
		const subscriptions = await subscriptionRepo.getSubscriptionsBasedOnLeetcodeId(leetcode_id);
		for (const ac_index in leetcode_id_acs[leetcode_id]) {
			const ac = leetcode_id_acs[leetcode_id][ac_index];
			const leetcode_submission_builder: LeetCodeSubmissionBuilder =
				await new LeetCodeSubmissionBuilder().buildSubmissionFromServices(
					ac,
					leetcode_id,
					""
				);
			for (const subscription of subscriptions) {
				const guild = client.guilds.cache.get(subscription.guild_id);
				const user = await client.users.fetch(subscription.discord_id);
				if (guild == null || user == null) continue;
				try {
					const leetcode_submission = await leetcode_submission_builder
						.withDiscordName(subscription.discord_id)
						.build();
					const thread = await findOrCreatePrivateChannel(guild, user, client);
					if (thread == null) return;
					const message = await sendPrivateChannelLCS(thread, leetcode_submission);
					if (message == null) return;
				} catch (err) {
					logger.error(`unable to send message to discord ${guild.id} ${user.id}`, err);
				}
			}
			await acCompletionRepo.addAcCompletion(ac.id, leetcode_id, ac.timestamp);
		}
	}
};

