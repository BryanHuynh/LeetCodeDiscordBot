import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, EmbedBuilder } from "discord.js";
import LeetCodeSubmission from "../models/leetcode-submission";

export const EmbedLeetcodeSubmissionMessage = (lcs: LeetCodeSubmission): EmbedBuilder => {
	return new EmbedBuilder()
		.setTitle(lcs.problem_name)
		.setURL(lcs.problem_url)
		.addFields(
			{
				name: "User",
				value: `${lcs.user} (<@${lcs.discord_name}>)`,
				inline: true,
			},
			{ name: "Difficulty", value: `${lcs.difficulty}`, inline: true },
			{ name: "Submission link", value: `${lcs.submission_url}` }
		)
		.setDescription(lcs.problem_description)
		.setFooter({
			text: `Accepted: ${lcs.accepted_submissions}/${lcs.total_submissions} | Acceptance Rate: ${lcs.acceptance_rate}%`,
		})
		.setColor("Random");
};

export const acMessageActionButtonRow = () => {
	return new ActionRowBuilder<ButtonBuilder>().addComponents(bottonComponent("SHARE"), bottonComponent("DO NOT SHARE"));
};

const bottonComponent = (action: "SHARE" | "DO NOT SHARE") => {
	return new ButtonBuilder()
		.setCustomId(`BUTTON_ACTION_${action}_AC_MESSAGE`)
		.setLabel(action)
		.setStyle(action == 'SHARE' ? ButtonStyle.Success : ButtonStyle.Danger); 
};
