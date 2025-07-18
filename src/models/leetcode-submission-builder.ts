import { getQuestionContentBySlug, getQuestionStatsByTitleSlug, getUserRecentSubmissionsByUsername } from "../services/leetcode-service";
import { QuestionContent } from "../services/types/question-content";
import { Problem, UserProblems, UserSubmission } from "../services/types/user-submission";
import logger from "../utils/logger";
import { DifficultyLevel } from "./difficulty-level";
import LeetCodeSubmission from "./leetcode-submission";

export class LeetCodeSubmissionBuilder {
	user: string = "";
	discord_name: string = "";
	problem_name: string = "";
	problem_description: string = "";
	problem_url: string = "";
	difficulty: DifficultyLevel = "Easy";
	accepted_submissions: string = "";
	total_submissions: string = "";
	acceptance_rate: string = "";
	category: string = "";
	submission_url: string = "";

	public withUser(user: string): LeetCodeSubmissionBuilder {
		this.user = user;
		return this;
	}

	public withDiscordName(discord_name: string): LeetCodeSubmissionBuilder {
		this.discord_name = discord_name;
		return this;
	}

	public withProblemName(problem_name: string): LeetCodeSubmissionBuilder {
		this.problem_name = problem_name;
		return this;
	}

	public withProblemDescription(problem_description: string): LeetCodeSubmissionBuilder {
		this.problem_description = problem_description;
		return this;
	}

	public withProblemUrl(problem_url: string): LeetCodeSubmissionBuilder {
		this.problem_url = problem_url;
		return this;
	}

	public withDifficulty(difficulty: DifficultyLevel): LeetCodeSubmissionBuilder {
		this.difficulty = difficulty;
		return this;
	}

	public withAcceptedSubmissions(accepted_submissions: string): LeetCodeSubmissionBuilder {
		this.accepted_submissions = accepted_submissions;
		return this;
	}

	public withTotalSubmissions(total_submissions: string): LeetCodeSubmissionBuilder {
		this.total_submissions = total_submissions;
		return this;
	}

	public withAcceptedRate(accepted_rate: string): LeetCodeSubmissionBuilder {
		this.acceptance_rate = accepted_rate;
		return this;
	}

	public withCategory(category: string): LeetCodeSubmissionBuilder {
		this.category = category;
		return this;
	}

	public withSubmissionUrl(url?: string): LeetCodeSubmissionBuilder {
		if (url) {
			this.submission_url = url;
		}
		return this;
	}

	public build(): LeetCodeSubmission {
		return new LeetCodeSubmission(this);
	}

	public async buildLatestSubmissionFromServices(leetcode_id: string, discord_name: string): Promise<LeetCodeSubmission> {
		const userProblem: UserProblems = await getUserRecentSubmissionsByUsername(leetcode_id);
		if (userProblem[leetcode_id].length == 0) {
			logger.error(`unable to find submissions for ${leetcode_id}`);
		}
		const [questionContent, questionStat] = await Promise.all([
			getQuestionContentBySlug(userProblem[leetcode_id][0].titleSlug),
			getQuestionStatsByTitleSlug(userProblem[leetcode_id][0].titleSlug),
		]);

		const builder: LeetCodeSubmissionBuilder = new LeetCodeSubmissionBuilder()
			.withUser(leetcode_id)
			.withDiscordName(discord_name)
			.withProblemName(userProblem[leetcode_id][0].title)
			.withProblemDescription(questionContent.content)
			.withCategory(questionStat.category)
			.withProblemUrl(`https://leetcode.com/problems/${questionContent.titleSlug}/description/`)
			.withDifficulty(questionStat.difficulty)
			.withAcceptedSubmissions(questionStat.stats.totalSubmissions)
			.withTotalSubmissions(questionStat.stats.totalSubmissions)
			.withAcceptedRate(questionStat.stats.acceptanceRate)
			.withSubmissionUrl(userProblem[leetcode_id][0].submissionUrl);
		return builder.build();
	}

	public async buildSubmissionFromServices(problem: Problem, leetcode_id: string, discord_name: string): Promise<LeetCodeSubmissionBuilder> {
		const [questionContent, questionStat] = await Promise.all([
			getQuestionContentBySlug(problem.titleSlug),
			getQuestionStatsByTitleSlug(problem.titleSlug),
		]);

		const builder: LeetCodeSubmissionBuilder = new LeetCodeSubmissionBuilder()
			.withUser(leetcode_id)
			.withDiscordName(discord_name)
			.withProblemName(problem.title)
			.withProblemDescription(questionContent.content)
			.withCategory(questionStat.category)
			.withProblemUrl(`https://leetcode.com/problems/${questionContent.titleSlug}/description/`)
			.withDifficulty(questionStat.difficulty)
			.withAcceptedSubmissions(questionStat.stats.totalSubmissions)
			.withTotalSubmissions(questionStat.stats.totalSubmissions)
			.withAcceptedRate(questionStat.stats.acceptanceRate)
			.withSubmissionUrl(problem.submissionUrl);
		return builder;
	}
}

export default LeetCodeSubmissionBuilder;
