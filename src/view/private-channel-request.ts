import { Client, Guild, Message, PermissionsBitField, TextChannel, User } from "discord.js";
import LeetCodeSubmission from "../models/leetcode-submission";
import { acMessageActionButtonRow, EmbedLeetcodeSubmissionMessage } from "./embed-leetcode-submission-message";
import logger from "../utils/logger";

export const createPrivateChannelRequest = async (guild: Guild, user: User, lcs: LeetCodeSubmission): Promise<TextChannel | null> => {
	try {
		const channel = await guild.channels.create({
			name: `private-${user.username}-${lcs.problem_name}`,
			type: 0,
			permissionOverwrites: [
				{
					id: guild.roles.everyone.id,
					deny: [PermissionsBitField.Flags.ViewChannel],
				},
				{
					id: user.id,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
				},
				{
					id: guild.members.me!.id,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.ManageChannels],
				},
			],
		});
		return Promise.resolve(channel);
	} catch (err) {
		logger.error("Failed to create private channel:", err);
	}
	return Promise.resolve(null);
};

export const createPrivateChannelMessage = async (channel: TextChannel, lcs: LeetCodeSubmission): Promise<Message | null> => {
	
	try {
		const message = await channel.send({
			embeds: [EmbedLeetcodeSubmissionMessage(lcs)],
			components: [acMessageActionButtonRow()],
		});
		return Promise.resolve(message);
	} catch (err) {
		logger.error("failed to create embed Message", err);
	}
	return Promise.resolve(null);
};
