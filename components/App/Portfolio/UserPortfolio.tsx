import React, { useState } from "react";
import { Group, Badge, Button, Tooltip, Skeleton, ThemeIcon, Text, Stack, Modal } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "urql";
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
import {
    getOptionDesc,
    getOptionIcon,
    getOptionName,
    getPortfolioOptionsIcons,
    isPortfolioStarted
} from "@cryptuoso/helpers";
import { MyPortfolioQuery } from "@cryptuoso/queries";
import { ChangeUserPortfolioStatusForm, EditPortfolio } from ".";

export function UserPortfolio() {
    const { data: session } = useSession<true>({ required: true });
    const [statusModalOpened, setStatusModalOpened] = useState(false);
    const [settingsModalOpened, setSettingsModalOpened] = useState(false);
    const [result, reexecuteQuery] = useQuery<
        {
            userPortfolio: UserPortfolio[];
        },
        { userId: string }
    >({ query: MyPortfolioQuery, variables: { userId: session?.user?.userId || "" } });
    const { data, fetching, error } = result;
    const userPortfolio = data?.userPortfolio[0];
    const isStarted = isPortfolioStarted(userPortfolio?.status);
    if (error) console.error(error);

    const optionRows = getPortfolioOptionsIcons(userPortfolio?.settings?.options);

    const amountText =
        `${userPortfolio?.settings?.balancePercent} %` || `${userPortfolio?.settings?.tradingAmountCurrency} $`;
    const amountTypeText =
        userPortfolio?.settings?.tradingAmountType === "balancePercent" ? "% of the balance" : "fixed in USD";

    return (
        <BaseCard fetching={fetching}>
            <CardHeader
                title="Portfolio"
                left={
                    userPortfolio ? (
                        <Tooltip
                            transition="fade"
                            transitionDuration={500}
                            transitionTimingFunction="ease"
                            placement="start"
                            label={isStarted ? "Active" : userPortfolio?.message || "Disabled"}
                            color={isStarted ? "green" : "red"}
                        >
                            <Badge color={isStarted ? "green" : "red"} size="sm">
                                {userPortfolio?.status}
                            </Badge>
                        </Tooltip>
                    ) : (
                        <Skeleton height={18} width={60} />
                    )
                }
                right={
                    <Group spacing={0}>
                        <Button
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Adjustments size={18} />}
                            onClick={() => setSettingsModalOpened(true)}
                        >
                            Configure
                        </Button>
                        <Button
                            variant="subtle"
                            compact
                            uppercase
                            color={isStarted ? "gray" : "green"}
                            rightIcon={isStarted ? <PlayerStop size={18} /> : <PlayerPlay size={18} />}
                            onClick={() => setStatusModalOpened(true)}
                        >
                            {isStarted ? "Stop" : "Start"}
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
            <Modal
                centered
                opened={statusModalOpened}
                onClose={() => setStatusModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        {isStarted ? "Stop portfolio" : "Start portfolio"}
                    </Text>
                }
            >
                <ChangeUserPortfolioStatusForm
                    id={userPortfolio?.id || ""}
                    isStarted={isStarted}
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setStatusModalOpened(false);
                    }}
                    onCancel={() => setStatusModalOpened(false)}
                />
            </Modal>
            <Modal
                centered
                opened={settingsModalOpened}
                onClose={() => setSettingsModalOpened(false)}
                title={
                    <Text transform="uppercase" weight={900} align="center">
                        Configure portfolio
                    </Text>
                }
                size="90%"
            >
                <EditPortfolio
                    userPortfolio={userPortfolio}
                    onSuccess={() => {
                        reexecuteQuery({ requestPolicy: "network-only" });
                        setSettingsModalOpened(false);
                    }}
                    onCancel={() => setSettingsModalOpened(false)}
                />
            </Modal>
        </BaseCard>
    );
}
