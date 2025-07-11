import {
    ActionRowBuilder,
    Client,
    Events,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { validateLeetCodeAccount } from "../services/leetcode-service";
import logger from "../utils/logger";
import { ISubscriptionService } from "../services/i-subscription-service";

export class LinkingLeetCodeController {
    private client: Client;
    private linkingLeetCodeCommand: SlashCommandBuilder;
    private subscriptionService: ISubscriptionService;

    constructor(client: Client, subscriptionService: ISubscriptionService) {
        this.client = client;
        this.linkingLeetCodeCommand = new SlashCommandBuilder()
            .setName("linkleetcode")
            .setDescription("Link your Discord with your LeetCode account");
        this.subscriptionService = subscriptionService;
    }

    init() {
        this.onLinkingLeetCode();
    }

    onLinkingLeetCode() {
        this.client.application?.commands.create(this.linkingLeetCodeCommand);

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            if (interaction.commandName === "linkleetcode") {
                const modal = new ModalBuilder()
                    .setCustomId("LinkLeetCodeModal")
                    .setTitle("Link your leetcode account with Discord");

                const input = new TextInputBuilder()
                    .setCustomId("leetcode_account")
                    .setLabel("What's your leetcode account name?")
                    .setStyle(TextInputStyle.Short);

                const row =
                    new ActionRowBuilder<TextInputBuilder>().addComponents(
                        input
                    );
                modal.addComponents(row);

                await interaction.showModal(modal);
            }
        });

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isModalSubmit()) return;

            if (interaction.customId === "LinkLeetCodeModal") {
                console.log("linked leetcode triggered");
                const response =
                    interaction.fields.getTextInputValue("leetcode_account");
                const isValidAccount = await validateLeetCodeAccount(response);
                if (!isValidAccount) {
                    await interaction.reply(
                        `unable to find leetcode account: ${response} (it could be private)`
                    );
                } else {
                    logger.info(
                        `leetcode account: ${response} linked to ${interaction.user.username}`
                    );
                    this.subscriptionService.subscribe(
                        response,
                        interaction.user.username,
                        interaction.guildId!
                    );
                    await interaction.reply(
                        `Your leetcode account is: ${response} linked`
                    );
                }
            }
        });
    }
}
