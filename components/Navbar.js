import { Flex, Group, Anchor, Space, Text, Button, Menu } from "@mantine/core"


export default function Navbar() {

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return (
        <Flex justify={"space-between"} align={"center"} w={"100%"} p={"lg"} style={{ background: theme.secondaryBackground }}>
            <Group>
                <Text>Logo</Text>
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
                    <Text>
                        Account
                    </Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item>
                        <Anchor href={"/profile"}>Profile</Anchor>
                    </Menu.Item>
                    <Menu.Item>
                        <Anchor href={"/account-settings"}>Settings</Anchor>
                    </Menu.Item>
                    <Menu.Item>
                        Log Out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Flex>
    )
}