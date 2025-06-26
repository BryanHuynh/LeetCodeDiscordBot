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

export { getQuestionContentBySlug, getQuestionStatsByTitleSlug };
