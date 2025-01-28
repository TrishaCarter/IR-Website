import { Flex, Group, Image, Text } from "@mantine/core"

export default function Navbar() {
    return (
        <Flex justify={"space-between"} align={"center"} w={"100%"} p={"lg"}>
            <Group>
                <Text>Logo</Text>
                <Text>Home</Text>
            </Group>
            <Text>Account</Text>
        </Flex>
    )
}