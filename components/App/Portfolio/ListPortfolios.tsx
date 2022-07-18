import {
    ExchangeAccountQuery,
    ExchangesQuery,
    portfoliosQuery,
    portfoliosWithPositionsQuery,
    UserExAccAndPortfolioQuery
} from "@cryptuoso/queries";
import {
    PortfolioOptions,
    PortfolioSettings,
    UserPortfolio,
    Option,
    StatsInfo,
    UserExAcc,
    BasePosition
} from "@cryptuoso/types";
import { Button, Group, LoadingOverlay, Stack, useMantineTheme, Text, ThemeIcon, Select, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "urql";
import { BaseCard, CardHeader } from "@cryptuoso/components/App/Card";
import { equals, getPortfolioOptionsIcons } from "@cryptuoso/helpers";
import { Check } from "tabler-icons-react";
import { OptionsPicker } from "@cryptuoso/components/App/Portfolio/controls";
import { PortfolioSimpleStats } from "@cryptuoso/components/App/Portfolio/PortfolioSimpleStats";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { PositionsList } from "./PositionsList";
import { Section } from "../Trading/Section";

export function ListPortfolios({
    userExAcc,
    userPortfolio,
    fetching
}: {
    userExAcc?: UserExAcc;
    userPortfolio?: UserPortfolio;
    fetching?: boolean;
}) {
    const router = useRouter();
    const queryParams = router.query;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [result] = useQuery<
        {
            exchanges: {
                code: string;
                name: string;
            }[];
        },
        { userId: string }
    >({ query: ExchangesQuery, requestPolicy: "cache-first" });
    const { data: exchangesData, fetching: exchangesFetching, error: exchangesError } = result;
    const exchanges = exchangesData?.exchanges || [];

    if (exchangesError) console.error(exchangesError);

    const [exchange, setExchange] = useState<string>(
        userExAcc?.exchange ||
            ((queryParams?.exchange as string) &&
                exchanges.length &&
                exchanges.find(({ code }) => code === queryParams?.exchange)?.code) ||
            exchanges[0]?.code ||
            "binance_futures"
    );

    const portfolioOptionsArray = Object.entries(queryParams || {})
        .filter(
            ([key, value]) =>
                ["profit", "risk", "moneyManagement", "winRate", "efficiency"].includes(key) && value === "true"
        )
        .map(([key]) => key as Option);

    let [options, setOptions] = useState<Option[]>(
        (portfolioOptionsArray &&
            Array.isArray(portfolioOptionsArray) &&
            portfolioOptionsArray.length &&
            portfolioOptionsArray) || [Option.profit]
    );

    const selectedOptions: PortfolioOptions = useMemo(() => {
        const opts = {
            profit: false,
            risk: false,
            moneyManagement: false,
            winRate: false,
            efficiency: false
        };

        for (const option of options) {
            opts[option] = true;
        }
        return opts;
    }, [options]);

    useEffect(() => {
        const newQuery = { exchange: exchange, ...selectedOptions };
        if (equals(newQuery, queryParams)) return;
        router.push(
            {
                query: newQuery
            },
            undefined,
            { shallow: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exchange, selectedOptions]);

    const [portfoliosResult, reexecutePortfoliosQuery] = useQuery<{
        portfolios: [
            {
                stats: StatsInfo;
                closedPositions: BasePosition[];
            }
        ];
    }>({
        query: portfoliosWithPositionsQuery,
        variables: { exchange: exchange, ...selectedOptions }
    });

    const { data: portfoliosData, fetching: portfoliosFetching, error: portfoliosError } = portfoliosResult;

    const portfolioStats = portfoliosData?.portfolios[0]?.stats;
    const closedPositions = portfoliosData?.portfolios[0]?.closedPositions || [];
    const subscribed = userPortfolio && equals(userPortfolio?.settings.options, selectedOptions);

    const [, userPortfolioEditOptions] = useMutation<
        { result: { result: string } },
        {
            userPortfolioId: string;
            options: PortfolioOptions;
        }
    >(
        gql`
            mutation userPortfolioEditOptions($userPortfolioId: uuid!, $options: PortfolioOptions!) {
                result: userPortfolioEdit(userPortfolioId: $userPortfolioId, options: $options) {
                    result
                }
            }
        `
    );
    const modals = useModals();

    const openConfirmModal = () =>
        modals.openConfirmModal({
            title: "Please confirm",
            children: (
                <Stack>
                    <Text weight={500}>Your current portfolio:</Text>
                    <Group>{getPortfolioOptionsIcons(userPortfolio?.settings?.options, "key")}</Group>

                    <Text weight={500}>Are you sure you want to subscribe to this portfolio?</Text>
                    <Group>{getPortfolioOptionsIcons(selectedOptions, "key")}</Group>
                </Stack>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            onConfirm: () => handleSubmit()
        });

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await userPortfolioEditOptions({
            userPortfolioId: userPortfolio?.id || "",
            options: selectedOptions
        });

        if (result?.error) {
            setLoading(false);
            setError(result.error.message.replace("[GraphQL] ", ""));
        } else if (result?.data?.result?.result) {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={0}>
            <Grid grow gutter="xs">
                <Grid.Col span={12} lg={5}>
                    <BaseCard fetching={fetching || exchangesFetching} justify="flex-start">
                        <CardHeader title="Exchange" />
                        <Select
                            data={exchanges.map(({ code, name }) => ({ label: name, value: code }))}
                            placeholder="Exchange"
                            value={exchange}
                            disabled={!!userExAcc}
                            onChange={(value) => value && setExchange(value)}
                        />
                    </BaseCard>
                </Grid.Col>
                <Grid.Col span={12} lg={7}>
                    <BaseCard fetching={fetching || portfoliosFetching} justify="flex-start">
                        <CardHeader title="Portfolio Options" />

                        <OptionsPicker options={options} setOptions={setOptions} />
                        {(portfoliosError?.message || error) && (
                            <Text color="red" size="sm" mt="sm" weight={500}>
                                {portfoliosError?.message || error}
                            </Text>
                        )}
                    </BaseCard>
                </Grid.Col>
            </Grid>
            <Section
                title="Public Portfolio Performance History"
                right={
                    subscribed ? (
                        <Group spacing={5} position="right" align="flex-start">
                            <ThemeIcon color="green" size="sm">
                                <Check />
                            </ThemeIcon>
                            <Text color="green" weight={500}>
                                You are subscribed to this portfolio
                            </Text>
                        </Group>
                    ) : (
                        userPortfolio && (
                            <Button
                                compact
                                variant="gradient"
                                disabled={subscribed}
                                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                                onClick={openConfirmModal}
                                loading={loading}
                            >
                                Subscribe
                            </Button>
                        )
                    )
                }
            >
                <PortfolioSimpleStats
                    stats={portfolioStats}
                    fetching={portfoliosFetching}
                    reexecuteQuery={reexecutePortfoliosQuery}
                />
            </Section>

            <Section title="Latest Positions">
                <BaseCard fetching={portfoliosFetching} justify="flex-start">
                    <PositionsList positions={closedPositions} type={"closed"} />
                </BaseCard>
            </Section>
        </Stack>
    );
}
