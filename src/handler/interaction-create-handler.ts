import { Events, Interaction } from "discord.js";
import * as subscribe from "../commands/subscribe";
import * as setChannel from "../commands/set-channel";

export const InteractionCreateHandler = {
	execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;
        if(interaction.commandName === "subscribe") subscribe.execute(interaction)
		if(interaction.commandName === "setchannel") setChannel.execute(interaction)
	},
};
