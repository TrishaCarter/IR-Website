import {
    getFirestore, doc,
    getDoc, setDoc,
    collection, getDocs,
    addDoc, query, where,
    updateDoc, increment
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebase";

const db = getFirestore(app, "ir-website-db");

// Get problems by # of solutions
export let getProblemsWithSolutionCounts = async () => {
    const problemsSnapshot = await getDocs(collection(db, 'PROBLEMS'));
    const solutionsSnapshot = await getDocs(collection(db, 'SOLUTIONS'));

    const problems = problemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const solutions = solutionsSnapshot.docs.map(doc => ({ ...doc.data() }));

    // Count solutions per problem
    const problemSolutionCounts = problems.map(problem => ({
        ...problem,
        solutionCount: solutions.filter(solution => solution.probid === problem.id).length
    }));

    // Sort by solution count (descending)
    problemSolutionCounts.sort((a, b) => b.solutionCount - a.solutionCount);

    return problemSolutionCounts;
};

// Get amount of problems solved by user
export let getUserSolvedProblems = async (userId) => {
    const solutionsSnapshot = await getDocs(collection(db, 'SOLUTIONS'));
    const solutions = solutionsSnapshot.docs.map(doc => ({ ...doc.data() }));
    console.log("Solutions: ", solutions);

    // Count of solutions with matching user ID
    const solvedProblems = solutions.filter(solution => solution.uid === userId);
    return solvedProblems.length;
};

export let getUserCurrency = async (userId) => {
    const userDocRef = doc(db, 'USERS', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data().currency;
    } else {
        console.log("No such document!");
        return null;
    }
}

// Leaderboard query
export let getLeaderboard = async () => {
    const usersSnapshot = await getDocs(collection(db, 'USERS'));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort by currency (descending)
    users.sort((a, b) => b.currency - a.currency);

    return users;
};