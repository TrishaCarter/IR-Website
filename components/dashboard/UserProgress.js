import { Card, Title, Text, Progress, Group, Badge, Flex } from "@mantine/core";
import { IconTrophy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getUserById } from "../../firebase";
import { getUserCurrency, getUserSolvedProblems } from "../../queries";

export default function UserProgress({ user }) {
    let [solvedProbs, setSolvedProbs] = useState(0);
    let [currency, setCurrency] = useState(0);

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        console.log("Passed User: ", user);

        getUserSolvedProblems(user).then((solvedProblems) => { setSolvedProbs(solvedProblems) })

        getUserCurrency(user).then((currency) => setCurrency(currency))
    }, []);

    return (

        <Card shadow="sm" padding="md" radius="md" w={"45vw"}
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.primaryTextColor,
                border: `1px solid ${theme.primaryTextColor}`
            }}>
            <Title order={3} c={theme.accentColor}>Your Progress</Title>
            <Flex direction="row" align="flex-start" justify="space-around" h={"100%"} py={"md"}>
                {/* <Text size="sm" c={theme.secondaryTextColor}>Total problems solved: {solvedProbs}</Text> */}
                <Badge color={theme.accentColor} size="lg" radius={"sm"}>
                    Total problems solved: {solvedProbs}
                </Badge>
                <Badge color={theme.accentColor} size="lg" radius={"sm"}>
                    Currency Earned: {currency}
                </Badge>
            </Flex>
        </Card>
    );
}