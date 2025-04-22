import { getApps, initializeApp } from "firebase/app";
import {
    browserSessionPersistence, getAuth,
    GoogleAuthProvider, setPersistence,
} from "firebase/auth";
import {
    getFirestore, doc,
    getDoc, setDoc,
    collection, getDocs,
    addDoc, query, where,
    updateDoc, increment
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

export const uploadProfilePic = async (file, uid) => {
    if (!file || !file.name) throw new Error("Invalid file input");

    const storage = getStorage();
    const profilePicRef = ref(storage, `profile_pictures/${uid}`);

    await uploadBytes(profilePicRef, file);
    return getDownloadURL(profilePicRef);
};

export let getAllProblems = async () => {
    let problems = [];
    let problemsRef = collection(db, 'PROBLEMS');
    try {
        const querySnapshot = await getDocs(problemsRef);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (error) {
        console.error("Error fetching documents: ", error);
        return [];
    }
}

export let getProblemBySlug = async (slug) => {
    const q = query(collection(db, 'PROBLEMS'), where('slugTitle', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } else {
        console.log(`Problem ${slug} not found`);

        return null; // not found
    }
};

export let createProblem = async (data) => {
    try {
        let docRef = await addDoc(collection(db, 'PROBLEMS'), data);
        console.log(`Problem \"${data.title}\" create with ID ${docRef.id}`);

    } catch (error) {
        console.error('Error creating problem: ', error);
    }
}

export let trackSolution = async (uid, problemId, data) => {

    // Check if solution for uid/problemID combo exists
    const q = query(collection(db, `SOLUTIONS`), where('probid', '==', problemId), where('uid', '==', uid));
    const snapshot = await getDocs(q);

    // If solution instance exists, update it
    if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const existingScore = existingDoc.data().score || 0;

        if (data.score > existingScore) {
            // Calculate how many additional points to give.
            const scoreDiff = data.score - existingScore;
            // Update the solution to reflect the new best attempt.
            if (scoreDiff > 0) await setDoc(existingDoc.ref, data, { merge: true });
            // Update the user's currency with the additional points.
            await updateUserScore(uid, scoreDiff);
            console.log(`New high score for problem ${problemId} from user ${uid}: +${scoreDiff} points.`);
        } else {
            // New submission is not better than the existing solution.
            console.log("User's submission did not improve over previous best; no reward given.");
        }

        return;
    } else {
        // If solution instance does not exist, create it
        try {
            let docRef = await addDoc(collection(db, "SOLUTIONS"), data);
            await updateUserScore(uid, data.score);
            console.log(`Solution for problem ${problemId} tracked with ID ${docRef.id}`);

        } catch (error) {
            console.error('Error tracking solution: ', error);
        }
    }
}

export let getUserSolutions = async (uid) => {
    const q = query(collection(db, 'SOLUTIONS'), where('uid', '==', uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        console.log(`No solutions found for user ${uid}`);
        return [];
    }
}

export let getProblemSolutions = async (problemId) => {
    const q = query(collection(db, 'SOLUTIONS'), where('probid', '==', problemId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
        console.log(`No solutions found for problem ${problemId}`);
        return [];
    }
}

export let getUserById = async (uid) => {
    let docRef = doc(db, 'USERS', uid);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
        return null;
    }
}

export let updateUserScore = async (uid, score) => {
    const userDocRef = doc(db, 'USERS', uid);
    // Increment the user's currency balance by the score.
    await updateDoc(userDocRef, {
        currency: increment(score),
    });
}

export default app;