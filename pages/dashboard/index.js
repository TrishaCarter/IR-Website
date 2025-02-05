
import { AppShell, Button, Center, Flex, Text, Title, Header, Group, Anchor, Grid, SimpleGrid } from "@mantine/core"
import { auth } from "../../firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getAuth, signOut } from "firebase/auth";
import Navbar from "../../components/Navbar";
import UserProgress from "../../components/dashboard/UserProgress";
import TrendingProblems from "../../components/dashboard/TrendingProblems";
import LeaderboardSpot from "../../components/LeaderboardSpot";
import UserBadges from "../../components/dashboard/UserBadges";


export default function DashboardPage() {
    let router = useRouter();
    let [user, setUser] = useState(null);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        let getUser = async () => {
            let userData = await auth.currentUser;
            console.log(userData);


            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }

            setUser(userData);
        }

        getUser();
    }, [])

    return <>
        <Navbar />
        <Flex direction="column" align="center" w="100vw" h="90vh " style={{ backgroundColor: theme.background }} pt={15}>
            <Title order={1} style={{ marginBottom: 20 }}>Welcome back{user ? `, ${user.displayName}!` : "!"}</Title>
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
        </Flex>
    </>
}