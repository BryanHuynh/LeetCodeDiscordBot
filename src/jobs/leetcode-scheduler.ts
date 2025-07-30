import cron, { ScheduledTask } from "node-cron";
import logger from "../utils/logger";
import { Client } from "discord.js";

export class LeetcodeScheduler {
	private job: ScheduledTask | null = null;
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	start(jobFunc: (client: Client) => Promise<void>) {
		logger.info("starting leetcode scheduler");

		this.job = cron.schedule("*/5 * * * *", () => {
			jobFunc(this.client);
		});
		jobFunc(this.client);
	}

	stop() {
		if (!this.job) return;
		this.job.stop();
	}
}
