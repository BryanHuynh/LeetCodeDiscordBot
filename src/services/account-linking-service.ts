import { container } from "tsyringe";
import { getUserRecentSubmissionsByUsername, validateLeetCodeAccount } from "./leetcode-service";
import { DiscordAccountRepository } from "./database-services/discord-account-repository";
import { LeetCodeAccountRepository } from "./database-services/leetcode-account-repository";
import { GuildRepository } from "./database-services/guild-repository";
import { SubscriptionRepository } from "./database-services/subscription-repository";
import { AcCompletionRepository } from "./database-services/ac-completion-repository";
import { Problem } from "./types/user-submission";
import logger from "../utils/logger";

export const AccountLinkingService = {
	async subscribe(
		leetcode_id: string,
		discord_id: string,
		guild_id: string,
		guild_name: string
	): Promise<boolean> {
		const isValidAccount = await validateLeetCodeAccount(leetcode_id);
		if (!isValidAccount) return Promise.reject(false);

		const discordAccountRepo = container.resolve(DiscordAccountRepository);
		await discordAccountRepo.addDiscordAccount(discord_id, leetcode_id);

		const leetcodeAccountRepo = container.resolve(LeetCodeAccountRepository);
		await leetcodeAccountRepo.addAccount(leetcode_id);

		const guildRepo = container.resolve(GuildRepository);
		await guildRepo.addGuild(guild_id, guild_name);

		const subscriptionRepo = container.resolve(SubscriptionRepository);
		await subscriptionRepo.addSubscription(leetcode_id, discord_id, guild_id);

		const acCompletionRepo = container.resolve(AcCompletionRepository);
		const acs = await getUserRecentSubmissionsByUsername(leetcode_id);
		const problems: Problem[] = acs[leetcode_id];
		if (problems.length == 0) return Promise.resolve(true);
		problems.forEach(async (problem: Problem) => {
			const res = await acCompletionRepo.addAcCompletion(
				problem.id,
				leetcode_id,
				new Date(problem.timestamp).toISOString()
			);
		});

		return Promise.resolve(true);
	},
};
