import "firebase/firestore";
import firebase from "firebase";

import { isBrowser } from "../index";

global.XMLHttpRequest = require("xhr2");

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.RAZZLE_FIREBASE_API_KEY,
    authDomain: process.env.RAZZLE_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.RAZZLE_FIREBASE_DATABASE_URL,
    projectId: process.env.RAZZLE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.RAZZLE_FIREBASE_STORAGE_BUCKET
  });
}

export const  db : any = firebase.firestore()!;
const settings = {
  timestampsInSnapshots: true
};

db.settings(settings);

export const auth : any = firebase.auth()!;
export let storage : any = null;

if (isBrowser)
  storage = firebase.storage()!;
