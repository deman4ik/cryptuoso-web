import React, { ReactNode } from "react";
import { Card, CardProps, createStyles, Group, Paper, SimpleGrid, Skeleton, Stack, Sx, Text } from "@mantine/core";
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

export const plusNum = (value: number) => (value > 0 ? `+${value}` : value);

export interface StatsCardProps {
    title: string;
    Icon: TablerIcon;
    values: {
        value?: number | string;
        valueType?: null | "%" | "$";
        diff?: number;
        desc: string;
        changeValueColor?: boolean;
        plusValue?: boolean;
    }[];
    fetching?: boolean;
    sx?: Sx;
}

export function StatsCard({ title, Icon, fetching, values, ...others }: StatsCardProps) {
    const { classes } = useStyles();

    const rows = values.map(({ value = 0, valueType, desc, diff, changeValueColor, plusValue }, i) => {
        const DiffIcon = diff && diff > 0 ? ArrowUpRight : ArrowDownRight;
        return (
            <Stack key={i} spacing={0} mt={25}>
                <Group align="flex-end" spacing="xs">
                    <Text
                        className={classes.value}
                        color={changeValueColor === true ? (value > 0 ? "teal" : "red") : undefined}
                    >
                        {plusValue
                            ? `${plusNum(+value)}${valueType ? ` ${valueType}` : ""}`
                            : `${value}${valueType ? ` ${valueType}` : ""}`}
                    </Text>
                    {diff && (
                        <Text color={diff > 0 ? "teal" : "red"} size="sm" weight={500} className={classes.diff}>
                            <span>{diff}%</span>
                            <DiffIcon size={16} />
                        </Text>
                    )}
                </Group>

                <Text size="sm" color="dimmed" mt={7} weight={500}>
                    {desc}
                </Text>
            </Stack>
        );
    });

    return (
        <BaseCard fetching={fetching} {...others}>
            <Group position="apart">
                <Text size="md" color="dimmed" className={classes.title}>
                    {title}
                </Text>
                <Icon className={classes.icon} size={22} />
            </Group>

            {fetching ? (
                <Skeleton height={75} />
            ) : (
                <Group align="flex-end" position="apart">
                    {rows}
                </Group>
            )}
        </BaseCard>
    );
}
