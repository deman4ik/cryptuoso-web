import React from "react";
import { createStyles, Card, Avatar, Text, Group, Button, List } from "@mantine/core";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
        height: "100%"
    },

    avatar: {
        border: `2px solid ${theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white}`
    }
}));

interface TeamCardProps {
    image: string;
    avatar: string;
    name: string;
    job: string;
    info: string[];
}

export function TeamCard({ image, avatar, name, job, info }: TeamCardProps) {
    const { classes, theme } = useStyles();

    return (
        <Card withBorder p="xl" radius="md" className={classes.card}>
            <Card.Section
                sx={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 140
                }}
            />
            <Avatar src={avatar} size={80} radius={80} mx="auto" mt={-30} className={classes.avatar} />
            <Text align="center" size="lg" weight={500} mt="sm">
                {name}
            </Text>
            <Text align="center" size="sm" color="dimmed">
                {job}
            </Text>
            <List mt={10} spacing="xs">
                {info.map((t, i) => (
                    <List.Item color="dimmed" key={i}>
                        {t}
                    </List.Item>
                ))}
            </List>
        </Card>
    );
}
