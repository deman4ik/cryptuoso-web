import React, { ReactNode } from "react";
import { createStyles, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import {
    UserPlus,
    Discount2,
    Receipt2,
    Coin,
    ArrowUpRight,
    ArrowDownRight,
    Icon as TablerIcon
} from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1
    },

    diff: {
        lineHeight: 1,
        display: "flex",
        alignItems: "center"
    },

    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4]
    },

    title: {
        fontWeight: 700,
        textTransform: "uppercase"
    }
}));

const icons = {
    user: UserPlus,
    discount: Discount2,
    receipt: Receipt2,
    coin: Coin
};

export interface StatsCardProps {
    title: string;
    desc: string;
    Icon: TablerIcon;
    value: string;
    diff?: number;
}

export function StatsCard({ title, desc, Icon, value, diff }: StatsCardProps) {
    const { classes } = useStyles();

    const DiffIcon = diff && diff > 0 ? ArrowUpRight : ArrowDownRight;
    return (
        <Paper withBorder p="md" radius="md" key={title}>
            <Group position="apart">
                <Text size="xs" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                <Icon className={classes.icon} size={22} />
            </Group>

            <Group align="flex-end" spacing="xs" mt={25}>
                <Text className={classes.value}>{value}</Text>
                {diff && (
                    <Text color={diff > 0 ? "teal" : "red"} size="sm" weight={500} className={classes.diff}>
                        <span>{diff}%</span>
                        <DiffIcon size={16} />
                    </Text>
                )}
            </Group>

            <Text size="xs" color="dimmed" mt={7}>
                {desc}
            </Text>
        </Paper>
    );
}
