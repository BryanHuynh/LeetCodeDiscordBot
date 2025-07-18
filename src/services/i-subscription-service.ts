import { ISubscriptions } from "./types/subscriptions";

export interface ISubscriptionService {
	getUserACIds(leetcode_id: string): Promise<String[]>;
    subscribe(id: string, discord_id: string, discord_username: string, guild_id: string, guild_name: string): Promise<boolean>;
    unsubscribe(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    getLeetcodeAccounts(): Promise<string[]>;
    getSubscriptionsBasedOnLeetcodeId(leetcode_id: string): Promise<ISubscriptions[]>;
    saveChannel(channel_id: string, guild_id: string, discord_id: string): Promise<boolean>;
    retrieveChannel(guild_id: string, discord_id: string): Promise<string | null>;
    saveAC(id: string, leetcode_id: string, timestamp: number): Promise<boolean>;
    init(): void;
}
