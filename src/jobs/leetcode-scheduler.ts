import cron, { ScheduledTask } from "node-cron";
import { ISubscriptionService } from "../services/i-subscription-service";
import logger from "../utils/logger";

export class LeetcodeScheduler {
	private job: ScheduledTask | null = null;
    private databaseService: ISubscriptionService;

	constructor(databaseService: ISubscriptionService) {
        this.databaseService = databaseService;
    }

	start(jobFunc: (dbService: ISubscriptionService) => void) {
        logger.info("starting leetcode scheduler");

		this.job = cron.schedule("*/5 * * * *", () => {
            jobFunc(this.databaseService);
		});
        jobFunc(this.databaseService);
	}

	stop() {
		if (!this.job) return;
		this.job.stop();
	}
}
