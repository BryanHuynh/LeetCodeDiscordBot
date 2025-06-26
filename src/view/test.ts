import { EmbedBuilder, Message, OmitPartialGroupDMChannel } from "discord.js";
import { LeetCodeSubmissionBuilder } from "../model/LeetCodeSubmissionBuilder";
import LeetCodeSubmission from "../model/LeetCodeSubmission";

function ping(
  user: OmitPartialGroupDMChannel<Message<boolean>>,
  message: string
) {
  const lcs: LeetCodeSubmission = new LeetCodeSubmissionBuilder()
    .withUser(user.author.id)
    .withRealName("Bryan Huynh")
    .withProblemName("24. Swap Nodes in Pairs")
    .withProblemDescription(
      `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.\n\n` +
        `Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.\n\n`
    )
    .withProblemUrl(
      "https://leetcode.com/problems/swap-nodes-in-pairs/description/"
    )
    .withDifficulty("Easy")
    .withLanguage("TypeScript")
    .withRuntime(1000)
    .withSubmittedCode("Console.log(Hello world)")
    .withAcceptedSubmissions(100)
    .withTotalSubmissions(200)
    .withSubmittedCode(
      `const greet = () => {\n  console.log("Hello, world!");\n};`
    )
    .build();

  return new EmbedBuilder()
    .setTitle(lcs.problem_name)
    .setURL(lcs.problem_url)
    .setDescription(lcs.problem_description)
    .addFields(
      { name: "User", value: `${lcs.real_name} (<@${lcs.user}>)`, inline: true},
      { name: "difficulty", value: `${lcs.difficulty}`, inline: true }
    )
    .setFooter({
      text: `Accepted: ${lcs.accepted_submissions}/${
        lcs.total_submissions
      } | Acceptance Rate: ${
        (lcs.accepted_submissions / lcs.total_submissions) * 100
      }%`,
    })
    .setColor("Random");
}

export { ping };
