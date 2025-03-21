import { Title, Text, Container, Flex, TextInput, Grid, Card, Stack, Group, Button } from "@mantine/core"
import { getAllProblems } from "@/firebase"
import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "../../components/Navbar";

export default function ProblemHomepage() {
    let [problems, setProblems] = useState([]);
    let [search, setSearch] = useState('');

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

    const filtered = problems.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    // Returns a slugified version of a string to use in the redirect link
    const slugify = (str) => {
        return encodeURIComponent(
            str
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, '') // Remove special characters
                .trim()
                .replace(/\s+/g, '-') // Replace spaces with hyphens
        );
    };

    return <Flex w={"100vw"} h={"100vh"} m={0} direction={"column"} align={"center"}
        style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
    >
        <Navbar />

        <Container size="xl" py="xl">
            <Title order={2} mb="md" ta={"center"}>
                All Problems
            </Title>

            <TextInput
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                mb="lg"
            />

            <Grid gutter="lg">
                {filtered.map((problem) => (
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={problem.id}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.secondaryBackground} c={theme.accentColor} h={250}>
                            <Stack>
                                <Group justify="space-between" h={50}>
                                    <Text fw={700}>{problem.title}</Text>
                                    <Text size="sm" c="dimmed">
                                        {problem.author}
                                    </Text>
                                </Group>
                                <Text size="sm" c="gray" h={65}>
                                    {problem.description?.slice(0, 215)}
                                    {problem.description?.length > 215 ? "..." : ""}
                                </Text>

                                <Button
                                    h={40}
                                    component={Link}
                                    href={`/problems/${slugify(problem.title)}`}
                                    variant="light"
                                    color="blue"
                                    fullWidth
                                    mt="md"
                                >
                                    Solve
                                </Button>
                            </Stack>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

        </Container>
    </Flex>
}