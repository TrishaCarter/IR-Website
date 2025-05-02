import { Card, Title, Text, Badge, Group, Tooltip } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getUserById } from "../../firebase";

export default function UserBadges({ uid }) {
    let [userAchievedBadges, setUserAchievedBadges] = useState([]);

    let badges = [
        {
            name: "First Steps",
            desc: "Create an account!",
            slug: "first-steps",
        },
        {
            name: "Major Coder",
            desc: "Solve your first problem!",
            slug: "major-coder",
        },
        {
            name: "Smitty Werbenjägermanjensen",
            desc: "He Was Number One! (on atleast 1 problem)",
            slug: "he-was-number-one"
        },
        {
            name: "5-Piece",
            desc: "Solve 5 problems!",
            slug: "5-piece",
        },
    ]

    let theme = {
        background: '#16171b',
        secondaryBackground: '#262729',
        primaryTextColor: '#c9c9c9',
        secondaryTextColor: '#aaaaaa',
        accentColor: '#629C44',
    }

    useEffect(() => {
        getUserById(uid).then((user) => {
            let achievedBadges = user?.badges || [];
            console.log(user?.badges);

            setUserAchievedBadges(achievedBadges);
        })
    }, []);

    const BadgeComponent = ({ badge, achieved }) => (
        achieved ?
            <Tooltip label={badge.desc} withArrow>
                <Badge color="green" variant="light" size={"lg"}>{badge.name}</Badge>
            </Tooltip >
            :
            <Tooltip label={badge.desc} withArrow>
                <Badge color="gray" leftSection={<IconLock size={12} />} size="lg">{badge.name}</Badge>
            </Tooltip>
    );

    return (
        <Card shadow="sm" padding="lg" mt={"md"} w={"45vw"} radius="md"
            style={{
                backgroundColor: theme.secondaryBackground,
                color: theme.primaryTextColor,
                border: `1px solid ${theme.primaryTextColor}`
            }}
        >
            <Title pb={"sm"} order={3} c={theme.accentColor}>Badges Earned</Title>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {badges.map((badge, index) => {
                    const isAchieved = userAchievedBadges.includes(badge.slug);
                    return (
                        <BadgeComponent key={index} badge={badge} achieved={isAchieved} />
                    );
                })}
            </div>
        </Card>
        // <Card shadow="sm" padding="lg" mt={"md"} w={"45vw"} radius="md"
        //     style={{
        //         backgroundColor: theme.secondaryBackground,
        //         color: theme.primaryTextColor,
        //         border: `1px solid ${theme.primaryTextColor}`
        //     }}>
        //     <Title order={3} style={{ color: "#6EBF63" }}>Badges Earned</Title>

        //     <Group mt="md" spacing="xs">
        //         {badges.map((badge, index) => (
        //             badge.earned ? (
        //                 <Badge key={index} color="green" variant="light" size={"lg"}>{badge.name}</Badge>
        //             ) : (
        //                 <Badge key={index} color="gray" leftSection={<IconLock size={12} />} size="lg">
        //                     {badge.name}
        //                 </Badge>
        //             )
        //         ))}
        //     </Group>
        // </Card>
    );
}