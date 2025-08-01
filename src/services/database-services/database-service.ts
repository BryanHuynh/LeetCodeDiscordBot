import 'reflect-metadata';
import { Pool, PoolConfig, QueryResult } from "pg";
import logger from "../../utils/logger";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseService {
	private pgConfig: PoolConfig;
	private pool: Pool;

	constructor() {
		this.pgConfig = {
			user: process.env.POSTGRES_USER,
			host: process.env.POSTGRES_HOST,
			database: process.env.POSTGRES_DATABASE,
			password: process.env.POSTGRES_PASSWORD,
			port: parseInt(process.env.POSTGRES_PORT || "5432"),
			ssl: true,
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
		logger.info(`Executing query: ${query} with params: ${params}`);
		// An async function automatically handles promise resolution and rejection.
		return this.pool.query(query, params);
	}
}
