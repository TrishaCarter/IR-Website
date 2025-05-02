import { Flex, Group, Anchor, Space, Text, Button, Menu, Avatar, Box, Divider, Badge } from "@mantine/core"
import { useEffect, useState } from "react";
import { auth, getUserDoc } from "../firebase";
import { checkAllBadges } from "../badgeHelpers";
import { useRouter } from "next/router";

export default function Navbar() {
    let router = useRouter();
    let [user, setUser] = useState(null);
    let [avatar, setAvatar] = useState('');
    let [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        let getUser = async () => {
            let userData = await auth.currentUser;
            let userDoc;
            try {
                userDoc = await getUserDoc(userData.uid);
            } catch (error) {
                console.log("Error fetching user document:", error);
            }

            if (userData == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }

            setUser(auth.currentUser || null);
            setUserInfo(userDoc);
            setAvatar(userDoc?.photoURL || null);
        }

        getUser();
    }, [])

    // Check for badge unlocks on basically every page load
    useEffect(() => {
        if (user) {
            let uid = user.uid;
            checkAllBadges(uid).then(() => {
                console.log("Checked all badges for user:", uid);
            }
            ).catch((error) => {
                console.error("Error checking badges:", error);
            });
        }
    })

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
            <img
                src="/IR-logo.png"
                alt="Logo"
                style={{ height: 80, width: 100, cursor: 'pointer' }}
                onClick={() => router.push("/")}
            />
                <Space w={"lg"} />
                <Anchor href={"/dashboard"} style={{ color: theme.accentColor }}>Dashboard</Anchor>
                <Anchor href={"/problems"} style={{ color: theme.accentColor }}>Problems</Anchor>
            </Group>

            <Group>
                <Badge color={theme.accentColor} variant="light">{userInfo?.currency || 0}¢</Badge>
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
            </Group>
        </Flex>
    )
}