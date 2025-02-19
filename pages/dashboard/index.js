
import { Flex, Title, Grid, Overlay } from "@mantine/core"
import { auth, db } from "../../firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { doc, setDoc, getDoc } from "firebase/firestore"
import Navbar from "../../components/Navbar";
import UserProgress from "../../components/dashboard/UserProgress";
import TrendingProblems from "../../components/dashboard/TrendingProblems";
import LeaderboardSpot from "../../components/LeaderboardSpot";
import UserBadges from "../../components/dashboard/UserBadges";
import OnboardingModals from "../../components/Onboarding"


export default function DashboardPage() {
    let router = useRouter();
    let [user, setUser] = useState(null);
    let [needOnboard, setNeedOnboard] = useState(false);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        let getUser = async () => {
            let userData = auth.currentUser;
            console.log("Current user: ");
            console.log(userData);

            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }

            setUser(userData);
        }

        getUser();

        const userRef = doc(db, "USERS", auth.currentUser.uid);
        getDoc(userRef).then((doc) => {
            let info = doc.data();
            ("favoriteLanguages" in info) ? setNeedOnboard(false) : setNeedOnboard(true);
        })
    }, [])

    let finishOnboarding = (username, skills, favoriteLanguages) => {
        let userRef = doc(db, "USERS", auth.currentUser.uid);
        setDoc(userRef, {
            username,
            skills,
            favoriteLanguages
        }, { merge: true }).then(() => {
            setNeedOnboard(false);
        })
    }

    return <>

        {needOnboard ? <>
            <Overlay blur={2} color="#000" opacity={0.5} />
            <OnboardingModals onComplete={finishOnboarding} />
        </> : null}

        <Navbar />
        <Flex direction="column" align="center" w="100vw" h="90vh " style={{ backgroundColor: theme.background }} pt={15}>
            <Title order={1} mb={20} c={theme.primaryTextColor}>Welcome back{user ? `, ${user.displayName}!` : "!"}</Title>
            <Grid columns={2} gap={20}>
                <Grid.Col span={1}>
                    <UserProgress />
                    <LeaderboardSpot />
                    <UserBadges />
                </Grid.Col>
                <Grid.Col span={1}>
                    <TrendingProblems />
                </Grid.Col>
            </Grid>
        </Flex >
    </>
}