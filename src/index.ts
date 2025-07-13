import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { PingController } from "./controllers/ping-controller";
import { LinkingLeetCodeController } from "./controllers/linking-leetcode-controller";
import { FirestoreService } from "./services/firestore-service";
import { ISubscriptionService } from "./services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "./services/leetcode-service";
import logger from "./utils/logger";
import { PostgresService } from "./services/postgres-service";

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

let pingController: PingController;
let linkingLeetCodeController: LinkingLeetCodeController;
let subscriptionService: ISubscriptionService = new PostgresService();

client.once(Events.ClientReady, () => {
	logger.info(`✅ Logged in as ${client.user?.tag}`);
	pingController = new PingController(client);
	pingController.init();
	linkingLeetCodeController = new LinkingLeetCodeController(client, subscriptionService);
	linkingLeetCodeController.init();
	subscriptionService.init();
	subscriptionService.subscribe('BryanHuynh', 'vertigo8667', '1148093819397623918', 'Vertigos Server')
});


client.login(process.env.DISCORD_TOKEN);
