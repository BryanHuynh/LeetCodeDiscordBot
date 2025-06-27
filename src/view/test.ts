import { CacheType, ChatInputCommandInteraction, EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js";
import { LeetCodeSubmissionBuilder } from "../model/LeetCodeSubmissionBuilder";
import LeetCodeSubmission from "../model/LeetCodeSubmission";

async function ping(interaction: ChatInputCommandInteraction<CacheType>) {
  const lcs: LeetCodeSubmission =
    await new LeetCodeSubmissionBuilder().buildLatestSubmissionFromServices(
      "BryanHuynh",
      interaction.user.id
    );

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
}

export { ping };
