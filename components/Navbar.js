import { Flex, Group, Anchor, Space, Text, Button, Menu, Avatar } from "@mantine/core"
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function Navbar() {
    let router = useRouter();
    let [user, setUser] = useState(null);
    let [avatar, setAvatar] = useState('');

    // useEffect(() => {
    //     let getUser = async () => {
    //         let userData = await auth.currentUser;

    //         if (userData == null) {
    //             console.log("No user logged in");
    //             router.push("/login")
    //             return;
    //         }
    //         console.log(userData);
    //         setUser(userData);
    //     }

    //     getUser();
    // }, [])

    useEffect(() => {
        setAvatar(user?.photoURL || '');
    }, [user]);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("User successfully logged out");
            router.push("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    return (
        <Flex justify={"space-between"} align={"center"} w={"100%"} p={"lg"} h={"10vh"} style={{ background: theme.secondaryBackground }}>
            <Group>
                <Text
                    c={theme.primaryTextColor}
                    onClick={() => router.push("/dashboard")}
                >Logo</Text>
                <Space w={"lg"} />
                <Anchor href={"/dashboard"} style={{ color: theme.accentColor }}>Dashboard</Anchor>
                <Anchor href={"/problems"} style={{ color: theme.accentColor }}>Problems</Anchor>
            </Group>
            <Menu
                transitionProps={{ transition: 'pop-top-right' }}
                position="top-end"
                width={220}
                withinPortal
            >
                <Menu.Target>
                    <Avatar src={avatar} size={30} m={0} />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Anchor href={"/profile"} c={theme.accentColor}>Profile</Anchor>
                    </Menu.Item>
                    <Menu.Item>
                        <Anchor href={"/account-settings"} c={theme.accentColor}>Settings</Anchor>
                    </Menu.Item>
                    <Menu.Item onClick={handleLogout} variant="light" c={"red"}>
                        Log Out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Flex>
    )
}