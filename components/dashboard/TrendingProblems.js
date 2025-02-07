import { Card, Title, Text, Badge, Stack, Group } from "@mantine/core";

export default function TrendingProblems({ topProblems }) {

    let problems = topProblems ? topProblems : [
        { name: "Two Sum", difficulty: "Easy" },
        { name: "Add Two Numbers", difficulty: "Medium" },
        { name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
        { name: "Median of Two Sorted Arrays", difficulty: "Hard" },
        { name: "Longest Palindromic Substring", difficulty: "Medium" },
    ]

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
        whiteTextColor: '#ffffff'
    }

    return (
        <Card shadow="sm" w={"45vw"} padding="lg" radius="md"
            style={{
                backgroundColor: theme.secondaryBackground,
                color: "#fff",
                border: "1px solid #fff"
            }}>
            <Title order={3} style={{ color: "#6EBF63" }}>Trending Problems</Title>
            <Text size="sm" c={theme.secondaryTextColor}>Look at the most popular problems!</Text>

            <Stack mt="md">
                {problems.map((problem, index) => (
                    <Group position="apart" >
                        <Title order={4} style={{ color: "#fff" }}>{index + 1}.</Title>
                        <Card key={index} shadow="xs" padding="sm" style={{ backgroundColor: "#1e1e1e" }} w={"90%"}>
                            <Text size="sm" style={{ color: theme.whiteTextColor }}>{problem.name}</Text>

                            <Badge color={problem.difficulty === "Easy" ? "green" : problem.difficulty === "Medium" ? "orange" : "red"} mt={5}>
                                {problem.difficulty}
                            </Badge>
                        </Card>
                    </Group>
                ))}
            </Stack>
        </Card>
    );
}
