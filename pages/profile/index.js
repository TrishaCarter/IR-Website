
import { Container, Space, Text, SimpleGrid, Box, Divider, Button, Stack, Flex, Grid, Avatar, Center, Title, Badge } from "@mantine/core"
import Navbar from "../../components/Navbar"

export default function Profile() {
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

    let user = {
        username: "Username",
        languages: ["Python", "Java", "C++", "JavaScript"],
        skills: ["Data Structures", "Algorithms", "Web Development", "Machine Learning"],
        curProblems: [
            {
                name: "Two Sum",
                difficulty: "Easy",
                desc: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                tags: ["Array", "Hash Table"],
            },
            {
                name: "Add Two Numbers",
                difficulty: "Easy",
                desc: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit.",
                tags: ["Linked List", "Math"],
            },
            {
                name: "Longest Substring Without Repeating Characters",
                desc: "Given a string s, find the length of the longest substring without repeating characters.",
                difficulty: "Hard",
                tags: ["Hash Table", "Two Pointers", "String"],
            },
            {
                name: "Median of Two Sorted Arrays",
                desc: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
                difficulty: "Hard",
                tags: ["Array", "Binary Search", "Divide and Conquer"],
            }
        ]
    }

    return <Flex direction="column" align={"center"}>
        <Navbar />
        <Space h="lg" />
        <Grid grow columns={12} w={"90%"}>
            <Grid.Col span={8}>
                <Box style={boxStyling}>
                    <Title align="center" order={3}>Problems</Title>
                    <Space h="md" />
                    <Divider />
                    <Space h="md" />
                    <Title order={3}>Unsolved Problems</Title>
                    <Divider my={10} />
                    {user.curProblems.map((prob) => <>
                        <Grid columns={12} w={"95%"} grow h={90}>
                            <Grid.Col span={3}>
                                <Flex justify={"center"} align={"center"} h={"100%"}>
                                    <Text>{prob.name}</Text>
                                </Flex>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Flex direction="column" align={"center"} w={"100%"}>
                                    {prob.difficulty == "Easy" ?
                                        <Badge color={theme.accentColor} m={8}>Easy</Badge> :
                                        <Badge color={"red"} m={8}>Hard</Badge>
                                    }
                                    <Box>
                                        {prob.tags.map((tag) => <Badge color={theme.accentColor} m={8} variant="light">{tag}</Badge>)}
                                    </Box>
                                </Flex>
                            </Grid.Col>
                            <Grid.Col span={1}>
                                <Flex justify={"center"} align={"center"}>
                                    <Button color={theme.accentColor} variant="light" my={"xl"}>{">"}</Button>
                                </Flex>
                            </Grid.Col>
                        </Grid >
                        <Divider my={10} />
                    </>
                    )}
                </Box>
            </Grid.Col>

            <Grid.Col span={4}>
                <Box style={boxStyling}>
                    <Flex direction="column" align="center" justify="center">
                        <Avatar radius={"xl"} size={"xl"} />
                        <Title order={2}>{user.username}</Title>
                        <Button w={"70%"} mt={10} color={theme.accentColor}>Account Settings</Button>
                    </Flex>
                    <Space h="md" />
                    <Divider />
                    <Space h="md" />
                    <Stack spacing="md">
                        <Title order={3}>Languages</Title>
                        <Box>
                            {user.languages.map((language) => <Badge color={theme.accentColor} m={8} variant="light">{language}</Badge>)}
                        </Box>
                    </Stack>
                    <Space h="md" />
                    <Divider />
                    <Space h="md" />
                    <Stack spacing="md">
                        <Title order={3}>Skills</Title>
                        <Box>
                            {user.skills.map((skill) => <Badge color={theme.accentColor} m={8} variant="light">{skill}</Badge>)}
                        </Box>
                    </Stack>
                </Box>
            </Grid.Col>
        </Grid>

    </Flex >
}