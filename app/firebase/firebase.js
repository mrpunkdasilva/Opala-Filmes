import {getApp, getApps, initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

let database = null;

// Only initialize Firebase if Project ID is provided
if (firebaseConfig.projectId) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    database = getDatabase(app);
} else {
    console.warn("Firebase credentials are not fully provided (missing Project ID). Skipping Firebase initialization.");
}

export {database};