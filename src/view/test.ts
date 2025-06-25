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
      `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)`
    )
    .withProblemUrl(
      "https://leetcode.com/problems/swap-nodes-in-pairs/description/"
    )
    .withDifficulty("easy")
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
      { name: "User", value: `${lcs.real_name} (<@${lcs.user}>)` },
      { name: "difficulty", value: `${lcs.difficulty}`, inline: true },
      { name: "language", value: lcs.language, inline: true },
      { name: "", value: `||\`\`\`ts\n${lcs.submitted_code}\n\`\`\`||` },
      { name: "runtime", value: `${lcs.runtime} ms`, inline: true },
      { name: "memory usage", value: `${lcs.memory_usage} MB`, inline: true }
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
