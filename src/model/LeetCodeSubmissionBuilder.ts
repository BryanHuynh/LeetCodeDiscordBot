import { DifficultyLevel } from "./DifficultyLevel";
import LeetCodeSubmission from "./LeetCodeSubmission";

export class LeetCodeSubmissionBuilder {
  user: string = "";
  real_name: string = "";
  problem_name: string = "";
  problem_description: string = "";
  problem_url: string = "";
  difficulty: DifficultyLevel = "Easy";
  language: string = "";
  runtime: number = 0;
  memory_usage: number = 0;
  accepted_submissions: number = 0;
  total_submissions: number = 0;
  submitted_code: string = "";

  public withUser(user: string): LeetCodeSubmissionBuilder {
    this.user = user;
    return this;
  }

  public withRealName(real_name: string): LeetCodeSubmissionBuilder {
    this.real_name = real_name;
    return this;
  }

  public withProblemName(problem_name: string): LeetCodeSubmissionBuilder {
    this.problem_name = problem_name;
    return this;
  }

  public withProblemDescription(
    problem_description: string
  ): LeetCodeSubmissionBuilder {
    this.problem_description = problem_description;
    return this;
  }

  public withProblemUrl(problem_url: string): LeetCodeSubmissionBuilder {
    this.problem_url = problem_url;
    return this;
  }

  public withDifficulty(
    difficulty: DifficultyLevel
  ): LeetCodeSubmissionBuilder {
    this.difficulty = difficulty;
    return this;
  }

  public withLanguage(language: string): LeetCodeSubmissionBuilder {
    this.language = language;
    return this;
  }

  public withRuntime(runtime: number): LeetCodeSubmissionBuilder {
    this.runtime = runtime;
    return this;
  }

  public withMemoryUsage(memory_usage: number): LeetCodeSubmissionBuilder {
    this.memory_usage = memory_usage;
    return this;
  }

  public withAcceptedSubmissions(
    accepted_submissions: number
  ): LeetCodeSubmissionBuilder {
    this.accepted_submissions = accepted_submissions;
    return this;
  }

  public withTotalSubmissions(
    total_submissions: number
  ): LeetCodeSubmissionBuilder {
    this.total_submissions = total_submissions;
    return this;
  }

  public withSubmittedCode(submitted_code: string): LeetCodeSubmissionBuilder {
    this.submitted_code = submitted_code;
    return this;
  }

  public build(): LeetCodeSubmission {
    return new LeetCodeSubmission(this);
  }
}

export default LeetCodeSubmissionBuilder;
