export type UserSubmissionsResponse = {
	recentAcSubmissionList: Problem[];
};

export type UserSubmission = {
	leetcode_id?: string;
	id: string;
	title: string;
	titleSlug: string;
	timestamp: string;
	submissionUrl: string;
};

export interface Problem {
	id: string;
	title: string;
	titleSlug: string;
	timestamp: string;
}

export interface UserProblems {
	[username: string]: Problem[];
}

const submissionUrlTemplate = "https://leetcode.com/submissions/detail/";
export function fromUserSubmissionsResponse(response: UserSubmissionsResponse): UserSubmission[] {
	const submissions = response.recentAcSubmissionList;

	return submissions.map((submission) => ({
		id: submission.id,
		title: submission.title,
		titleSlug: submission.titleSlug,
		timestamp: new Date(Number.parseInt(submission.timestamp) * 1000).toString(),
		submissionUrl: `${submissionUrlTemplate}${submission.id}/`,
	}));
}

export function fromUsersSubmissionsResponse(response: UserProblems): UserSubmission[] {
	const submissions: UserSubmission[] = [];

	for (const username in response) {
		const userSubmissions = response[username];
		userSubmissions.forEach((submission) => {
			submissions.push({
				id: submission.id,
				title: submission.title,
				titleSlug: submission.titleSlug,
				timestamp: submission.timestamp,
				submissionUrl: `${submissionUrlTemplate}${submission.id}/`,
				leetcode_id: username,
			});
		});
	}

	return submissions;
}
