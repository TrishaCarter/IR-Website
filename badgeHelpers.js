import { doc, updateDoc } from "firebase/firestore";
import { db, getAllProblems, getAllSolutions, getUserById } from "./firebase";
import { notifications } from "@mantine/notifications";


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
            notifications.show({
                title: "Badge Unlocked!",
                message: "You have unlocked the First Steps badge!",
                color: "green",
                autoClose: 5000,
            })
        }
    }
    if (!majorCoder) {
        majorCoder = await checkMajorCoder(uid);
        if (majorCoder) {
            userBadges.push("major-coder");
            await updateDoc(userDocRef, { badges: userBadges });
            notifications.show({
                title: "Badge Unlocked!",
                message: "You have unlocked the Major Coder badge!",
                color: "green",
                autoClose: 5000,
            })
        }
    }
    if (!heWasNumberOne) {
        heWasNumberOne = await checkHeWasNumberOne(uid);
        if (heWasNumberOne) {
            userBadges.push("he-was-number-one");
            await updateDoc(userDocRef, { badges: userBadges });
            notifications.show({
                title: "Badge Unlocked!",
                message: "You have unlocked the Smitty Werbenjägermanjensen badge!",
                color: "green",
                autoClose: 5000,
            })
        }
    }
    if (!fivePiece) {
        fivePiece = await check5Piece(uid);
        if (fivePiece) {
            userBadges.push("5-piece");
            await updateDoc(userDocRef, { badges: userBadges });
            notifications.show({
                title: "Badge Unlocked!",
                message: "You have unlocked the 5-Piece badge!",
                color: "green",
                autoClose: 5000,
            })
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
    let solvedProblems = [];
    getAllSolutions().then((solutions) => {
        solvedProblems = solutions.filter((solution) => solution.uid === uid);
    })
    return (solvedProblems.length > 0 ? true : false);
}

// Check if the user has had the highest score on a problem
let checkHeWasNumberOne = async (uid) => {
    let problems = await getAllProblems();
    let solutions = await getAllSolutions();

    // For each problem, get the highest score
    for (let problem of problems) {
        let userScore = solutions.find(solution => solution.uid === uid && solution.probid === problem.id)?.score;
        let highestScore = Math.max(...solutions.filter(solution => solution.probid === problem.id).map(solution => solution.score));

        if (userScore >= highestScore) {
            return true;
        }
    }
}

let check5Piece = async (uid) => {
}