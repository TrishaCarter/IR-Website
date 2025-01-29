import { Flex, Group, Image, Space, Text } from "@mantine/core"

export default function Navbar() {
    return (
        <Flex justify={"space-between"} align={"center"} w={"100%"} p={"lg"}>
            <Group>
                <Text>Logo</Text>
                <Space w={"lg"} />
                <Text>Dashboard</Text>
                <Text>Problems</Text>
            </Group>
            <Text>Account</Text>
        </Flex>
    )
}