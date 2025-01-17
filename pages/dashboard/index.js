
import { Button, Center, Flex, Text, Title } from "@mantine/core"
import { auth } from "../../firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getAuth, signOut } from "firebase/auth";

export default function DashboardPage() {
    let router = useRouter();
    let [user, setUser] = useState(null);

    useEffect(() => {
        let getUser = async () => {
            let userData = await auth.currentUser;

            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }
            console.log(userData);

            setUser(userData);
        }

        getUser();
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

    return <Center w={"99vw"} h={"99vh"} flex={"column"}>
        <Flex direction={"column"} align={"center"}>
            <Title order={1}>Dashboard</Title>

            <br />

            <Text align="center">Welcome to the dashboard, {user ? user.displayName : null}</Text>
            <Text align="center">Email: {user ? user.email : null}</Text>

            <br />

            <Button align="center" onClick={handleLogout}>Log out</Button>
        </Flex>
    </Center>
}