import { Client } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";
import { findNewAcs } from "../utils/find-new-acs";
import { createPrivateChannelMessage, createPrivateChannelRequest } from "../view/private-channel-request";

export const leetcodeAcDiscordMessageJob = async (dbService: ISubscriptionService, client: Client) => {
	const leetcode_id_acs = await findNewAcs(dbService);
	if (leetcode_id_acs == null || Object.keys(leetcode_id_acs).length == 0) return;
    for(const leetcode_id in leetcode_id_acs) {
        const subscriptions = await dbService.getSubscriptionsBasedOnLeetcodeId(leetcode_id);
        subscriptions.forEach(async (subscription) => {
            const guild = client.guilds.cache.get(subscription.guild_id);
            const user = await client.users.fetch(subscription.discord_id);
            if(guild == null || user == null) return;
            const channel = await createPrivateChannelRequest(guild, user)
        })
    }
};




