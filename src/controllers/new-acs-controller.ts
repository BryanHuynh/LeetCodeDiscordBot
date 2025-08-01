import { Request, Response } from "express";
import { UserProblems } from "../services/types/user-submission";
import { Client } from "discord.js";
import { leetcodeAcDiscordMessageJob } from "../jobs/leetcode-ac-discord-message-job";

export const newAcs = (client: Client) => {
	return async (req: Request<{}, {}, UserProblems>, res: Response) => {
		const header = req.headers;
		if (header.authorization == `Bearer ${process.env.BEARER_TOKEN}`) {
			const body = req.body;
			console.log(body);
			leetcodeAcDiscordMessageJob(client, body);
			res.sendStatus(200);
		} else {
			res.sendStatus(401);
		}
	};
};
