import { GraphQLClient, gql } from "graphql-request";
import {
  fromQuestionContentResponse,
  QuestionContent,
  QuestionContentResponse,
} from "./types/QuestionContent";
import logger from "../utils/Logger";
import {
  fromQuestionStatsResponse,
  QuestionStats,
  QuestionStatsResponse,
} from "./types/QuestionStats";
import {
  fromUserSubmissionsResponse,
  UserSubmission,
  UserSubmissionsResponse,
} from "./types/UserSubmissions";

const leetCodeEndpoint: string = "https://leetcode.com/graphql/";

async function getQuestionContentBySlug(
  titleSlug: string
): Promise<QuestionContent> {
  logger.info(`Getting question content for slug: ${titleSlug}`);
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
  const response = await graphQLClient.request<QuestionContentResponse>(
    query,
    variables
  );
  return fromQuestionContentResponse(response);
}

async function getQuestionStatsByTitleSlug(
  titleSlug: string
): Promise<QuestionStats> {
  logger.info(`getting question stats for slug: ${titleSlug}`);
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
  const response = await graphQLClient.request<QuestionStatsResponse>(
    query,
    variables
  );
  return fromQuestionStatsResponse(response);
}

async function getUserRecentSubmissionsByUsername(
  username: string,
  limit: number = 10
): Promise<UserSubmission[]> {
  logger.info(`getting user recent submissions for username: ${username}`);
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
  const response = await graphQLClient.request<UserSubmissionsResponse>(
    query,
    variables
  );
  return fromUserSubmissionsResponse(response);
}

export {
  getQuestionContentBySlug,
  getQuestionStatsByTitleSlug,
  getUserRecentSubmissionsByUsername,
};
