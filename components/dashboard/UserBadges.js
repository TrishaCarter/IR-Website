import { Card, Title, Text, Badge, Group } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";

export default function UserBadges({ userBadges }) {

    let badges = userBadges ? userBadges : [
        { name: "First Problem Solved", earned: true },
        { name: "10 Problems Solved", earned: true },
        { name: "25 Problems Solved", earned: false },
        { name: "50 Problems Solved", earned: false },
        { name: "100 Problems Solved", earned: false },
    ]

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    return (
        <Card shadow="sm" padding="lg" mt={"md"} w={"45vw"} radius="md"
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.primaryTextColor,
                border: `1px solid ${theme.primaryTextColor}`
            }}>
            <Title order={3} style={{ color: "#6EBF63" }}>Badges Earned</Title>

            <Group mt="md" spacing="xs">
                {badges.map((badge, index) => (
                    badge.earned ? (
                        <Badge key={index} color="green" variant="light" size={"lg"}>{badge.name}</Badge>
                    ) : (
                        <Badge key={index} color="gray" leftSection={<IconLock size={12} />} size="lg">
                            {badge.name}
                        </Badge>
                    )
                ))}
            </Group>
        </Card>
    );
}