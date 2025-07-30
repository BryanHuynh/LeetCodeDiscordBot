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

	async getSubscriptionsBasedOnGuildAndDiscordId(
		guild_id: string,
		discord_id: string
	): Promise<Subscription | null> {
		try {
			const res = await this.dbService.execute(
				"select leetcode_id, discord_id, guild_id from subscription where guild_id = $1 and discord_id = $2",
				[guild_id, discord_id]
			);
			if (res.rows.length > 0) return res.rows[0];
			return Promise.resolve(null);
		} catch (err) {
			logger.error(
				`unable to get subscriptions based on guild and discord id: ${guild_id} ${discord_id}`
			);
			return Promise.resolve(null);
		}
	}

	async removeSubscription(discord_id: string, guild_id: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"delete from subscription where discord_id = $1 and guild_id = $2",
				[discord_id, guild_id]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to remove subscription: ${discord_id}`);
			return Promise.reject(false);
		}
	}
}
