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

client.on("messageCreate", async (message) => {
  if (message.content === "!code") {
    const button = new ButtonBuilder()
      .setCustomId("show_code")
      .setLabel("Show Code")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await message.reply({
      content: "Click the button to see the code!",
      components: [row],
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "show_code") {
    const code = `const greet = () => {\n  console.log("Hello, world!");\n};`;
    const embed = new EmbedBuilder()
      .setTitle("Code Example")
      .setDescription(`\`\`\`ts\n${code}\n\`\`\``)
      .setColor(0x00ffcc);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true, // 👈 makes it only visible to the user who clicked
    });
  }
});
client.login(process.env.DISCORD_TOKEN);
