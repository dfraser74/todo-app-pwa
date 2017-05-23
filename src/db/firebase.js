import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';

const config = {
  apiKey: process.env.FIREBASE_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.FIREBASE_STORAGE,
  databaseURL: process.env.FIREBASE_DATABASE_URL
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const storage = firebase.storage();
export const database = firebase.database();

export default firebase;
