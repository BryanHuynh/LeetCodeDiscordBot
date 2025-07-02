import logger from "../utils/logger";

type DifficultyLevel = "Easy" | "Medium" | "Hard";
const allowedDifficultyLevels = ["Easy", "Medium", "Hard"] as const;

function toDifficultyLevel(value: string): DifficultyLevel {
  if (allowedDifficultyLevels.includes(value as DifficultyLevel)) {
    return value as DifficultyLevel;
  }
  logger.error(`Invalid difficulty level: ${value}`);
  return "Easy";
}

export { DifficultyLevel, toDifficultyLevel };
