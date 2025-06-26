type UserSubmissionsResponse = {
  recentAcSubmissionList: {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }[];
};

type UserSubmission = {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
  submissionUrl: string;
};

const submissionUrlTemplate = "https://leetcode.com/submissions/detail/";
function fromUserSubmissionsResponse(
  response: UserSubmissionsResponse
): UserSubmission[] {
  const submissions = response.recentAcSubmissionList;

  return submissions.map((submission) => ({
    id: submission.id,
    title: submission.title,
    titleSlug: submission.titleSlug,
    timestamp: new Date(
      Number.parseInt(submission.timestamp) * 1000
    ).toString(),
    submissionUrl: `${submissionUrlTemplate}${submission.id}/`,
  }));
}

export { UserSubmissionsResponse, UserSubmission, fromUserSubmissionsResponse };
