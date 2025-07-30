import { injectable } from "tsyringe";
import { LeetcodeAccount } from "../../models/leetcode-account";
import { DatabaseService } from "./database-service";
import "reflect-metadata";
import logger from "../../utils/logger";

@injectable()
export class LeetCodeAccountRepository {
	constructor(private dbService: DatabaseService) {}

	async addAccount(id: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"INSERT INTO LEETCODE_ACCOUNT (id) VALUES ($1)",
				[id]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to add leetcode account: ${id}`);
			return Promise.resolve(false);
		}
	}

	async getAccountById(id: string): Promise<LeetcodeAccount | null> {
		try {
			const res = await this.dbService.execute(
				"select id, created_at from leetcode_account where id = $1",
				[id]
			);
			if (res.rows.length > 0) return res.rows[0];
		} catch (err) {
			logger.error(`unable to get leetcode account: ${id}`);
		}

		return Promise.resolve(null);
	}

	async getAllAccounts(): Promise<LeetcodeAccount[]> {
		try {
			const res = await this.dbService.execute("select id, created_at from leetcode_account");
			if (res.rows.length > 0) return res.rows;
		} catch (err) {
			logger.error(`unable to get all leetcode accounts`);
		}

		return Promise.resolve([]);
	}

	async deleteAccountById(id: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute("delete from leetcode_account where id = $1", [
				id,
			]);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to delete leetcode account: ${id}`);
		}
		return Promise.resolve(false);
	}
}
