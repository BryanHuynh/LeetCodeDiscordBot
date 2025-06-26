import { EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js";
import { LeetCodeSubmissionBuilder } from "../model/LeetCodeSubmissionBuilder";
import LeetCodeSubmission from "../model/LeetCodeSubmission";

async function ping(
  user: OmitPartialGroupDMChannel<Message<boolean>>,
  message: string
) {
  const lcs: LeetCodeSubmission =
    await new LeetCodeSubmissionBuilder().buildLatestSubmissionFromServices(
      "BryanHuynh",
      user.author.id
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
      { name: "difficulty", value: `${lcs.difficulty}`, inline: true }
    )
    .setDescription(lcs.problem_description)
    .setFooter({
      text: `Accepted: ${lcs.accepted_submissions}/${lcs.total_submissions} | Acceptance Rate: ${lcs.acceptance_rate}%`,
    })
    .setColor("Random");
}

export { ping };
