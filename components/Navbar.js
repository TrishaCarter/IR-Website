import { Flex, Group, Anchor, Space, Text } from "@mantine/core"

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
            <Text>Account</Text>
        </Flex>
    )
}