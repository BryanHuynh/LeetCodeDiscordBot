import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import dotenv from "dotenv";
import { ISubscriptionService } from "./i-subscription-service";
import logger from "../utils/logger";

export class FirestoreService implements ISubscriptionService {
    private firebaseConfig;
    private firebaseApp?: FirebaseApp;

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

    subscribe(
        id: string,
        discord_id: string,
        guild_id: string
    ): Promise<boolean> {
        if (this.firebaseApp == undefined) {
            logger.error("firebase app not initialized");
            return Promise.resolve(false);
        }
        logger.info(
            `subscribing user: ${id} with discord id: ${discord_id} in guild: ${guild_id}`
        );

        return Promise.resolve(false);
    }
    unsubscribe(
        id: string,
        discord_id: string,
        guild_id: string
    ): Promise<boolean> {
        if (this.firebaseApp == undefined) {
            logger.error("firebase app not initialized");
            return Promise.resolve(false);
        }
        logger.info(
            `unsubscribing user: ${id} with discord id: ${discord_id} in guild: ${guild_id}`
        );
        return Promise.resolve(false);
    }

    init() {
        this.firebaseApp = initializeApp(this.firebaseConfig);
    }
}
