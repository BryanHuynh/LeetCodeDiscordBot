import { ISubscriptionService } from "../services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "../services/leetcode-service";
import { UserProblems } from "../services/types/user-submission";
import logger from "./logger";

export const findNewAcs = async (dbService: ISubscriptionService): Promise<{ [key: string]: String[] }> => {
	const leetcode_ids = await dbService.getLeetcodeAccounts();
	const leetcode_user_problems = await getUsersRecentSubmissionsByUsernames(leetcode_ids, 5).then((res) => {
		const userProblems: { [key: string]: String[] } = {};
		for (const key in res) {
			userProblems[key] = res[key].map((problem) => problem.id);
		}
		return userProblems;
	});
	const known_leetcode_user_problems: { [key: string]: String[] } = {};
	for (const index in leetcode_ids) {
		const acs: String[] = await dbService.getUserACIds(leetcode_ids[index]);
		known_leetcode_user_problems[leetcode_ids[index]] = acs;
	}	
	const new_user_acs: { [key: string]: String[] } = {};
	for (const key in leetcode_user_problems) {
		new_user_acs[key] = leetcode_user_problems[key].filter((ac) => !known_leetcode_user_problems[key].includes(ac));
	}
	console.log("new_user_acs: ", new_user_acs);
	return new_user_acs;
};
