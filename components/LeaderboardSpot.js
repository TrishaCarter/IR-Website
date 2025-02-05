import { Card, Title, Text, Progress } from "@mantine/core";

export default function LeaderboardSpot({ userRank, totalUsers }) {

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    let rank = userRank ? userRank : 328;
    let userCount = totalUsers ? totalUsers : 1000;

    return (
        <Card shadow="sm" padding="lg" mt="md" radius="md" w={"45vw"}
            style={{
                backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor, border: `1px solid ${theme.primaryTextColor}`
            }}>
            <Title order={3} c={theme.accentColor}> Global Leaderboard</ Title>
            <Title order={4} size="sm" c={theme.primaryTextColor}>Your rank: <b>#{rank}</b> out of {userCount}</Title>

            <Progress value={(1 - rank / userCount) * 100} size="sm" color="blue" mt="md" />
            <Text size="xs" mt="xs" c={theme.primaryTextColor}>
                {rank - 1} more spots to reach the next rank!
            </Text>
        </Card >
    );
}