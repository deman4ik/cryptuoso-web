import React from "react";
import { Group, Badge, Button, Tooltip, Skeleton, ThemeIcon, Text, Stack } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useQuery } from "urql";
import {
    Adjustments,
    Bolt,
    Briefcase,
    Check,
    Coin,
    PlayerPlay,
    PlayerStop,
    PresentationAnalytics,
    Receipt,
    ReceiptRefund,
    Scale,
    TrendingDown,
    Trophy,
    X
} from "tabler-icons-react";
import { BaseCard, CardHeader, CardLine, RefreshAction } from "@cryptuoso/components/App/Card";
import { PortfolioOptions, UserPortfolio } from "@cryptuoso/types";
import { SimpleLink } from "@cryptuoso/components/Link";
import { getOptionDesc, getOptionIcon, getOptionName, getPortfolioOptionsIcons } from "@cryptuoso/helpers";

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

function portfolioStatusToBoolean(status?: UserPortfolio["status"]) {
    if (status === "started" || status === "starting") return true;
    return false;
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

    const optionRows = getPortfolioOptionsIcons(myPortfolio?.settings?.options);

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
                            label={myPortfolio?.status === "started" ? "Active" : myPortfolio?.message || "Disabled"}
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
                        <Button color="gray" variant="subtle" compact uppercase rightIcon={<Adjustments size={18} />}>
                            Configure
                        </Button>
                        <Button
                            variant="subtle"
                            compact
                            uppercase
                            color={portfolioStatusToBoolean(myPortfolio?.status) ? "gray" : "green"}
                            rightIcon={
                                portfolioStatusToBoolean(myPortfolio?.status) ? (
                                    <PlayerStop size={18} />
                                ) : (
                                    <PlayerPlay size={18} />
                                )
                            }
                        >
                            {portfolioStatusToBoolean(myPortfolio?.status) ? "Stop" : "Start"}
                        </Button>

                        <RefreshAction reexecuteQuery={reexecuteQuery} />
                    </Group>
                }
            />

            <Group align="flex-end" spacing="xl" position="apart">
                <Stack spacing={0}>
                    <Group spacing="xs"> {optionRows}</Group>

                    <Text size="sm" color="dimmed" mt={7} weight={500}>
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
                    <Text size="sm" color="dimmed" mt={7} weight={500}>
                        Trading Amount
                    </Text>
                </Stack>
            </Group>
        </BaseCard>
    );
}
