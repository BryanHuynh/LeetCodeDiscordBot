import {
	ActionRowBuilder,
	ChannelType,
	Client,
	Events,
	GuildMember,
	ModalBuilder,
	PermissionFlagsBits,
	PermissionsBitField,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";

export class ChannelSettingController {
	private client: Client;
	private slashCommandBuilder: SlashCommandBuilder;
	private dbService: ISubscriptionService;

	constructor(client: Client, dbService: ISubscriptionService) {
		this.client = client;
		this.slashCommandBuilder = new SlashCommandBuilder()
			.setName("setchannel")
			.setDescription("Assign the channel that the bot will share submissions");

		this.dbService = dbService;
	}

	init() {
		this.onSetChannel();
	}

	private onSetChannel() {
		this.client.application?.commands.create(this.slashCommandBuilder);

		this.client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isChatInputCommand()) return;
			if (interaction.commandName === "setchannel") {
				if (
					!(
						interaction.member instanceof GuildMember &&
						interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
					)
				) {
					return interaction.reply({
						content: "You need to be an administrator to use this command.",
						ephemeral: true,
					});
				}
                console.log('admin')
				const modal = new ModalBuilder()
					.setCustomId("setChannelModal")
					.setTitle("Set Bot Channel");

				const input = new TextInputBuilder()
					.setCustomId("setChannelInput")
                    .setLabel("What's the name of the channel?")
					.setStyle(TextInputStyle.Short);

				const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
				modal.addComponents(row);

				await interaction.showModal(modal);
			}
		});
        
        this.client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isModalSubmit()) return;

			if (interaction.customId === "setChannelModal") {
                const channelName = interaction.fields.getTextInputValue("setChannelInput");
                const guild = interaction.guild;
                console.log(interaction.fields.getTextInputValue("setChannelInput"))
            }
		});
	}
}
