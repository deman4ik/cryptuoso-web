import React from "react";
import { Group, Badge, Button, Tooltip, Skeleton, ThemeIcon, Text, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import {
    Bolt,
    Briefcase,
    Check,
    Coin,
    PresentationAnalytics,
    Receipt,
    ReceiptRefund,
    Scale,
    TrendingDown,
    Trophy,
    X
} from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";
import { PortfolioOptions, UserPortfolio } from "../Portfolio/types";
import { SimpleLink } from "@cryptuoso/components/Link";

const PortfolioQuery = gql`
    query myPortfolio($userId: uuid!) {
        myPortfolio: v_user_portfolios(where: { user_id: { _eq: $userId } }) {
            id
            userExAccId: user_ex_acc_id
            exchange
            status
            message
            startedAt: started_at
            stoppedAt: stopped_at
            activeFrom: active_from
            settings: user_portfolio_settings
            nextSettings: next_user_portfolio_settings
        }
    }
`;

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

export function getOptionIcon(option: keyof PortfolioOptions) {
    switch (option) {
        case "profit":
            return <Coin size={20} />;
        case "winRate":
            return <Trophy size={20} />;
        case "risk":
            return <Bolt size={20} />;
        case "moneyManagement":
            return <Scale size={20} />;
        case "efficiency":
            return <PresentationAnalytics size={20} />;
        default:
            return "";
    }
}

export function Portfolio() {
    const { data: session } = useSession<true>({ required: true });
    const [result, reexecuteQuery] = useQuery<
        {
            myPortfolio: UserPortfolio[];
        },
        { userId: string }
    >({ query: PortfolioQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;
    const myPortfolio = data?.myPortfolio[0];

    if (error) console.error(error);

    const optionRows = myPortfolio?.settings?.options ? (
        Object.entries(myPortfolio.settings.options)
            .sort(([, value]) => (value ? -1 : 1))
            .map(([key, value]) => {
                return (
                    <Tooltip
                        key={key}
                        transition="fade"
                        transitionDuration={500}
                        transitionTimingFunction="ease"
                        label={
                            <span style={{ whiteSpace: "pre-line" }}>{`${getOptionName(key as keyof PortfolioOptions)}${
                                value ? " ✅" : " ❌"
                            }\n${getOptionDesc(key as keyof PortfolioOptions)}`}</span>
                        }
                    >
                        <ThemeIcon size="md" variant="light" color={value ? "indigo" : "gray"}>
                            {getOptionIcon(key as keyof PortfolioOptions)}
                        </ThemeIcon>
                    </Tooltip>
                );
            })
    ) : (
        <Skeleton height={30} />
    );

    const amountText =
        `${myPortfolio?.settings?.balancePercent} %` || `${myPortfolio?.settings?.tradingAmountCurrency} $`;
    const amountTypeText =
        myPortfolio?.settings?.tradingAmountType === "balancePercent" ? "% of the balance" : "fixed in USD";

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Portfolio"
                left={
                    myPortfolio ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={myPortfolio?.status === "started" ? "Active" : myPortfolio?.message}
                            color={myPortfolio?.status === "started" ? "green" : "red"}
                        >
                            <Badge color={myPortfolio?.status === "started" ? "green" : "red"} size="sm">
                                {myPortfolio?.status}
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Skeleton height={18} width={60} />
                    )
                }
                right={
                    <Group spacing={0}>
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

            <Group align="flex-end" spacing="xl" position="apart">
                <Stack spacing={0}>
                    <Group spacing="xs"> {optionRows}</Group>

                    <Text size="sm" color="dimmed" mt={7}>
                        Options
                    </Text>
                </Stack>
                <Stack spacing={0}>
                    <Tooltip
                        transition="fade"
                        transitionDuration={500}
                        transitionTimingFunction="ease"
                        label={amountTypeText}
                    >
                        <Text size="md" weight={700}>
                            {amountText}
                        </Text>
                    </Tooltip>
                    <Text size="sm" color="dimmed" mt={7}>
                        Trading Amount
                    </Text>
                </Stack>
            </Group>
        </BaseCard>
    );
}
