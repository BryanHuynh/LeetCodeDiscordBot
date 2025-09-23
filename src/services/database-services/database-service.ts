import "reflect-metadata";
import { Pool, PoolConfig, QueryResult } from "pg";
import { singleton } from "tsyringe";
import { Logger } from "../../utils/Logger";
import { sendEmail } from "../../utils/send-email";

export class DatabaseConnectionError extends Error {}

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

	async testDatabase(): Promise<boolean> {
		try {
			const res = this.pool.query("select 1");
			return true;
		} catch (err) {
			if (!process.env.EMAIL) return false;
			sendEmail(
				process.env.EMAIL,
				"LeetBro Status Update",
				"Leet bro was unable to connect to the database"
			).catch((emailError) => {
				Logger.error("Failed to send crash report email:", emailError);
			});
			return false;
		}
	}

	async execute(query: string, params?: any[]): Promise<QueryResult<any>> {
		const dbStatus = await this.testDatabase();
		if (!dbStatus) throw new DatabaseConnectionError();
		Logger.info(`Executing query: ${query} with params: ${params}`);
		// An async function automatically handles promise resolution and rejection.
		return this.pool.query(query, params);
	}
}
