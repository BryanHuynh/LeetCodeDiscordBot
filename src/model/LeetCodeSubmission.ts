import { DifficultyLevel } from "./DifficultyLevel";
import LeetCodeSubmissionBuilder from "./LeetCodeSubmissionBuilder";

class LeetCodeSubmission {
  user: string;
  real_name: string;
  problem_name: string;
  problem_url: string;
  difficulty: DifficultyLevel;
  language: string;
  runtime: number;
  memory_usage: number;
  accepted_submissions: number;
  total_submissions: number;
  submitted_code: string;

  constructor(builder: LeetCodeSubmissionBuilder) {
    this.user = builder.user;
    this.real_name = builder.real_name;
    this.problem_name = builder.problem_name;
    this.problem_url = builder.problem_url;
    this.difficulty = builder.difficulty;
    this.language = builder.language;
    this.runtime = builder.runtime;
    this.memory_usage = builder.memory_usage;
    this.accepted_submissions = builder.accepted_submissions;
    this.total_submissions = builder.total_submissions;
    this.submitted_code = builder.submitted_code;
  }
}
export default LeetCodeSubmission;
