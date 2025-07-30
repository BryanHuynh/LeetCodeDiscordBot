import { Client, Events, TextChannel } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";
import logger from "../utils/logger";

export class SubmissionSharingController {
	private dbService: ISubscriptionService;
	private client: Client;
	// used to share submissions to the server after the user has accepted to share the link
	constructor(dbService: ISubscriptionService, client: Client) {
		this.dbService = dbService;
		this.client = client;
	}

	init() {
		this.onShare();
	}

	private onShare() {
		this.client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isButton()) return;
			if (interaction.customId == "Share_AC_Button") {
				await interaction.deferUpdate();
				const submissionChannel = await this.dbService.retrieveGuildSubmissionChannel(
					interaction.guildId!
				);
				if (submissionChannel == null) {
					await interaction.followUp({
						content:
							"We could not find the assigned channel to share submissions. Contact admin to assign a public text channel with the /setchannel command",
						ephemeral: true,
					});
					return;
				} else {
					const channel = await this.client.channels.fetch(submissionChannel);
					if (channel == null) {
						await interaction.followUp({
							content: "Could not fetch the submission channel.",
							ephemeral: true,
						});
						return;
					}
					try {
						if (channel.isTextBased()) {
							const submissionMessage = await (channel as TextChannel).send({
								embeds: [interaction.message.embeds[0]],
							});
							await submissionMessage.startThread({
								name: `Discussion Thread ${interaction.message.embeds[0].title}`,
								reason: "Follow-up conversation",
							});
							submissionMessage.forward(interaction.channel as TextChannel);
							await interaction.editReply({ components: [] });
						} else {
							throw new Error("channel is not text based");
						}
					} catch (err) {
						await interaction.followUp({
							content:
								"we encountered an issue and were not able to share your submission",
							ephemeral: true,
						});
						logger.error(`${err} ${submissionChannel} ${interaction.guildId}`);
						return;
					}
				}
			}
		});
	}
}
