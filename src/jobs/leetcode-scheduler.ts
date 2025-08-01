import cron, { ScheduledTask } from "node-cron";
import { Client } from "discord.js";
import { Logger } from "../utils/Logger";

export class LeetcodeScheduler {
	private job: ScheduledTask | null = null;
	private client: Client;

	constructor(client: Client) {
		this.client = client;
	}

	start(jobFunc: (client: Client) => Promise<void>) {
		Logger.info("starting leetcode scheduler");

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
