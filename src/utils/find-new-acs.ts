import { ISubscriptionService } from "../services/i-subscription-service";
import { getUsersRecentSubmissionsByUsernames } from "../services/leetcode-service";
import logger from "./logger";

export const findNewAcs = async (dbService: ISubscriptionService) => {
	const users = await dbService.getLeetcodeAccounts();
	const UserProblems = await getUsersRecentSubmissionsByUsernames(users);
	console.log(UserProblems);
};

