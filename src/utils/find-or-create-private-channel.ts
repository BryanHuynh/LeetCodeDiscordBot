import { Client, Guild, TextChannel, User } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";
import { createPrivateChannelRequest } from "../view/private-channel-request";
import { container } from "tsyringe";
import { ChannelRepository } from "../services/database-services/channel-repository";
import { Channel } from "../models/channel";

export const findOrCreatePrivateChannel = async (
	guild: Guild,
	discord_user: User,
	client: Client
): Promise<TextChannel | null> => {
	const channelRepo = container.resolve(ChannelRepository);
	const res: Channel | null = await channelRepo.getChannelByGuildAndDiscordId(
		guild.id,
		discord_user.id
	);
	if (res != null) {
		const channel = await client.channels.fetch(res.id);
		if (channel != null) {
			return channel as TextChannel;
		}
	}
	// CHECK AND SEE IF THREAD IS CREATED ON CREATION OR CREATED ON MESSAGE
	const channel = await createPrivateChannelRequest(guild, discord_user);
	if (channel == null) return null;
	await channelRepo.addChannel(channel.id, guild.id, discord_user.id);
	return channel;
};
