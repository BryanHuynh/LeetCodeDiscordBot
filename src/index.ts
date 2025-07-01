import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import logger from "./utils/logger";
import { PingController } from "./controllers/ping-controller";
import { LinkingLeetCodeController } from "./controllers/linking-leetcode-controller";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let pingController: PingController;
let linkingLeetCodeController: LinkingLeetCodeController;

client.once(Events.ClientReady, () => {
  logger.info(`✅ Logged in as ${client.user?.tag}`);
  pingController = new PingController(client);
  pingController.init();
  linkingLeetCodeController = new LinkingLeetCodeController(client);
  linkingLeetCodeController.init();
});

client.login(process.env.DISCORD_TOKEN);
