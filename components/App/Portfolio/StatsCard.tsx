import React, { ReactNode } from "react";
import { Card, createStyles, Group, Paper, SimpleGrid, Skeleton, Text } from "@mantine/core";
import {
    UserPlus,
    Discount2,
    Receipt2,
    Coin,
    ArrowUpRight,
    ArrowDownRight,
    Icon as TablerIcon
} from "tabler-icons-react";
import { BaseCard } from "@cryptuoso/components/App/Card";

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
    value: string | number;
    diff?: number;
    fetching?: boolean;
}

export function StatsCard({ title, desc, Icon, value, diff, fetching, ...others }: StatsCardProps) {
    const { classes } = useStyles();

    const DiffIcon = diff && diff > 0 ? ArrowUpRight : ArrowDownRight;
    return (
        <BaseCard fetching={fetching}>
            <Group position="apart">
                <Text size="md" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                <Icon className={classes.icon} size={22} />
            </Group>

            {fetching ? (
                <Skeleton height={200} />
            ) : (
                <>
                    <Group align="flex-end" spacing="xs" mt={25}>
                        <Text className={classes.value}>{value}</Text>
                        {diff && (
                            <Text color={diff > 0 ? "teal" : "red"} size="sm" weight={500} className={classes.diff}>
                                <span>{diff}%</span>
                                <DiffIcon size={16} />
                            </Text>
                        )}
                    </Group>

                    <Text size="sm" color="dimmed" mt={7}>
                        {desc}
                    </Text>
                </>
            )}
        </BaseCard>
    );
}
