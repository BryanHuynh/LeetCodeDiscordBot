import { container } from "tsyringe";
import LeetCodeSubmission from "../models/leetcode-submission";
import { getUsersRecentSubmissionsByUsernames } from "../services/leetcode-service";
import { UserProblems } from "../services/types/user-submission";
import { LeetCodeAccountRepository } from "../services/database-services/leetcode-account-repository";
import { AcCompletionRepository } from "../services/database-services/ac-completion-repository";

export const findNewAcs = async (): Promise<UserProblems | null> => {
	const leetcodeAccountRepo = container.resolve(LeetCodeAccountRepository);
	const leetcode_accounts = await leetcodeAccountRepo.getAllAccounts();
	const leetcode_ids = leetcode_accounts.map((account) => account.id);
	if (leetcode_ids.length == 0) return Promise.resolve(null);
	const leetcode_user_problems = await getUsersRecentSubmissionsByUsernames(leetcode_ids, 5);
	const known_leetcode_user_problems: { [key: string]: String[] } = {};
	const acCompletionRepo = container.resolve(AcCompletionRepository);
	for (const index in leetcode_ids) {
		const acs = await acCompletionRepo.getAcCompletionsByLeetcodeId(leetcode_ids[index])
		const acs_ids: String[] = acs.map((ac) => ac.ac_id);
		known_leetcode_user_problems[leetcode_ids[index]] = acs_ids;
	}
	const new_users_acs: UserProblems = {};
	for (const user in leetcode_user_problems) {
		const new_user_acs = leetcode_user_problems[user].filter(
			(problem) => !known_leetcode_user_problems[user].includes(problem.id)
		);
		if (new_user_acs.length > 0) {
			new_users_acs[user] = new_user_acs;
		}
	}
	return new_users_acs;
};
