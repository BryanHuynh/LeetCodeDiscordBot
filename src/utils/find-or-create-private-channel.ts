import { Client, Guild, TextChannel, User } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";
import { createPrivateChannelRequest } from "../view/private-channel-request";

export const findOrCreatePrivateChannel = async (
    guild: Guild,
    discord_user: User,
    client: Client,
    dbService: ISubscriptionService
): Promise<TextChannel | null> => {
    const retrieveChannel_id = await dbService.retrieveChannel(guild.id, discord_user.id);
    if (retrieveChannel_id != null) {
        const channel = await client.channels.fetch(retrieveChannel_id);
        if (channel != null) {
            return channel as TextChannel;
        }
    }
    // CHECK AND SEE IF THREAD IS CREATED ON CREATION OR CREATED ON MESSAGE
    const channel = await createPrivateChannelRequest(guild, discord_user);
    if (channel == null) return null;
    await dbService.saveChannel(channel.id, guild.id, discord_user.id);
    return channel;
};
