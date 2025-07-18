import { Client, Guild, TextChannel, User } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";
import { findNewAcs } from "../utils/find-new-acs";
import {
	sendPrivateChannelLCS,
	createPrivateChannelRequest,
} from "../view/private-channel-request";
import LeetCodeSubmission from "../models/leetcode-submission";
import LeetCodeSubmissionBuilder from "../models/leetcode-submission-builder";
import logger from "../utils/logger";
import { findOrCreatePrivateChannel } from "../utils/find-or-create-private-channel";

export const leetcodeAcDiscordMessageJob = async (
	dbService: ISubscriptionService,
	client: Client
) => {
	const leetcode_id_acs = await findNewAcs(dbService);
	if (leetcode_id_acs == null || Object.keys(leetcode_id_acs).length == 0) return;
	for (const leetcode_id in leetcode_id_acs) {
		const subscriptions = await dbService.getSubscriptionsBasedOnLeetcodeId(leetcode_id);
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
					const thread = await findOrCreatePrivateChannel(guild, user, client, dbService);
					if (thread == null) return;
					const message = await sendPrivateChannelLCS(thread, leetcode_submission);
					if (message == null) return;
				} catch (err) {
					logger.error(`unable to send message to discord ${guild.id} ${user.id}`, err);
				}
			}
			await dbService.saveAC(ac.id, leetcode_id, parseInt(ac.timestamp));
		}
	}
};

