import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { ping } from "./view/test";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    const embed = ping(message, "pong");
    message.reply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
