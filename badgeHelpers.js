import { updateDoc } from "firebase/firestore";
import { getAllProblems, getAllSolutions, getUserById } from "./firebase";


export let checkAllBadges = async (uid) => {
    // Pull user's badges from the database
    let userDocRef = doc(db, "USERS", uid);
    let userDoc = await getUserById(uid);
    let userBadges = userDoc?.badges || [];

    // Check if the user has each badge
    let firstSteps = userBadges.includes("first-steps");
    let majorCoder = userBadges.includes("major-coder");
    let heWasNumberOne = userBadges.includes("he-was-number-one");
    let fivePiece = userBadges.includes("5-piece");

    // If the user doesn't have a badge, check if they meet the criteria for it
    // If criteria is met, add the badge to the user's badges
    if (!firstSteps) {
        firstSteps = await checkFirstSteps(uid);
        if (firstSteps) {
            userBadges.push("first-steps");
            await updateDoc(userDocRef, { badges: userBadges });
        }
    }
    if (!majorCoder) {
        majorCoder = await checkMajorCoder(uid);
        if (majorCoder) {
            userBadges.push("major-coder");
            await updateDoc(userDocRef, { badges: userBadges });
        }
    }
    if (!heWasNumberOne) {
        heWasNumberOne = await checkHeWasNumberOne(uid);
        if (heWasNumberOne) {
            userBadges.push("he-was-number-one");
            await updateDoc(userDocRef, { badges: userBadges });
        }
    }
    if (!fivePiece) {
        fivePiece = await check5Piece(uid);
        if (fivePiece) {
            userBadges.push("5-piece");
            await updateDoc(userDocRef, { badges: userBadges });
        }
    }
}

// Check if the user has created an account (idk why I did this)
let checkFirstSteps = async (uid) => {
    let userDoc = await getUserById(uid);
    if (userDoc) {
        return true;
    } else {
        return false;
    }
}

// Check if the user has solved their first problem
let checkMajorCoder = async (uid) => {
    let problems = await getAllProblems();
    let solvedProblems = problems.filter(problem => problem.solvedBy.includes(uid));
    return (solvedProblems.length > 0 ? true : false);
}

// Check if the user has had the highest score on a problem
let checkHeWasNumberOne = async (uid) => {
    let problems = await getAllProblems();
    let solutions = await getAllSolutions();

    // For each problem, get the highest score
    for (let problem of problems) {
        let userScore = solutions.find(solution => solution.uid === uid && solution.probid === problem.id)?.score;

        if (userScore >= highestScore) {
            return true;
        }
    }
}

let check5Piece = async (uid) => {
}