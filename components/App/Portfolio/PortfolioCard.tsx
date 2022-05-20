import React from "react";
import { Group, Badge, ActionIcon, Button, DefaultMantineColor, Tooltip, Skeleton, ThemeIcon } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, OperationContext, useQuery } from "urql";
import dayjs from "@cryptuoso/libs/dayjs";
import { Briefcase, Check, Receipt2, Refresh, X } from "tabler-icons-react";
import { IUserSub } from "@cryptuoso/components/App/Subscription";
import { BaseCard, CardHeader, CardLine } from "@cryptuoso/components/App/Card";
import { PortfolioOptions, UserPortfolio } from "./types";
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

export function PortfolioCard({
    status,
    message,
    options,
    fetching,
    reexecuteQuery
}: {
    status?: UserPortfolio["status"];
    message?: UserPortfolio["message"];
    options?: PortfolioOptions;
    fetching: boolean;
    reexecuteQuery: (opts?: { requestPolicy?: OperationContext["requestPolicy"] }) => void;
}) {
    const optionRows = options ? (
        Object.entries(options).map(([key, value]) => {
            return (
                <CardLine
                    key={key}
                    title={getOptionName(key as keyof PortfolioOptions)}
                    loading={!status}
                    value={
                        <ThemeIcon size="sm" color={value ? "green" : "gray"}>
                            {value ? <Check size={18} /> : <X size={18} />}
                        </ThemeIcon>
                    }
                    titleTooltip={getOptionDesc(key as keyof PortfolioOptions)}
                />
            );
        })
    ) : (
        <Skeleton height={30} />
    );

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
                        <ActionIcon
                            color="gray"
                            variant="hover"
                            onClick={() => reexecuteQuery({ requestPolicy: "network-only" })}
                        >
                            <Refresh size={18} />
                        </ActionIcon>
                    </Group>
                }
            />
            {optionRows}
        </BaseCard>
    );
}
