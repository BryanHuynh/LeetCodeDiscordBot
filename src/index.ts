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
import { getQuestionContentBySlug, getQuestionStatsByTitleSlug } from "./service/LeetCodeService";
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
    const embed = ping(message, "pong");
    message.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);

getQuestionStatsByTitleSlug('two-sum').then(console.log)
