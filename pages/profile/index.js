
import { Container, Space, Text, SimpleGrid, Box, Divider, Button, Stack, Flex, Grid, Avatar, Center, Title, Badge, Card, Group, RemoveScroll, ScrollArea } from "@mantine/core"
import Navbar from "../../components/Navbar"
import { useRouter } from "next/router"
import { auth, getAllProblems, getUserDoc, getUserSolutions } from "../../firebase"
import { useState, useEffect } from "react"
import Head from "next/head"
import Link from "next/link"

export default function Profile() {
    let router = useRouter()
    let [userDBInfo, setUserDBInfo] = useState(null);
    let [problems, setProblems] = useState([]);
    let [solutions, setSolutions] = useState([]);
    let [inProgress, setInProgress] = useState([]);
    let [unsolved, setUnsolved] = useState([]);
    let [finished, setFinished] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        let getUser = async () => {
            let userAuth = await auth.currentUser;

            if (userAuth == null) {
                console.log("No user logged in");
                router.push("/login")
                return;
            }

            let userDB = await getUserDoc(userAuth.uid);
            if (userDB == null) {
                console.log("No user data found in database");
                return;
            }
            setUserDBInfo(userDB);
            console.log("userDB: ", userDB);

            setLoading(false)
        }

        getUser();

        Promise.all([getAllProblems(), getUserSolutions(auth.currentUser.uid)])
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
    }, [])

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

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let boxStyling = {
        backgroundColor: theme.secondaryBackground,
        padding: "20px",
        border: `1px solid ${theme.primaryTextColor}`,
        borderRadius: "8px",
    }

    return <RemoveScroll>
        <Head>
            <title>{userDBInfo?.displayName || "Profile"} - Refactr</title>
        </Head>
        <Flex direction="column" align={"center"} h={"100vh"} c={theme.primaryTextColor} >
            <Navbar />
            <Grid grow columns={12} w={"100vw"} h={"90vh"} p={"lg"} bg={theme.background}>
                <Grid.Col span={8} h={"85vh"}>
                    <Box style={boxStyling} h={"100%"}>
                        <ScrollArea w={"100%"} h={"100%"} type="always" offsetScrollbars={false} scrollbarSize={0}>
                            {/* <Title align="center" order={3}>Problems</Title> */}
                            {/* <Space h="md" /> */}
                            {/* <Divider /> */}
                            {/* <Space h="md" /> */}
                            <Title order={3}>Unsolved Problems</Title>
                            <Divider my={10} py={5} />
                            {unsolved.length === 0 ? (
                                <Text align="center">No unsolved problems</Text>
                            ) : (
                                <>
                                    <SimpleGrid cols={3} spacing="lg">
                                        {unsolved.map((problem) => (
                                            <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.secondaryBackground} c={theme.accentColor} h={250}>
                                                <Stack>
                                                    <Group justify="space-between" h={50}>
                                                        <Text fw={700} w={"100%"}>{problem.title}</Text>
                                                        <Text size="sm" c="dimmed">
                                                            {problem.author}
                                                        </Text>
                                                    </Group>
                                                    <Text size="sm" c="white" h={75}>
                                                        {problem.description?.slice(0, 150)}
                                                        {problem.description?.length > 150 ? "..." : ""}
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
                                        ))}
                                    </SimpleGrid>
                                </>
                            )}

                            <Space h="md" />
                            <Title order={3}>Solved Problems</Title>
                            <Divider my={10} py={5} />
                            {unsolved.length === 0 ? (
                                <Text align="center">No solved problems</Text>
                            ) : (
                                <>
                                    <SimpleGrid cols={3} spacing="lg">
                                        {finished.map((problem) => (
                                            <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.secondaryBackground} c={theme.accentColor} h={250}>
                                                <Stack>
                                                    <Group justify="space-between" h={50}>
                                                        <Text fw={700} w={"100%"}>{problem.title}</Text>
                                                        <Text size="sm" c="dimmed">
                                                            {problem.author}
                                                        </Text>
                                                    </Group>
                                                    <Text size="sm" c="white" h={75}>
                                                        {problem.description?.slice(0, 150)}
                                                        {problem.description?.length > 150 ? "..." : ""}
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
                                        ))}
                                    </SimpleGrid>
                                </>
                            )}
                        </ScrollArea>
                    </Box>
                </Grid.Col>

                <Grid.Col span={4}>
                    <Box style={boxStyling}>
                        <Flex direction="column" align="center" justify="center">
                            <Avatar src={userDBInfo?.photoURL || ""} radius={"xl"} size={"xl"} />
                            <Title order={2}>{userDBInfo?.displayName || "User"}</Title>
                            <Center>
                                <Badge color={theme.accentColor} variant="light" size={"lg"} w={100} h={32} m={8}>{userDBInfo?.currency || 0} ¢</Badge>
                            </Center>
                            <Button w={"70%"} mt={10} color={theme.accentColor} onClick={() => router.push("/settings")}>Account Settings</Button>
                        </Flex>
                        <Space h="md" />
                        <Divider />
                        <Space h="md" />
                        <Stack spacing="md">
                            <Title order={3}>Languages</Title>
                            <Box>
                                {!loading && userDBInfo.favoriteLanguages.map((lang) => <Badge color={theme.accentColor} m={8} variant="light">{lang}</Badge>)}
                            </Box>
                        </Stack>
                        <Space h="md" />
                        <Divider />
                        <Space h="md" />
                        <Stack spacing="md">
                            <Title order={3}>Skills</Title>
                            <Box>
                                {!loading && userDBInfo.skills.map((skill) => <Badge color={theme.accentColor} m={8} variant="light">{skill}</Badge>)}
                            </Box>
                        </Stack>
                    </Box>
                </Grid.Col>
            </Grid>

        </Flex >
    </RemoveScroll>
}