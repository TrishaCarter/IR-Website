import { Title, Text, Box, Flex } from "@mantine/core"

export default function ProblemHomepage() {

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return <Flex w={"100vw"} h={"100vh"} m={0} pt={50} direction={"column"} align={"center"}
        style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
    >
        <Title order={1}>Problems Homepage</Title>
        <Text>Page to list popular problems, or search for new ones</Text>
    </Flex>
}