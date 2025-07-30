import "reflect-metadata";
import { injectable } from "tsyringe";
import { DatabaseService } from "./database-service";
import logger from "../../utils/logger";

@injectable()
export class DiscordAccountRepository {
	constructor(private dbService: DatabaseService) {}

	async addDiscordAccount(id: string, username: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"insert into discord_account (id, username) values ($1, $2)",
				[id, username]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to add discord account: ${id} ${username}`);
			return Promise.resolve(false);
		}
	}
}
