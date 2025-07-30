import 'reflect-metadata';
import { Pool, PoolConfig, QueryResult } from "pg";
import dotenv from "dotenv";
import logger from "../../utils/logger";
import { injectable } from "tsyringe";

@injectable()
export class DatabaseService {
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
		this.init();
	}

	init(): void {
		process.on("SIGINT", async () => {
			console.log("Closing database pool...");
			await this.pool.end();
			process.exit();
		});
	}

	async execute(query: string, params?: any[]): Promise<QueryResult<any>> {
		try {
			logger.info(`Executing query: ${query} with params: ${params}`);
			const res = await this.pool.query(query, params);
			return Promise.resolve(res);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
