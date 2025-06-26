import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from "discord.js";
import dotenv from "dotenv";
import { ping } from "./view/test";
import {
  getQuestionContentBySlug,
  getQuestionStatsByTitleSlug,
  getUserRecentSubmissionsByUsername,
} from "./service/LeetCodeService";
import logger from "./utils/Logger";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  logger.info(`✅ Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    ping(message, "pong").then((embed) => {
      message.reply({ embeds: [embed] });
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
