import { getApps, initializeApp } from "firebase/app";
import {
    browserSessionPersistence, getAuth,
    GoogleAuthProvider, setPersistence,
} from "firebase/auth";
import {
    getFirestore, doc,
    getDoc, setDoc,
    collection
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app, "ir-website-db");

export const googleProvider = new GoogleAuthProvider();

export let createUserDoc = async (uid, data) => {
    try {
        await setDoc(doc(db, 'USERS', uid), data);
    } catch (error) {
        console.error('Firestore Error: ', error);
    }
}

export let getUserDoc = async (uid) => {
    let docRef = doc(db, 'USERS', uid);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}


export default app;
