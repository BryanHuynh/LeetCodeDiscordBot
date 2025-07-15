import { FirebaseApp, initializeApp } from "firebase/app";
import {
    doc,
    Firestore,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
import { ISubscriptionService } from "./i-subscription-service";
import logger from "../utils/logger";

export class FirestoreService implements ISubscriptionService {
    private firebaseConfig;
    private firebaseApp?: FirebaseApp;
    private db?: Firestore;

    constructor() {
        dotenv.config();
        this.firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        };
    }
    getUserACIds(leetcode_id: string): Promise<String[]> {
        throw new Error("Method not implemented.");
    }
    getLeetcodeAccounts(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    checkSubscriptionValid(id: string, discord_id: string, guild_id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async subscribe(
        id: string,
        discord_id: string,
        discord_username: string,
        guild_id: string,
        guild_name: string
    ): Promise<boolean> {
        if (this.firebaseApp == undefined || this.db == undefined) {
            logger.error("firebase app or db not initialized");
            return Promise.resolve(false);
        }
        logger.info(
            `subscribing user: ${id} with discord id: ${discord_id} in guild: ${guild_id}`
        );
        try {
            const docRef = doc(
                this.db,
                "subscriptions",
                id,
                "guilds",
                guild_id
            );
            await setDoc(docRef, {
                discord_id: discord_id,
            });
        } catch (e) {
            logger.error("Error adding document: ", e);
        }

        return Promise.resolve(false);
    }
    unsubscribe(
        id: string,
        discord_id: string,
        guild_id: string
    ): Promise<boolean> {
        if (this.firebaseApp == undefined || this.db == undefined) {
            logger.error("firebase app or db not initialized");
            return Promise.resolve(false);
        }
        logger.info(
            `unsubscribing user: ${id} with discord id: ${discord_id} in guild: ${guild_id}`
        );
        return Promise.resolve(false);
    }


    init() {
        this.firebaseApp = initializeApp(this.firebaseConfig);
        this.db = getFirestore(this.firebaseApp);
    }
}
