import { Title, Text, Box, Flex, Space } from "@mantine/core"
import { getAllProblems } from "@/firebase"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProblemHomepage() {
    let [problems, setProblems] = useState([])

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        getAllProblems().then((problems) => {
            setProblems(problems)
            console.log(problems);

        })
    }, [])

    return <Flex w={"100vw"} h={"100vh"} m={0} pt={50} direction={"column"} align={"center"}
        style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
    >
        <Title order={1}>Problems Homepage</Title>
        <Text>Page to list popular problems, or search for new ones</Text>

        <Space h={20} />

        {/* As of now, display all problems in the DB */}
        <Flex direction={"column"} align={"center"}>
            {problems.map((problem, index) => {
                return <Box key={index} w={"80vw"} p={10} pl={30} m={10} style={{ backgroundColor: theme.secondaryBackground, borderRadius: 15 }}>
                    <Link href={`/problems/${problem.id}`} color="white">{index + 1}. {problem.title}</Link>
                </Box>
            })}

        </Flex>
    </Flex>
}