export interface ISubscriptionService {
    subscribe(id: string, discord_id: string, guild_id: string, guild_name: string): Promise<boolean>;
    unsubscribe(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean>;
    init(): void;
}
