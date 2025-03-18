import { Container, Title, Text, Button, SimpleGrid, Box, ThemeIcon, Group, Flex } from "@mantine/core";
import { IconCheck, IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function LandingPage() {
    let router = useRouter();
    let moveToLogin = () => {
        router.push("/login")
    }
    let moveToSignUp = () => {
        router.push("/signup")
    }

    let callContainer = () => {
        fetch("http://localhost:1738/run", {
            method: "POST",
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));
    }

    return (
        <div style={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", paddingTop: "50px" }}>
            {/* Hero Section */}
            <Container size="lg" style={{ textAlign: "center", marginBottom: "40px" }}>
                <Title order={1} size="3rem" style={{ color: "#6EBF63" }}>
                    Welcome to Refactr
                </Title>
                <Text size="lg" mt="md" style={{ color: "#A0A0A0" }}>
                    The ultimate platform to practice, solve, and master coding challenges.
                </Text>
                <Group justify="center" mt="xl">
                    <Button size="lg" style={{ backgroundColor: "#4CAF50" }} onClick={moveToSignUp}>
                        Get Started
                    </Button>
                    <Button size="lg" variant="outline" style={{ color: "#6EBF63", borderColor: "#6EBF63" }}>
                        Learn More
                    </Button>
                </Group>
            </Container>

            {/* <Flex w={"100vw"} justify={"center"}>
                <Button onClick={callContainer}>Call Container</Button>
            </Flex> */}

            {/* Features Section */}
            <Container size="lg" mb="60px">
                <SimpleGrid
                    cols={3}
                    spacing="lg"
                    breakpoints={[
                        { maxWidth: "md", cols: 2 },
                        { maxWidth: "sm", cols: 1 },
                    ]}
                >
                    <Feature
                        icon={<IconCheck size={24} />}
                        title="Real Coding Challenges"
                        description="Practice problems designed by industry experts to sharpen your skills."
                    />
                    <Feature
                        icon={<IconCheck size={24} />}
                        title="Detailed Analytics"
                        description="Track your progress with visual insights and data-driven feedback."
                    />
                    <Feature
                        icon={<IconCheck size={24} />}
                        title="Code Optimization"
                        description="Get better-optimized solutions to your coding problems as you learn."
                    />
                </SimpleGrid>
            </Container>

            {/* Call-to-Action Section */}
            <Box style={{ backgroundColor: "#2C2C2C", padding: "40px 20px", textAlign: "center" }}>
                <Title order={2} size="2rem" style={{ color: "#fff" }}>
                    Ready to Master Coding?
                </Title>
                <Text size="md" mt="md" style={{ color: "#A0A0A0" }}>
                    Join thousands of developers on the path to coding mastery.
                </Text>
                <Button size="lg" mt="xl" rightIcon={<IconArrowRight />} style={{ backgroundColor: "#4CAF50" }}>
                    Start Practicing Now
                </Button>
            </Box>
        </div>
    );
}

function Feature({ icon, title, description }) {
    return (
        <Box style={{ textAlign: "center" }}>
            <ThemeIcon size={40} radius="xl" style={{ backgroundColor: "#6EBF63", margin: "0 auto" }}>
                {icon}
            </ThemeIcon>
            <Text size="lg" weight={500} mt="md">
                {title}
            </Text>
            <Text size="sm" mt="sm" style={{ color: "#A0A0A0" }}>
                {description}
            </Text>
        </Box>
    );
}
