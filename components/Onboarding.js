import { useState } from "react";
import { Modal, Button, TextInput, MultiSelect, Title } from "@mantine/core";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function OnboardingModals({ onComplete }) {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [skills, setSkills] = useState([]);
    const [favoriteLanguages, setFavoriteLanguages] = useState([]);

    // Move to next modal
    const nextStep = () => setStep(step + 1);

    return (
        <>
            {/* Step 1: Username */}
            <Modal opened={step === 1} onClose={() => { }} centered>
                <Title order={3}>Choose a Username</Title>
                <TextInput
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    mt="md"
                />
                <Button onClick={nextStep} mt="md" disabled={!username}>Next</Button>
            </Modal>

            {/* Step 2: Coding Skills */}
            <Modal opened={step === 2} onClose={() => { }} centered>
                <Title order={3}>What Are Your Coding Skills?</Title>
                <MultiSelect
                    data={["Algorithms", "Data Structures", "Web Development", "Machine Learning", "Cybersecurity"]}
                    placeholder="Select your skills"
                    value={skills}
                    onChange={setSkills}
                    mt="md"
                />
                <Button onClick={nextStep} mt="md" disabled={skills.length === 0}>Next</Button>
            </Modal>

            {/* Step 3: Favorite Coding Languages */}
            <Modal opened={step === 3} onClose={() => { }} centered>
                <Title order={3}>Favorite Programming Languages</Title>
                <MultiSelect
                    data={["Python", "JavaScript", "C++", "Java", "Rust", "Go", "TypeScript"]}
                    placeholder="Select your favorite languages"
                    value={favoriteLanguages}
                    onChange={setFavoriteLanguages}
                    mt="md"
                />
                <Button onClick={() => onComplete(username, skills, favoriteLanguages)} mt="md" disabled={favoriteLanguages.length === 0}>Finish</Button>
            </Modal>
        </>
    );
}