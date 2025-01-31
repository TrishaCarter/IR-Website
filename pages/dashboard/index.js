
import { AppShell, Button, Center, Flex, Text, Title, Header, Group, Anchor } from "@mantine/core"
import { auth } from "../../firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getAuth, signOut } from "firebase/auth";
import { getUserSession } from "../../handlers";
import Navbar from "../../components/Navbar";


export default function DashboardPage() {
    let router = useRouter();
    let [user, setUser] = useState(null);
    let [uid, setUid] = useState(null);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        getUserSession()
            .then((user) => {
                setUser(user)

            })
    }, [])

    let handleLogout = async () => {
        try {
            let auth = getAuth();
            signOut(auth);
            console.log("User successfully logged out");
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return <AppShell style={{ background: theme.background }}>
        <AppShell.Header>
            <Navbar />
        </AppShell.Header>

        <AppShell.Main>
            <Center w={"99vw"} h={"99vh"} flex={"column"}>
                <Flex direction={"column"} align={"center"}>
                    <Title order={1}>Dashboard</Title>

                    <br />

                    <Text align="center">Welcome to the dashboard, {user ? user.displayName : null}</Text>
                    <Text align="center">UID: {user}</Text>

                    <br />

                    <Button align="center" onClick={handleLogout}>Log out</Button>
                </Flex>
            </Center>
        </AppShell.Main>
    </AppShell>
}