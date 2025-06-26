import { DifficultyLevel, toDifficultyLevel } from "../../model/DifficultyLevel";

type QuestionStatsResponse = {
  question: {
    titleSlug: string;
    stats: string;
    difficulty: string;
    categoryTitle: string;
  };
};

type QuestionStats = {
  titleSlug: string;
  stats: {
    totalAccepted: string;
    totalSubmissions: string;
    acceptanceRate: string;
  };
  difficulty: DifficultyLevel;
  category: string;
};

function fromQuestionStatsResponse(
  questionStatsResponse: QuestionStatsResponse
): QuestionStats {
  const responseJson = JSON.parse(questionStatsResponse.question.stats);
  return {
    titleSlug: questionStatsResponse.question.titleSlug,
    stats: {
      totalAccepted: responseJson.totalAccepted,
      totalSubmissions: responseJson.totalSubmission,
      acceptanceRate: responseJson.acRate,
    },
    difficulty: toDifficultyLevel(questionStatsResponse.question.difficulty),
    category: questionStatsResponse.question.categoryTitle,
  };
}

export { QuestionStatsResponse, QuestionStats, fromQuestionStatsResponse };
