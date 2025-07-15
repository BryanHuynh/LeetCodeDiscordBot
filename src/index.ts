import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

import { PingController } from "./controllers/ping-controller";
import { LinkingLeetCodeController } from "./controllers/linking-leetcode-controller";
import { FirestoreService } from "./services/firestore-service";
import { ISubscriptionService } from "./services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "./services/leetcode-service";
import logger from "./utils/logger";
import { PostgresService } from "./services/postgres-service";
import { LeetcodeScheduler } from "./jobs/leetcode-scheduler";
import { findNewAcs } from "./utils/find-new-acs";
import { leetcodeAcDiscordMessageJob } from "./jobs/leetcode-ac-discord-message-job";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
	partials: [Partials.Channel],
});

let pingController: PingController;
let linkingLeetCodeController: LinkingLeetCodeController;
let subscriptionService: ISubscriptionService = new PostgresService();
let leetcodeScheduler: LeetcodeScheduler = new LeetcodeScheduler(subscriptionService);

client.once(Events.ClientReady, () => {
	logger.info(`✅ Logged in as ${client.user?.tag}`);
	pingController = new PingController(client);
	pingController.init();
	linkingLeetCodeController = new LinkingLeetCodeController(client, subscriptionService);
	linkingLeetCodeController.init();
	subscriptionService.init();
	leetcodeScheduler.start(leetcodeAcDiscordMessageJob);
	// trigger(client);
});

client.login(process.env.DISCORD_TOKEN);
