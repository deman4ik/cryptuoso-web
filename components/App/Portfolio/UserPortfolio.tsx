import React, { useState } from "react";
import { Group, Badge, Button, Tooltip, Skeleton, ThemeIcon, Text, Stack, Modal, useMantineTheme } from "@mantine/core";
import { useSession } from "next-auth/react";
import { gql, useMutation, useQuery } from "urql";
import {
    Adjustments,
    Bolt,
    Briefcase,
    Check,
    Coin,
    PlayerPlay,
    PlayerPause,
    PresentationAnalytics,
    Receipt,
    ReceiptRefund,
    Scale,
    TrendingDown,
    Trophy,
    X,
    Settings
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
import { UserPortfolioQuery } from "@cryptuoso/queries";
import { ChangeUserPortfolioStatusForm, EditPortfolio } from ".";
import { refetchOptions } from "@cryptuoso/libs/graphql";
import { useMediaQuery } from "@mantine/hooks";

export function UserPortfolio() {
    const theme = useMantineTheme();
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints["md"]}px)`, false);
    const { data: session } = useSession<true>({ required: true });
    const [statusModalOpened, setStatusModalOpened] = useState(false);
    const [settingsModalOpened, setSettingsModalOpened] = useState(false);
    const [result, reexecuteQuery] = useQuery<
        {
            userPortfolio: UserPortfolio[];
        },
        { userId: string }
    >({ query: UserPortfolioQuery, variables: { userId: session?.user?.userId || "" } });
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
                            label={isStarted ? "Active" : userPortfolio?.message || "Disabled"}
                            color={isStarted ? "green" : "red"}
                            events={{ hover: true, touch: true, focus: false }}
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
                    <Group spacing={0} position="right" align="flex-start">
                        <Button
                            color="gray"
                            variant="subtle"
                            compact
                            uppercase
                            rightIcon={<Settings size={18} />}
                            onClick={() => setSettingsModalOpened(true)}
                            styles={(theme) => ({
                                rightIcon: {
                                    marginLeft: 5
                                }
                            })}
                        >
                            Configure
                        </Button>
                        <Button
                            variant="subtle"
                            compact
                            uppercase
                            color={isStarted ? "gray" : "green"}
                            rightIcon={isStarted ? <PlayerPause size={18} /> : <PlayerPlay size={18} />}
                            onClick={() => setStatusModalOpened(true)}
                            styles={(theme) => ({
                                rightIcon: {
                                    marginLeft: 5
                                }
                            })}
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
                        label={amountTypeText}
                        events={{ hover: true, touch: true, focus: false }}
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
                        reexecuteQuery(refetchOptions);
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
                size={mobile ? "99%" : "80%"}
            >
                <EditPortfolio
                    userPortfolio={userPortfolio}
                    onSuccess={() => {
                        reexecuteQuery(refetchOptions);
                        setSettingsModalOpened(false);
                    }}
                    onCancel={() => setSettingsModalOpened(false)}
                />
            </Modal>
        </BaseCard>
    );
}
