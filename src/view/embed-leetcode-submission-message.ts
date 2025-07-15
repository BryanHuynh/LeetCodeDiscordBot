import { EmbedBuilder } from "discord.js";
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
