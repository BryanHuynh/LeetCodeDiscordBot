type QuestionContentResponse = {
  data: {
    question: {
      titleSlug: string;
      content: string;
    };
  };
};

type QuestionContent = {
  titleSlug: string;
  content: string;
};

function fromQuestionContentResponse(
  questionContentResponse: QuestionContentResponse
): QuestionContent {
  return {
    titleSlug: questionContentResponse.data.question.titleSlug,
    content: questionContentResponse.data.question.content,
  };
}

export {
  QuestionContentResponse,
  QuestionContent,
  fromQuestionContentResponse,
};
