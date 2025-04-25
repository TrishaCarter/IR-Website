
import { Flex, Title, Grid, Overlay, Text } from "@mantine/core"
import { auth, db } from "../../firebase"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { AuthContext } from "../_app"
import Navbar from "../../components/Navbar";
import UserProgress from "../../components/dashboard/UserProgress";
import TrendingProblems from "../../components/dashboard/TrendingProblems";
import LeaderboardSpot from "../../components/LeaderboardSpot";
import UserBadges from "../../components/dashboard/UserBadges";
import OnboardingModals from "../../components/Onboarding"
import { getProblemsWithSolutionCounts } from "../../queries"


export default function DashboardPage() {
    let router = useRouter();
    let [needOnboard, setNeedOnboard] = useState(false);
    let [userInfo, setUserInfo] = useState(null);
    let [sortedProblems, setSortedProblems] = useState([]);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    // Route guarding useEffect
    const { user, loading } = useContext(AuthContext);
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        let uid = auth.currentUser?.uid || null;

        if (uid) {
            const userRef = doc(db, "USERS", uid);
            getDoc(userRef).then((doc) => {
                let info = doc.data();
                setUserInfo(info);
                ("favoriteLanguages" in info) ? setNeedOnboard(false) : setNeedOnboard(true);
            })
        }
    }, [user, loading])

    let finishOnboarding = (username, skills, favoriteLanguages) => {
        let userRef = doc(db, "USERS", uid);
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
            <Title order={1} mb={20} c={theme.primaryTextColor}>Welcome back{userInfo ? `, ${userInfo.displayName}!` : "!"}</Title>
            <Grid columns={2} gap={20}>
                <Grid.Col span={1}>
                    {/* <UserProgress user={auth.currentUser.uid || null} /> */}
                    <LeaderboardSpot uid={auth.currentUser?.uid} />
                    <UserBadges uid={auth.currentUser?.uid} />
                </Grid.Col>
                <Grid.Col span={1}>
                    <TrendingProblems />
                </Grid.Col>
            </Grid>
        </Flex >
    </>
}