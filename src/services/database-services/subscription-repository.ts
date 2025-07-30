import "reflect-metadata";
import { injectable } from "tsyringe";
import { DatabaseService } from "./database-service";
import logger from "../../utils/logger";
import { Subscription } from "../../models/subscription";

@injectable()
export class SubscriptionRepository {
	constructor(private dbService: DatabaseService) {}

	async addSubscription(
		leetcode_id: string,
		discord_id: string,
		guild_id: string
	): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"insert into subscription (leetcode_id, discord_id, guild_id) values ($1, $2, $3)",
				[leetcode_id, discord_id, guild_id]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to add subscription: ${leetcode_id} ${discord_id} ${guild_id}`);
			return Promise.resolve(false);
		}
	}

	async getSubscriptionsBasedOnLeetcodeId(leetcode_id: string): Promise<Subscription[]> {
		try {
			const res = await this.dbService.execute(
				"select leetcode_id, discord_id, guild_id from subscription where leetcode_id = $1",
				[leetcode_id]
			);
			if (res.rows.length > 0) return res.rows;
			return Promise.resolve([]);
		} catch (err) {
			logger.error(`unable to get subscriptions based on leetcode id: ${leetcode_id}`);
			return Promise.resolve([]);
		}
	}
}
