import { ISubscriptionService } from "./i-subscription-service";
import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { getUserRecentSubmissionsByUsername } from "./leetcode-service";
import { Problem, UserProblems } from "./types/user-submission";
import { ISubscriptions } from "./types/subscriptions";

export class PostgresService implements ISubscriptionService {
	private pgConfig: PoolConfig;
	private pool: Pool;

	constructor() {
		dotenv.config();
		this.pgConfig = {
			user: process.env.POSTGRES_USER,
			host: process.env.POSTGRES_HOST,
			database: process.env.POSTGRES_DATABASE,
			password: process.env.POSTGRES_PASSWORD,
			port: parseInt(process.env.POSTGRES_PORT || "5432"),
		};
		this.pool = new Pool(this.pgConfig);
	}

	init(): void {
		process.on("SIGINT", async () => {
			console.log("Closing database pool...");
			await this.pool.end();
			process.exit();
		});
	}

	async subscribe(id: string, discord_id: string, discord_username: string, guild_id: string, guild_name: string): Promise<boolean> {
		try {
			await this.addDiscordAccount(discord_id, discord_username);
			await this.addLeetcodeAccount(id);
			await this.addGuild(guild_id, guild_name);
			await this.addSubscription(discord_id, id, guild_id);
			await this.populateUserACs(id);
			return Promise.resolve(true);
		} catch (err) {
			console.error("Database connection error:", err);
		}
		return Promise.resolve(false);
	}

	async getLeetcodeAccounts(): Promise<string[]> {
		try {
			const res = await this.pool.query("SELECT ID FROM LEETCODE_ACCOUNT");
			logger.info("fetching leetcode accounts");
			return Promise.resolve(res.rows.map((row) => row.id));
		} catch (err) {
			logger.error("error fetching leetcode accounts: " + err);
			return Promise.resolve([]);
		}
	}

	unsubscribe(id: string, discord_id: string, guild_id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	async addDiscordAccount(discord_id: string, discord_username: string): Promise<boolean> {
		try {
			const res = await this.pool.query("INSERT INTO DISCORD_ACCOUNT (id, username) VALUES ($1, $2)", [discord_id, discord_username]);
			logger.info("added discord account: " + discord_id);
		} catch (err) {
			logger.error("error adding discord account: " + err);
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}

	async addLeetcodeAccount(leetcode_id: string): Promise<boolean> {
		try {
			const res = await this.pool.query("INSERT INTO LEETCODE_ACCOUNT (id) VALUES ($1)", [leetcode_id]);
			logger.info("added leetcode account: " + leetcode_id);
		} catch (err) {
			logger.error("error adding leetcode account: " + err);
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}

	async addGuild(guild_id: string, guild_name: string): Promise<boolean> {
		try {
			const res = await this.pool.query("INSERT INTO GUILD (id, guild_name) VALUES ($1, $2)", [guild_id, guild_name]);
			logger.info("added guild: " + guild_id);
		} catch (err) {
			logger.error("error adding guild: " + err);
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}

	async addSubscription(discord_id: string, leetcode_id: string, guild_id: string): Promise<boolean> {
		if (await this.checkIfSubscriptionToGuildAndLeetcodeAccountExists(leetcode_id, guild_id)) {
			logger.info("subscription already exists: " + discord_id + " " + leetcode_id + " " + guild_id);
			return Promise.resolve(false);
		}
		try {
			const res = await this.pool.query("INSERT INTO SUBSCRIPTION (discord_id, leetcode_id, guild_id) VALUES ($1, $2, $3)", [discord_id, leetcode_id, guild_id]);
			logger.info("added subscription: " + discord_id + " " + leetcode_id + " " + guild_id);
			return Promise.resolve(true);
		} catch (err) {
			logger.error("error adding subscription: " + err);
			return Promise.resolve(false);
		}
	}

	async populateUserACs(leetcode_id: string): Promise<boolean> {
		try {
			const acs = await getUserRecentSubmissionsByUsername(leetcode_id);
			const problems: Problem[] = acs[leetcode_id];
			if (problems.length == 0) return Promise.resolve(true);
			problems.forEach(async (problem: Problem) => {
				try {
					const res = await this.pool.query("INSERT INTO AC_COMPLETION (AC_ID, LEETCODE_ID, TIMESTAMP) VALUES ($1, $2, $3)", [
						problem.id,
						leetcode_id,
						new Date(problem.timestamp).toISOString(),
					]);
					logger.info("added ac completion:" + problem.id + " " + leetcode_id);
				} catch (err) {
					logger.error("error adding ac completion: " + err);
				}
			});
			return Promise.resolve(true);
		} catch (err) {
			logger.error("error populating user acs: " + err);
			return Promise.resolve(false);
		}
	}

	async getUserACIds(leetcode_id: string): Promise<String[]> {
		try {
			const res = await this.pool.query("SELECT AC_ID FROM AC_COMPLETION WHERE LEETCODE_ID = $1 ORDER BY TIMESTAMP DESC LIMIT 5", [leetcode_id]);
			logger.info("selecting user acs: " + leetcode_id);
			return Promise.resolve(res.rows.map((row) => row.ac_id));
		} catch (err) {
			logger.error("error adding subscription: " + err);
			return Promise.resolve([]);
		}
	}

	async getSubscriptionsBasedOnLeetcodeId(leetcode_id: string): Promise<ISubscriptions[]> {
		try {
			const res = await this.pool.query<ISubscriptions>("SELECT LEETCODE_ID, DISCORD_ID, GUILD_ID FROM SUBSCRIPTION WHERE LEETCODE_ID = $1", [leetcode_id]);
			logger.info("getting subscriptions based on leetcode id");
			return Promise.resolve(res.rows);
		} catch (err) {
			logger.error("error getting subscriptions based on leetcode id: " + err);
		}
		return Promise.resolve([]);
	}

	async checkIfSubscriptionToGuildAndLeetcodeAccountExists(leetcode_id: string, guild_id: string): Promise<boolean> {
		try {
			const res = await this.pool.query("SELECT * FROM SUBSCRIPTION WHERE leetcode_id = $1 AND guild_id = $2", [leetcode_id, guild_id]);
			if (res.rows.length > 0) {
				return Promise.resolve(true);
			}
			return Promise.resolve(false);
		} catch (err) {
			logger.error("error checking if subscription exists: " + err);
			return Promise.resolve(false);
		}
	}
}
