import "reflect-metadata";
import { injectable } from "tsyringe";
import { DatabaseService } from "./database-service";
import logger from "../../utils/logger";
import { AcCompletion } from "../../models/ac-completion";

@injectable()
export class AcCompletionRepository {
	constructor(private dbService: DatabaseService) {}

	async addAcCompletion(ac_id: string, leetcode_id: string, timestamp: string): Promise<boolean> {
		try {
			const res = await this.dbService.execute(
				"insert into ac_completion (ac_id, leetcode_id, timestamp) values ($1, $2, $3)",
				[ac_id, leetcode_id, new Date(parseInt(timestamp) * 1000).toISOString()]
			);
			return Promise.resolve(true);
		} catch (err) {
			logger.error(`unable to add ac completion: ${ac_id} ${leetcode_id} ${err}`);
			return Promise.resolve(false);
		}
	}

	async getAcCompletionsByLeetcodeId(leetcode_id: string): Promise<AcCompletion[]> {
		const res = await this.dbService.execute(
			"select ac_id, leetcode_id, timestamp, created_at from ac_completion where leetcode_id = $1",
			[leetcode_id]
		);
		if (res.rows.length > 0) return res.rows;
		return Promise.resolve([]);
	}
}
