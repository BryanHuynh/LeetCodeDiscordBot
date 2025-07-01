import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import dotenv from "dotenv";
import { ISubscriptionService } from "./i-subscription-service";
import logger from "../utils/logger";

class FirestoreService implements ISubscriptionService {
    private firebaseConfig;

    constructor() {
        dotenv.config();
        this.firebaseConfig = {
            apiKey: process.env.apiKey,
            authDomain: process.env.authDomain,
            projectId: process.env.projectId,
            storageBucket: process.env.storageBucket,
            messagingSenderId: process.env.messagingSenderId,
            appId: process.env.appId,
            measurementId: process.env.measurementId,
        };
    }

    subscribe(id: string, discord_id: string): Promise<boolean> {
        logger.info(`subscribing user: ${id} with discord id: ${discord_id}`)
        return Promise.resolve(false);
    }
    unsubscribe(id: string, discord_id: string): Promise<boolean> {
        logger.info(`unsubscribing user: ${id} with discord id: ${discord_id}`)
        return Promise.resolve(false);
    }

    init() {
        const app = initializeApp(this.firebaseConfig);
        const analytics = getAnalytics(app);
    }


}
