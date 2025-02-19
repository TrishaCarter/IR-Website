import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextInput, MultiSelect, Button, Container, Title, Box, Flex } from "@mantine/core";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Onboarding() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [skills, setSkills] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [user, setCurrentUser] = useState();

    useEffect(() => {
        auth.onAuthStateChanged(user => setCurrentUser(user));
    }, []);

    const completeOnboarding = async () => {
        if (!user) return;

        // 🔥 Save user data to Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            username,
            skills,
            languages,
            hasCompletedOnboarding: true,
        }, { merge: true });

        // ✅ Redirect to dashboard
        router.push("/dashboard");
    };

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return <Box w={"100vw"} h={"100vh"} bg={theme.background} c={theme.primaryTextColor} p={0} m={0}>
        <Container size="sm" pt={50}>
            <Flex w={"100%"} justify="center">
                <Title order={1} c={theme.accentColor}>Welcome! Let's Get Started</Title>
            </Flex>

            <TextInput
                label="Choose a Username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                mt="md"
                c={theme.accentColor}
            />

            <MultiSelect
                label="What Are Your Coding Skills?"
                data={["Algorithms", "Data Structures", "Web Development", "Machine Learning", "Cybersecurity"]}
                placeholder="Select your skills"
                value={skills}
                onChange={setSkills}
                mt="md"
                c={theme.accentColor}
            />

            <MultiSelect
                label="Favorite Programming Languages"
                data={["Python", "JavaScript", "C++", "Java", "Rust", "Go", "TypeScript"]}
                placeholder="Select your favorite languages"
                value={languages}
                onChange={setLanguages}
                mt="md"
                c={theme.accentColor}
            />

            <Flex w={"100%"} justify="center">
                <Button onClick={completeOnboarding} mt="md" disabled={!username || skills.length === 0 || languages.length === 0}
                    bg={theme.accentColor} c={"white"} variant="outline" radius="md" size="lg"
                >
                    Finish & Go to Dashboard
                </Button>
            </Flex>
        </Container>
    </Box>;
}