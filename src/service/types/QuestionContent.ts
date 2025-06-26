type QuestionContentResponse = {
  question: {
    titleSlug: string;
    content: string;
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
    titleSlug: questionContentResponse.question.titleSlug,
    content: htmlContentToDiscord(questionContentResponse.question.content),
  };
}

function htmlContentToDiscord(content: string): string {
  console.log(content);
  return content
    .replace(/<p>(.*?)<\/p>/gs, (_, p1) => `${p1}\n\n`) // Paragraphs
    .replace(/<code>(.*?)<\/code>/gs, (_, code) => `\`${code}\``) // Inline code
    .replace(/<pre>(.*?)<\/pre>/gs, (_, code: string) => {
      // Code block
      const cleaned = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/<strong.*?>(.*?)<\/strong>/gs, (_, text) => `${text}`);
      return `\`\`\`js\n${cleaned.trim()}\n\`\`\`\n`;
    })
    .replace(/<strong.*?>(.*?)<\/strong>/gs, (_, text) => `**${text}**`) // Bold
    .replace(/<ul>(.*?)<\/ul>/gs, (_, list) => list) // Unordered list
    .replace(/<li>(.*?)<\/li>/gs, (_, item) => `• ${item}\n`)
    .replace(/<sup>(.*?)<\/sup>/gs, (_, item) => `^${item}\n`)
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove remaining tags
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&nbsp;/g, " ")
    .replace(/^\s*$(\r?\n)?/gm, "")
    .trim();
}

export {
  QuestionContentResponse,
  QuestionContent,
  fromQuestionContentResponse,
};
