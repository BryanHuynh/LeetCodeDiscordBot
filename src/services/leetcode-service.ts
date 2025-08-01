import { GraphQLClient, gql } from "graphql-request";
import { fromQuestionContentResponse, QuestionContent, QuestionContentResponse } from "./types/question-content";
import { fromQuestionStatsResponse, QuestionStats, QuestionStatsResponse } from "./types/question-stats";
import { fromUsersSubmissionsResponse, fromUserSubmissionsResponse, UserProblems, UserSubmission } from "./types/user-submission";
import { Logger } from "../utils/Logger";

const leetCodeEndpoint: string = "https://leetcode.com/graphql/";

async function getQuestionContentBySlug(titleSlug: string): Promise<QuestionContent> {
	Logger.info(`Getting question content for slug: ${titleSlug}`);
	const query: string = gql`
		query questionContent($titleSlug: String!) {
			question(titleSlug: $titleSlug) {
				titleSlug
				content
			}
		}
	`;
	const variables = {
		titleSlug: titleSlug,
	};
	const graphQLClient = new GraphQLClient(leetCodeEndpoint);
	const response = await graphQLClient.request<QuestionContentResponse>(query, variables);
	return fromQuestionContentResponse(response);
}

async function getQuestionStatsByTitleSlug(titleSlug: string): Promise<QuestionStats> {
	Logger.info(`getting question stats for slug: ${titleSlug}`);
	const query: string = gql`
		query questionStats($titleSlug: String!) {
			question(titleSlug: $titleSlug) {
				titleSlug
				stats
				difficulty
				categoryTitle
			}
		}
	`;

	const variables = {
		titleSlug: titleSlug,
	};
	const graphQLClient = new GraphQLClient(leetCodeEndpoint);
	const response = await graphQLClient.request<QuestionStatsResponse>(query, variables);
	return fromQuestionStatsResponse(response);
}

async function getUserRecentSubmissionsByUsername(username: string, limit: number = 10): Promise<UserProblems> {
	Logger.info(`getting user recent submissions for username: ${username}`);
	const query: string = gql`
		query recentAcSubmissions($username: String!, $limit: Int!) {
			recentAcSubmissionList(username: $username, limit: $limit) {
				id
				title
				titleSlug
				timestamp
			}
		}
	`;
	const variables = {
		username: username,
		limit: limit,
	};
	const graphQLClient = new GraphQLClient(leetCodeEndpoint);
	const response = await graphQLClient.request<UserSubmission>(query, variables);
	return fromUserSubmissionsResponse(response, username);
}

async function validateLeetCodeAccount(leetcodeAccount: string): Promise<boolean> {
	Logger.info(`validating leetcode account: ${leetcodeAccount}`);
	const query: string = gql`
		query userPublicProfile($username: String!) {
			matchedUser(username: $username) {
				username
			}
		}
	`;
	const variables = {
		username: leetcodeAccount,
	};
	const graphQLClient = new GraphQLClient(leetCodeEndpoint);
	try {
		const response: any = await graphQLClient.request(query, variables);
		if (response.matchedUser) return true;
		return false;
	} catch (e) {
		return false;
	}
}

async function getUsersRecentSubmissionsByUsernames(usernames: string[], limit: number = 10): Promise<UserProblems> {
	Logger.info(`getting user recent submissions for username: ${usernames.toString()}`);
	let query: string = gql`
		query recentAcSubmissions(${usernames.map((_, index) => `$username${index}: String!`).join(", ")}, $limit: Int!) {
	`;
	for (let i = 0; i < usernames.length; i++) {
		query += `${usernames[i]}: recentAcSubmissionList(username: $username${i}, limit: $limit) {
					id
					title
					titleSlug
					timestamp
				}`;
	}
	query += "}";

	let variables: any = {};
	for (let i = 0; i < usernames.length; i++) {
		variables[`username${i}`] = usernames[i];
	}
	variables["limit"] = limit;
	const graphQLClient = new GraphQLClient(leetCodeEndpoint);
	const response = await graphQLClient.request<UserProblems>(query, variables);
	return fromUsersSubmissionsResponse(response);
}
export { getQuestionContentBySlug, getQuestionStatsByTitleSlug, getUserRecentSubmissionsByUsername, validateLeetCodeAccount, getUsersRecentSubmissionsByUsernames };
