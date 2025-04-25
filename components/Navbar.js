import { Flex, Group, Anchor, Space, Text, Button, Menu, Avatar, Box, Divider } from "@mantine/core"
import { useEffect, useState } from "react";
import { auth, getUserDoc } from "../firebase";
import { useRouter } from "next/router";

export default function Navbar() {
    let router = useRouter();
    let [user, setUser] = useState(null);
    let [avatar, setAvatar] = useState('');

    useEffect(() => {
        let getUser = async () => {
            let userData = await auth.currentUser;
            if (userData) {
                userDoc = await getUserDoc(userData.uid);
            }

            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }

            setUser(auth.currentUser);
            setAvatar(userDoc.photoURL || null);
        }

        getUser();
    }, [])

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let dropdownBoxStyle = {
        background: theme.secondaryBackground,
        color: theme.primaryTextColor,
        padding: '10px',
        borderRadius: '5px',
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
                withinPortal={false}

            >
                <Menu.Target>
                    <Avatar src={avatar} size={30} m={0} />
                </Menu.Target>
                <Menu.Dropdown w={130} bg={theme.secondaryBackground} style={{ borderRadius: '10px' }} bd={`1px solid ${theme.secondaryTextColor}`}>
                    <Box style={dropdownBoxStyle} onClick={() => router.push("/profile")}>
                        <Text c={theme.accentColor}>Profile</Text>
                    </Box>
                    <Divider />
                    <Box style={dropdownBoxStyle}>

                        <Anchor href={"/settings"} c={theme.accentColor}>Settings</Anchor>
                    </Box>
                    <Divider />
                    <Box style={dropdownBoxStyle}>
                        <Anchor onClick={handleLogout} variant="light" c={"red"}>Log Out</Anchor>
                    </Box>
                </Menu.Dropdown>
            </Menu>
        </Flex>
    )
}