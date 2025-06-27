import { Client, SlashCommandBuilder } from "discord.js";
import { ping } from "../view/test";

export class PingController {
  private client: Client;
  private pingCommand: SlashCommandBuilder;

  constructor(client: Client) {
    this.client = client;
    this.pingCommand = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with recent leetcode submission");
  }

  init() {
    this.onPing();
  }

  onPing() {
    this.client.application?.commands.create(this.pingCommand);
    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      if (interaction.commandName === "ping") {
        const embed = await ping(interaction);
        const reply = await interaction.reply({
          embeds: [embed],
          fetchReply: true,
        });

        const thread = await reply.startThread({
          name: "Discussion Thread",
          reason: "Follow-up conversation",
        });
      }
    });
  }
}
