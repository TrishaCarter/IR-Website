import { Card, Title, Text, Progress } from "@mantine/core";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../queries";

export default function LeaderboardSpot({ uid }) {
    let [rank, setRank] = useState(0);
    let [userCount, setUserCount] = useState(0);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        getLeaderboard()
            .then((users) => {
                // Get the rank of the current user
                let userRank = users.findIndex(user => user.id === uid);

                setRank(userRank);
                setUserCount(users.length)
            })
            .then(() => {
                // console.log("Rank: ", rank);
                // console.log("User Count: ", userCount);
                console.log("User", uid);
            })


    }, [])

    return (
        <Card shadow="sm" padding="lg" mt="md" radius="md" w={"45vw"}
            style={{
                backgroundColor: theme.secondaryBackground, color: theme.primaryTextColor, border: `1px solid ${theme.primaryTextColor}`
            }}>
            <Title order={3} c={theme.accentColor}> Global Leaderboard</ Title>
            <Title order={4} size="sm" c={theme.primaryTextColor}>Your rank: <b>#{rank + 1}</b> out of {userCount}</Title>

            <Progress value={(1 - (rank + 1) / userCount) * 100} size="sm" color="blue" mt="md" />
        </Card >
    );
}