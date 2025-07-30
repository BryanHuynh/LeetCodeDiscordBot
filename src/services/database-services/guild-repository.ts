import { injectable } from "tsyringe";
import { DatabaseService } from "./database-service";
import "reflect-metadata";
import { Guild } from "../../models/guild";
import logger from "../../utils/logger";

@injectable()
export class GuildRepository {
	constructor(private dbService: DatabaseService) {}

	async addGuild(id: string, guild_name: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"insert into guild (id, guild_name) values ($1, $2)",
				[id, guild_name]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to add guild: ${id} ${guild_name}`);
			return Promise.resolve(false);
		}
	}

	async getGuildById(id: string): Promise<Guild | null> {
		const res = await this.dbService.execute(
			"select id, guild_name, submission_channel_id, created_at from guild where id = $1",
			[id]
		);
		if (res.rows.length > 0) return res.rows[0];
		return Promise.resolve(null);
	}
}
