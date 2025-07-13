import { ISubscriptionService } from "./i-subscription-service";
import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger";

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

	async subscribe(id: string, discord_id: string, guild_id: string, guild_name: string): Promise<boolean> {
		try {
			await this.addDiscordAccount(discord_id);
			await this.addLeetcodeAccount(id);
			await this.addGuild(guild_id, guild_name);
			await this.addSubscription(discord_id, id, guild_id);
			return Promise.resolve(true);
		} catch (err) {
			console.error("Database connection error:", err);
		}
		return Promise.resolve(false);
	}

	unsubscribe(id: string, discord_id: string, guild_id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	async addDiscordAccount(discord_id: string): Promise<boolean> {
		try {
			const res = await this.pool.query("INSERT INTO DISCORD_ACCOUNT (id) VALUES ($1)", [discord_id]);
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
		try {
			const res = await this.pool.query("INSERT INTO SUBSCRIPTION (discord_id, leetcode_id, guild_id) VALUES ($1, $2, $3)", [discord_id, leetcode_id, guild_id]);
			logger.info("added subscription: " + discord_id + " " + leetcode_id + " " + guild_id);
			return Promise.resolve(true);
		} catch (err) {
			logger.error("error adding subscription: " + err);
			return Promise.resolve(false);
		}
	}


}
