import cron, { ScheduledTask } from "node-cron";
import { ISubscriptionService } from "../services/i-subscription-service";
import logger from "../utils/logger";
import { UserProblems } from "../services/types/user-submission";
import { Client } from "discord.js";

export class LeetcodeScheduler {
	private job: ScheduledTask | null = null;
    private databaseService: ISubscriptionService;
	private client: Client;

	constructor(databaseService: ISubscriptionService, client: Client) {
        this.databaseService = databaseService;
		this.client = client;
    }

	start(jobFunc: (dbService: ISubscriptionService, client: Client) => Promise<void>) {
        logger.info("starting leetcode scheduler");

		this.job = cron.schedule("*/5 * * * *", () => {
            jobFunc(this.databaseService, this.client);
		});
        jobFunc(this.databaseService, this.client);
	}

	stop() {
		if (!this.job) return;
		this.job.stop();
	}
}
