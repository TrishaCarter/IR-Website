import { Card, Title, Text, Badge, Stack, Group, Button, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import { getProblemsWithSolutionCounts } from "../../queries";

export default function TrendingProblems() {
    let [problems, setProblems] = useState([]);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        getProblemsWithSolutionCounts()
            .then((problems) => {
                console.log(problems);
                setProblems(problems.slice(0, 5));

            })
            .catch((error) => {
                console.error("Error fetching problems with solution counts:", error);
            });
    }, [])

    let handleProbRedirect = (slug) => {
        // Redirect to the problem page
        window.location.href = `/problems/${slug}`;
    }

    return (
        <Card shadow="sm" w={"45vw"} padding="lg" radius="md"
            style={{
                backgroundColor: theme.secondaryBackground,
                color: "#fff",
                border: "1px solid #fff"
            }}>
            <Title order={3} c={theme.accentColor}>Trending Problems</Title>
            <Text size="sm" c={theme.secondaryTextColor}>These problems currently have the most solutions!</Text>

            <Stack mt="md">
                {problems.map((problem, index) => (
                    <Group position="apart" key={index}>
                        <Title order={4} style={{ color: "#fff" }}>{index + 1}.</Title>
                        <Card key={index} shadow="xs" px={"md"} style={{ backgroundColor: "#1e1e1e" }} w={"90%"}>
                            <Flex w={"100%"} h={"100%"} direction={"row"} justify="space-between" align="center">
                                <Text size="sm" c={theme.primaryTextColor}>{problem.title}</Text>
                                <Button px="5" w={"60px"} h={40} size="sm"
                                    bg={theme.accentColor}
                                    onClick={() => handleProbRedirect(problem.slugTitle)}
                                >Solve!</Button>
                            </Flex>
                        </Card>
                    </Group>
                ))}
            </Stack>
        </Card>
    );
}