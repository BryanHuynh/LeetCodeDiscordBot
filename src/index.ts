import { Client, Events, GatewayIntentBits, Guild, Partials, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import "reflect-metadata";
import logger from "./utils/logger";
import { LeetcodeScheduler } from "./jobs/leetcode-scheduler";
import { leetcodeAcDiscordMessageJob } from "./jobs/leetcode-ac-discord-message-job";
import { DatabaseService } from "./services/database-services/database-service";
import { InteractionCreateHandler } from "./handler/interaction-create-handler";
import { data as subscribeCommand } from "./commands/subscribe";
import { data as setChannelCommand } from "./commands/set-channel";

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

// let linkingLeetCodeController: LinkingLeetCodeController;
let subscriptionService: DatabaseService = new DatabaseService();
let leetcodeScheduler: LeetcodeScheduler;
// let channelSettingController: ChannelSettingController;
// let submissionSharingController: SubmissionSharingController;

client.once(Events.ClientReady, () => {
	logger.info(`✅ Logged in as ${client.user?.tag}`);

	// subscriptionService.init();
	leetcodeScheduler = new LeetcodeScheduler(client);
	leetcodeScheduler.start(leetcodeAcDiscordMessageJob);
	// channelSettingController = new ChannelSettingController(client, subscriptionService);
	// channelSettingController.init();
	// submissionSharingController = new SubmissionSharingController(subscriptionService, client);
	// submissionSharingController.init();
});

client.on(Events.InteractionCreate, InteractionCreateHandler.execute);

client.on(Events.GuildCreate, (guild) => {
	logger.info(`joined guild ${guild.name}`);
});

client.login(process.env.DISCORD_TOKEN);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
const commands = [subscribeCommand.toJSON(), setChannelCommand.toJSON()];

(async () => {
	try {
		console.log("🔄 Registering slash commands...");
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID!), // Global registration
			{ body: commands }
		);
		console.log("✅ Slash commands registered.");
	} catch (error) {
		console.error("❌ Failed to register commands:", error);
	}
})();
