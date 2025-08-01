import {
	ChannelType,
	Client,
	Guild,
	Message,
	PermissionFlagsBits,
	PermissionsBitField,
	TextChannel,
	User,
} from "discord.js";
import LeetCodeSubmission from "../models/leetcode-submission";
import {
	acMessageActionButtonRow,
	EmbedLeetcodeSubmissionMessage,
} from "./embed-leetcode-submission-message";
import { Logger } from "../utils/Logger";

export const createPrivateChannelRequest = async (
	guild: Guild,
	user: User
): Promise<TextChannel | null> => {
	try {
		const channel = await guild.channels.create({
			name: `Leetbro-submissions`,
			type: ChannelType.GuildText,
			permissionOverwrites: [
				{
					id: guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: user.id,
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
				},
				{
					id: guild.members.me!.id,
					allow: [
						PermissionsBitField.Flags.ViewChannel,
						PermissionsBitField.Flags.SendMessages,
						PermissionsBitField.Flags.ReadMessageHistory,
						PermissionsBitField.Flags.ManageChannels,
					],
				},
			],
		});
		return Promise.resolve(channel);
	} catch (err) {
		Logger.error("Failed to create private channel:", err);
	}
	return Promise.resolve(null);
};

export const sendPrivateChannelLCS = async (
	channel: TextChannel,
	lcs: LeetCodeSubmission
): Promise<Message | null> => {
	try {
		const message = await channel.send({
			embeds: [EmbedLeetcodeSubmissionMessage(lcs)],
			components: [acMessageActionButtonRow()],
		});
		return Promise.resolve(message);
	} catch (err) {
		Logger.error("failed to create embed Message", err);
	}
	return Promise.resolve(null);
};

export const sendPrivateChannelGreetingMessage = async (
	channel: TextChannel,
	discord_user: User,
	leetcode_id: string
) => {
	try {
		const message = await channel.send(
			`Thank you for linking your leetcode account: ${leetcode_id} to your discord account: ${discord_user.username}. \n` +
				`When you complete a leetcode problem, we will update you here in this thread if you want to share your submission results with the rest of the server`
		);
		return Promise.resolve(message);
	} catch (err) {
		Logger.error("failed to create greeting Message", err);
	}
	return Promise.resolve(null);
};
