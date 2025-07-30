import { Events, Interaction } from "discord.js";
import * as subscribe from "../commands/subscribe";

export const InteractionCreateHandler = {
	execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;
        if(interaction.commandName === "subscribe") subscribe.execute(interaction)
	},
};
