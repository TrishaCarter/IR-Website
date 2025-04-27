import { Title, Text, Container, Flex, TextInput, Grid, Card, Stack, Group, Button } from "@mantine/core"
import { getAllProblems } from "@/firebase"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../_app"
import Link from "next/link"
import Navbar from "../../components/Navbar";
import { auth, getUserSolutions } from "../../firebase";

export default function ProblemHomepage() {
    const [problems, setProblems] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [unsolved, setUnsolved] = useState([]);
    const [finished, setFinished] = useState([]);
    const [search, setSearch] = useState('');

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }
    const { user, loading } = useContext(AuthContext);
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        // Wait for both promises to resolve before trying to filter. 
        // A problem came up where both states were not updating in a proper time to filter correctly.
        const userId = auth.currentUser.uid;
        Promise.all([getAllProblems(), getUserSolutions(userId)])
            .then(([allProblems, userSolutions]) => {
                setProblems(allProblems);
                setSolutions(userSolutions);

                // Problems with a solution that is not finished (In-Progress)
                const inProgressArr = allProblems.filter(problem =>
                    userSolutions.some(solution => solution.probid === problem.id && solution.finished === false)
                );

                // Problems with no solution (Unsolved)
                const unsolvedArr = allProblems.filter(problem =>
                    !userSolutions.some(solution => solution.probid === problem.id)
                );

                // Problems with a finished solution (Finished)
                const finishedArr = allProblems.filter(problem =>
                    userSolutions.some(solution => solution.probid === problem.id && solution.finished === true)
                );

                setInProgress(inProgressArr);
                setUnsolved(unsolvedArr);
                setFinished(finishedArr);

                console.log("In-Progress", inProgressArr);
                console.log("Unsolved", unsolvedArr);
                console.log("Finished", finishedArr);
            })
            .catch(err => console.error(err));
    }, [user, loading]);


    // Filter each group by the search term
    const filteredInProgress = inProgress.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );
    const filteredUnsolved = unsolved.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );
    const filteredFinished = finished.filter(p =>
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

    // Helper to render a grid of problem cards
    const renderGrid = (problemsGroup) => (
        <Grid gutter="lg">
            {problemsGroup.map(problem => (
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
    );

    return <Flex w={"100vw"} minh={"100vh"} m={0} direction={"column"} align={"center"}
        style={{ backgroundColor: theme.background, color: theme.primaryTextColor }}
    >
        <Navbar />

        <Container size="xl" py="xl" mih={"90vh"}>
            <Title order={2} mb="md" ta={"center"}>
                All Problems
            </Title>

            <TextInput
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                mb="lg"
            />

            {/* In-Progress Problems */}
            {filteredInProgress.length > 0 && (
                <>
                    <Title order={3} mb="md" ta="center">In-Progress</Title>
                    {renderGrid(filteredInProgress, "Continue")}
                </>
            )}

            {/* Unsolved Problems */}
            {filteredUnsolved.length > 0 && (
                <>
                    <Title order={3} mb="md" ta="center" mt="xl">Unsolved</Title>
                    {renderGrid(filteredUnsolved, "Solve")}
                </>
            )}

            {/* Finished Problems */}
            {filteredFinished.length > 0 && (
                <>
                    <Title order={3} mb="md" ta="center" mt="xl">Finished</Title>
                    {renderGrid(filteredFinished, "View")}
                </>
            )}

        </Container>
    </Flex>
}