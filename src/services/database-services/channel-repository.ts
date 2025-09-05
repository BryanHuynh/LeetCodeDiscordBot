import "reflect-metadata";
import { injectable } from "tsyringe";
import { DatabaseService } from "./database-service";
import { Channel } from "../../models/channel";
import { Logger } from "../../utils/Logger";

@injectable()
export class ChannelRepository {
	constructor(private dbService: DatabaseService) {}

	async addChannel(id: string, guild_id: string, discord_id: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"INSERT INTO CHANNEL (id, guild_id, discord_id) VALUES ($1, $2, $3)",
				[id, guild_id, discord_id]
			);
			return Promise.resolve(true);
		} catch (err) {
			Logger.error(`unable to add channel: ${id} ${guild_id} ${discord_id}`);
			return Promise.resolve(false);
		}
	}

	async getChannelByGuildAndDiscordId(
		guild_id: string,
		discord_id: string
	): Promise<Channel[] | null> {
		try {
			const res = await this.dbService.execute(
				"SELECT id, guild_id, discord_id, created_at FROM CHANNEL WHERE guild_id = $1 AND discord_id = $2",
				[guild_id, discord_id]
			);
			if (res.rows.length > 0) return res.rows;
			return Promise.resolve(null);
		} catch (err) {
			Logger.error(`unable to get channel: ${guild_id} ${discord_id}`);
			return Promise.resolve(null);
		}
	}

	async deleteChannelByGuildAndChannelId(guild_id: string, channel_id: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"DELETE FROM CHANNEL WHERE guild_id = $1 AND ID = $2",
				[guild_id, channel_id]
			);
			if (res.rows.length > 0) true;
			return Promise.resolve(false);
		} catch (err) {
			Logger.error(`unable to get channel: ${guild_id} ${channel_id}`);
			return Promise.resolve(true);
		}
	}
}
