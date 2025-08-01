import { Client, Events, GatewayIntentBits, Guild, Partials, REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { LeetcodeScheduler } from "./jobs/leetcode-scheduler";
import { leetcodeAcDiscordMessageJob } from "./jobs/leetcode-ac-discord-message-job";
import { InteractionCreateHandler } from "./handler/interaction-create-handler";
import { data as subscribeCommand } from "./commands/subscribe";
import { data as setChannelCommand } from "./commands/set-channel";
import { data as unsubscribeCommand } from "./commands/unsubscribe";
import { Logger } from "./utils/Logger";


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

let leetcodeScheduler: LeetcodeScheduler;

client.once(Events.ClientReady, () => {
	Logger.info(`✅ Logged in as ${client.user?.tag}`);
	leetcodeScheduler = new LeetcodeScheduler(client);
	leetcodeScheduler.start(leetcodeAcDiscordMessageJob);
});

client.on(Events.InteractionCreate, InteractionCreateHandler.execute);

client.on(Events.GuildCreate, (guild) => {
	Logger.info(`joined guild ${guild.name}`);
});

client.login(process.env.DISCORD_TOKEN);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
const commands = [subscribeCommand.toJSON(), setChannelCommand.toJSON(), unsubscribeCommand.toJSON()];

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
