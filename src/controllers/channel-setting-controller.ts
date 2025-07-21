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
				if(interaction.guild?.id == undefined || interaction.channel?.id == undefined) {
					return interaction.reply({
						content: "Unable to identify this channel.",
						ephemeral: true,
					});
				}
				await this.dbService.assignSubmissionChannel(interaction.guild.id, interaction.channel.id).then((res) => {
					let content = "We were unable to assign this channel";
					if(res) content = "This channel has been set to share submissions";
					return interaction.reply({
						content: content,
						ephemeral: true,
					})
				});

			}
		});
	}
}
