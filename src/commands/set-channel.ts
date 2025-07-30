import { Guild, GuildMember, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { container } from "tsyringe";
import { ChannelRepository } from "../services/database-services/channel-repository";
import { GuildRepository } from "../services/database-services/guild-repository";

export const data = new SlashCommandBuilder()
	.setName("set-channel")
	.setDescription("Assign this text channel and the bot will share submissions here");

export const execute = async (interaction: any) => {
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
	if (interaction.guild?.id == undefined || interaction.channel?.id == undefined) {
		return interaction.reply({
			content: "Unable to identify this channel.",
			ephemeral: true,
		});
	}
	const guildRepo = container.resolve(GuildRepository);
	await guildRepo.setChannelToGuild(interaction.guild.id, interaction.channel.id).then((res) => {
		let content = "We were unable to assign this channel";
		if (res) content = "This channel has been set to share submissions";
		return interaction.reply({
			content: content,
		});
	});
};
