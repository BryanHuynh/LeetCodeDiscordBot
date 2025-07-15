import LeetCodeSubmission from "../models/leetcode-submission";
import { ISubscriptionService } from "../services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "../services/leetcode-service";
import { UserProblems } from "../services/types/user-submission";
import logger from "./logger";

export const findNewAcs = async (dbService: ISubscriptionService): Promise<UserProblems | null> => {
	const leetcode_ids = await dbService.getLeetcodeAccounts();
	if(leetcode_ids.length == 0) return Promise.resolve(null)
	const leetcode_user_problems = await getUsersRecentSubmissionsByUsernames(leetcode_ids, 5);
	const known_leetcode_user_problems: { [key: string]: String[] } = {};
	for (const index in leetcode_ids) {
		const acs: String[] = await dbService.getUserACIds(leetcode_ids[index]);
		known_leetcode_user_problems[leetcode_ids[index]] = acs;
	}	
	const new_users_acs: UserProblems = {};
	for (const user in leetcode_user_problems) {
		const new_user_acs = leetcode_user_problems[user].filter((problem) => !known_leetcode_user_problems[user].includes(problem.id)); 
		if(new_user_acs.length > 0) {
			new_users_acs[user] = new_user_acs;
		}
	}
	return new_users_acs;
};
