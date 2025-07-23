import { Client, Events, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

import { PingController } from "./controllers/ping-controller";
import { LinkingLeetCodeController } from "./controllers/linking-leetcode-controller";
import { ISubscriptionService } from "./services/i-subscription-service";
import logger from "./utils/logger";
import { PostgresService } from "./services/postgres-service";
import { LeetcodeScheduler } from "./jobs/leetcode-scheduler";
import { leetcodeAcDiscordMessageJob } from "./jobs/leetcode-ac-discord-message-job";
import { ChannelSettingController } from "./controllers/channel-setting-controller";
import { SubmissionSharingController } from "./controllers/submission-sharing-controller";

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

let pingController: PingController;
let linkingLeetCodeController: LinkingLeetCodeController;
let subscriptionService: ISubscriptionService = new PostgresService();
let leetcodeScheduler: LeetcodeScheduler;
let channelSettingController: ChannelSettingController;
let submissionSharingController: SubmissionSharingController;

client.once(Events.ClientReady, () => {
	logger.info(`✅ Logged in as ${client.user?.tag}`);
	pingController = new PingController(client);
	pingController.init();
	linkingLeetCodeController = new LinkingLeetCodeController(client, subscriptionService);
	linkingLeetCodeController.init();
	subscriptionService.init();
	leetcodeScheduler = new LeetcodeScheduler(subscriptionService, client);
	leetcodeScheduler.start(leetcodeAcDiscordMessageJob);
	channelSettingController = new ChannelSettingController(client, subscriptionService);
	channelSettingController.init();
	submissionSharingController = new SubmissionSharingController(subscriptionService, client);
	submissionSharingController.init();
});


client.on(Events.GuildCreate, (guild) => {
	logger.info(`joined guild ${guild.name}`);
})

client.login(process.env.DISCORD_TOKEN);
