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