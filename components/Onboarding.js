import { useState } from "react";
import { Modal, Button, TextInput, MultiSelect, Title, Box } from "@mantine/core";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
// import '@/styles/global.css'

export default function OnboardingModals({ onComplete }) {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [skills, setSkills] = useState([]);
    const [favoriteLanguages, setFavoriteLanguages] = useState([]);

    // Move to next modal
    const nextStep = () => setStep(step + 1);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return (
        <>
            {/* Step 1: Username */}
            <Modal opened={step === 1} onClose={() => { }} centered styles={{ content: { '--mantine-color-body': theme.secondaryBackground } }}>

                <Title order={3} c={theme.accentColor}>Choose a Username</Title>
                <TextInput
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    mt="md"
                    styles={{ input: { backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor } }}

                />
                <Button onClick={nextStep} mt="md" disabled={!username} c={"white"} bg={theme.accentColor}>Next</Button>
            </Modal>

            {/* Step 2: Coding Skills */}
            <Modal opened={step === 2} onClose={() => { }} centered styles={{ content: { '--mantine-color-body': theme.secondaryBackground } }}>
                <Title order={3} c={theme.accentColor}>What Are Your Coding Skills?</Title>
                <MultiSelect
                    data={["Algorithms", "Data Structures", "Web Development", "Machine Learning", "Cybersecurity"]}
                    placeholder="Select your skills"
                    value={skills}
                    onChange={setSkills}
                    mt="md"
                    styles={{
                        input: { backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor },
                        dropdown: { backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor },
                        option: { backgroundColor: theme.background, color: theme.accentColor },
                        pill: { backgroundColor: theme.accentColor, color: "white" },
                    }}

                />
                <Button onClick={nextStep} mt="md" disabled={skills.length === 0} bg={theme.accentColor} c={"white"}>Next</Button>
            </Modal>

            {/* Step 3: Favorite Coding Languages */}
            <Modal opened={step === 3} onClose={() => { }} centered styles={{ content: { '--mantine-color-body': theme.secondaryBackground } }}>
                <Title order={3} c={theme.accentColor}>Favorite Programming Languages</Title>
                <MultiSelect
                    data={["Python", "JavaScript", "C++", "Java", "Rust", "Go", "TypeScript"]}
                    placeholder="Select your favorite languages"
                    value={favoriteLanguages}
                    onChange={setFavoriteLanguages}
                    mt="md"
                    styles={{
                        input: { backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor },
                        dropdown: { backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor },
                        option: { backgroundColor: theme.background, color: theme.accentColor },
                        pill: { backgroundColor: theme.accentColor, color: "white" },
                    }}
                />
                <Button onClick={() => onComplete(username, skills, favoriteLanguages)}
                    mt="md" disabled={favoriteLanguages.length === 0}
                    bg={theme.accentColor} c={"white"}
                >Finish</Button>
            </Modal>
        </>
    );
}