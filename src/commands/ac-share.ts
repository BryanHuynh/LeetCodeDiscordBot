import { ButtonInteraction, TextChannel } from "discord.js";
import { GuildRepository } from "../services/database-services/guild-repository";
import { container } from "tsyringe";
import { AcSharingService } from "../services/ac-sharing-services";
import { Logger } from "../utils/Logger";

export const execute = async function (interaction: ButtonInteraction) {
	await interaction.deferUpdate();
	const guildRepo = container.resolve(GuildRepository);
	const submissionChannel = await guildRepo
		.getGuildById(interaction.guildId!)
		.then((res) => res?.submission_channel_id);
	if (submissionChannel == null) {
		await interaction.followUp({
			content:
				"We could not find the assigned channel to share submissions. Contact admin to assign a public text channel with the /setchannel command",
			ephemeral: true,
		});
		return;
	}
	const channel = await interaction.client.channels.fetch(submissionChannel);
	if (channel == null) {
		await interaction.followUp({
			content:
				"We could not find the assigned channel to share submissions. Contact admin to assign a public text channel with the /setchannel command",
			ephemeral: true,
		});
		return;
	}
	AcSharingService.shareAc(
		channel,
		interaction.message.embeds[0],
		interaction.message.embeds[0].title || "Leetcode Submission"
	)
		.then((res) => {
			interaction.editReply({ components: [] });
			res.forward(interaction.channel as TextChannel);
		})
		.catch((err) => {
			Logger.error(err);
			interaction.followUp({
				content: "we encountered an issue and were not able to share your submission",
				ephemeral: true,
			});
		});
};
