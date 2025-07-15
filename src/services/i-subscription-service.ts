export interface ISubscriptionService {
	getUserACIds(leetcode_id: string): Promise<String[]>;
    subscribe(id: string, discord_id: string, guild_id: string, guild_name: string): Promise<boolean>;
    unsubscribe(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    getLeetcodeAccounts(): Promise<string[]>;
    init(): void;
}
