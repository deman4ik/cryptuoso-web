import React from "react";
import {
    Group,
    Badge,
    ActionIcon,
    Button,
    DefaultMantineColor,
    Tooltip,
    Skeleton,
    ThemeIcon,
    Text,
    Stack,
    createStyles
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, OperationContext, useQuery } from "urql";
import dayjs from "@cryptuoso/libs/dayjs";
import { Briefcase, Check, Circle, Receipt2, Refresh, X } from "tabler-icons-react";
import { IUserSub } from "@cryptuoso/components/App/Subscription";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";
import { PortfolioOptions, PortfolioSettings, UserPortfolio } from "./types";
import { SimpleLink } from "@cryptuoso/components/Link";

export function getOptionDesc(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return "Profit maximization";
        case "winRate":
            return "Maximizing the number of profitable trades";
        case "risk":
            return "Earnings with minimal risk";
        case "moneyManagement":
            return "Increase the ratio between the size of the win and the loss's size";
        case "efficiency":
            return "The return of an investment compared to it's risk";
        default:
            return "";
    }
}

export function getOptionName(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return "Profit";
        case "winRate":
            return "Win Rate";
        case "risk":
            return "Risk";
        case "moneyManagement":
            return "Money Management";
        case "efficiency":
            return "Efficiency";
        default:
            return "";
    }
}

const useStyles = createStyles((theme) => ({
    content: {
        display: "flex"
    }
}));

export function PortfolioCard({
    status,
    message,
    settings,
    fetching,
    reexecuteQuery
}: {
    status?: UserPortfolio["status"];
    message?: UserPortfolio["message"];
    settings?: PortfolioSettings;
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    const { classes } = useStyles();

    const optionRows = settings?.options ? (
        Object.entries(settings.options)
            .sort(([, value]) => (value ? -1 : 1))
            .map(([key, value]) => {
                return (
                    <CardLine
                        key={key}
                        loading={!status}
                        title={
                            <ThemeIcon size="sm" variant="light" color={value ? "green" : "gray"}>
                                {value ? <Check size={18} /> : <X size={18} />}
                            </ThemeIcon>
                        }
                        value={
                            <Text size="md" weight={700}>
                                {getOptionName(key as keyof PortfolioOptions)}
                            </Text>
                        }
                        valueTooltip={getOptionDesc(key as keyof PortfolioOptions)}
                        position="left"
                        mt={0}
                    />
                );
            })
    ) : (
        <Skeleton height={30} />
    );

    const amountText = settings?.balancePercent || settings?.tradingAmountCurrency;
    const amountTypeText = settings?.tradingAmountType === "balancePercent" ? "% of the balance" : "$ fixed";

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="My Portfolio"
                left={
                    status ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={status === "started" ? "Active" : message}
                            color={status === "started" ? "green" : "red"}
                        >
                            <Badge color={status === "started" ? "green" : "red"} size="sm">
                                {status}
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Skeleton height={18} width={60} />
                    )
                }
                right={
                    <Group spacing="xs">
                        <Button
                            component={SimpleLink}
                            href="/app/my-portfolio"
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Briefcase size={18} />}
                        >
                            DETAILS
                        </Button>
                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            <Group align="flex-end" spacing="xl">
                <Stack spacing={0}>
                    {optionRows}
                    <Text size="sm" color="dimmed" mt={7}>
                        Options
                    </Text>
                </Stack>
                <Stack spacing={0}>
                    <Text size="md" weight={700}>
                        {`${amountText} ${amountTypeText}`}
                    </Text>
                    <Text size="sm" color="dimmed" mt={7}>
                        Trading Amount
                    </Text>
                </Stack>
            </Group>
        </BaseCard>
    );
}
