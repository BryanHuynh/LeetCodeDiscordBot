import { Channel, Embed, Message, PublicThreadChannel, TextChannel } from "discord.js";

export const AcSharingService = {
	async shareAc(channel: Channel, embed: Embed, title: string): Promise<Message> {
		if (!channel.isTextBased()) {
			return Promise.reject(new Error("channel is not text based")); // Added return here
		}
		try {
			const submissionMessage = await (channel as TextChannel).send({
				embeds: [embed],
			});
			const thread = await submissionMessage.startThread({
				name: `Discussion Thread ${title}`,
				reason: "Follow-up conversation",
			});
			return Promise.resolve(submissionMessage);
		} catch (err) {
			return Promise.reject(new Error("unable to share ac")); // Added return here
		}
	},
};
