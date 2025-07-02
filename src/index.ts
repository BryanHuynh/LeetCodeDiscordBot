import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import logger from "./utils/logger";
import { PingController } from "./controllers/ping-controller";
import { LinkingLeetCodeController } from "./controllers/linking-leetcode-controller";
import { FirestoreService } from "./services/firestore-service";
import { ISubscriptionService } from "./services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "./services/leetcode-service";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let pingController: PingController;
let linkingLeetCodeController: LinkingLeetCodeController;
let subscriptionService: ISubscriptionService = new FirestoreService();

client.once(Events.ClientReady, () => {
	logger.info(`✅ Logged in as ${client.user?.tag}`);
	pingController = new PingController(client);
	pingController.init();
	linkingLeetCodeController = new LinkingLeetCodeController(client, subscriptionService);
	linkingLeetCodeController.init();
	subscriptionService.init();
});


client.login(process.env.DISCORD_TOKEN);
