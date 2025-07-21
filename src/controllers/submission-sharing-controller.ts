import { Client, Events } from "discord.js";
import { ISubscriptionService } from "../services/i-subscription-service";

export class SubmissionSharingController {
    private dbService: ISubscriptionService;
    private client: Client;
    // used to share submissions to the server after the user has accepted to share the link
    constructor(dbService: ISubscriptionService, client: Client) {
        this.dbService = dbService;
        this.client = client;
    }

    init() {
        this.onShare();
    }

    private onShare(){
        this.client.on(Events.InteractionCreate, (interaction) => {
            if(!interaction.isButton()) return;
            if(interaction.customId == 'SHARE') {
                console.log('share was pressed')
            }
        }); 
    }
}