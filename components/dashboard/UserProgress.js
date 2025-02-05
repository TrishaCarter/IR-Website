import { Card, Title, Text, Progress, Group, Badge, Flex } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";

export default function UserProgress({ userProgress }) {

    let progress = userProgress?.progress || {
        easySolved: 8,
        mediumSolved: 3,
        hardSolved: 1,
        total: 12,
        currency: 20000,
        topStrength: "Linked Lists"
    };

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return (
        <Card shadow="sm" padding="md" radius="md" w={"45vw"} h={191}
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.primaryTextColor,
                border: `1px solid ${theme.primaryTextColor}`
            }}>
            <Title order={3} style={{ color: "#6EBF63" }}>Progress Snapshot</Title>
            <Text size="sm" c={theme.secondaryTextColor}>Your coding journey so far</Text>

            <Flex direction="row" justify="space-around" mt="md">
                <Group position="apart" mx="md">
                    <><Text c={"green"}>Easy:</Text> <Text>{progress.easySolved}</Text></>
                    <Progress value={(progress.easySolved / progress.total) * 100} size="sm" color="green" />
                </Group>

                <Group position="apart" mx="xs">
                    <><Text c={"yellow"}>Medium:</Text> <Text>{progress.mediumSolved}</Text></>
                    <Progress value={(progress.mediumSolved / progress.total) * 100} size="sm" color="orange" />
                </Group>

                <Group position="apart" mx="xs">
                    <><Text c={"red"}>Hard:</Text> <Text>{progress.hardSolved}</Text></>
                    <Progress value={(progress.hardSolved / progress.total) * 100} size="sm" color="red" />
                </Group>
            </Flex>

            <Flex direction="row" justify="space-around" mt="md">
                <Badge color={"orange"} mt="md">
                    Currency Gained: {progress.currency}
                </Badge>

                <Group mt="md">
                    <IconTrophy color="gold" size={18} />
                    <Text>Top Strength: {progress.topStrength}</Text>
                </Group>
            </Flex>
        </Card>
    );
}