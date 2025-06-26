import { DifficultyLevel } from "./DifficultyLevel";
import LeetCodeSubmissionBuilder from "./LeetCodeSubmissionBuilder";

class LeetCodeSubmission {
  user: string;
  discord_name: string;
  problem_name: string;
  problem_description: string;
  problem_url: string;
  difficulty: DifficultyLevel;
  accepted_submissions: string;
  total_submissions: string;
  acceptance_rate: string;

  constructor(builder: LeetCodeSubmissionBuilder) {
    this.user = builder.user;
    this.discord_name = builder.discord_name;
    this.problem_name = builder.problem_name;
    this.problem_description = builder.problem_description;
    this.problem_url = builder.problem_url;
    this.difficulty = builder.difficulty;
    this.accepted_submissions = builder.accepted_submissions;
    this.total_submissions = builder.total_submissions;
    this.acceptance_rate = builder.acceptance_rate;
  }
}
export default LeetCodeSubmission;
