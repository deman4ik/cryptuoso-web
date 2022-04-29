import React, { useState } from "react";
import {
    Container,
    Title,
    Accordion,
    createStyles,
    Grid,
    Group,
    CheckboxGroup,
    Tooltip,
    Checkbox,
    Stack,
    NumberInput,
    Slider,
    SimpleGrid,
    LoadingOverlay,
    Text,
    Chips,
    Chip,
    Alert
} from "@mantine/core";

import { AlertCircle, Coin, CurrencyDollar, ListCheck, Minus, Plus, Scale } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { StatsCard } from "@cryptuoso/components/Stats/StatsCard";

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 650,
            position: "relative"
        },

        title: {
            fontWeight: 900,
            marginBottom: theme.spacing.xl * 1.5
        },
        checkbox: {
            marginLeft: theme.spacing.lg
        }
    };
});

const portfolioQuery = gql`
    query publicPortfolios(
        $exchange: String!
        $risk: Boolean!
        $profit: Boolean!
        $winRate: Boolean!
        $efficiency: Boolean!
        $moneyManagement: Boolean!
    ) {
        portfolios: v_portfolios(
            where: {
                exchange: { _eq: $exchange }
                option_risk: { _eq: $risk }
                option_profit: { _eq: $profit }
                option_win_rate: { _eq: $winRate }
                option_efficiency: { _eq: $efficiency }
                option_money_management: { _eq: $moneyManagement }
                status: { _eq: "started" }
                base: { _eq: true }
            }
            limit: 1
        ) {
            stats {
                netProfit: net_profit
                percentNetProfit: avg_percent_net_profit_yearly
                winRate: win_rate
                percentMaxDrawdown: percent_max_drawdown
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                tradesCount: avg_trades_count_yearly
            }
        }
    }
`;

const enum Option {
    profit = "profit",
    risk = "risk",
    winRate = "winRate",
    efficiency = "efficiency",
    moneyManagement = "moneyManagement"
}

interface PortfolioStats {
    netProfit: number;
    percentNetProfit: number;
    winRate: number;
    percentMaxDrawdown: number;
    payoffRatio: number;
    sharpeRatio: number;
    tradesCount: number;
}

function addPercent(num: number, perc: number) {
    const number = +num || 0;
    const percent = +perc || 0;
    return Math.round(number + (number / 100) * percent);
}

function calcPercentValue(num: number, percent: number) {
    return Math.round((percent / 100) * num);
}

export function Portfolios() {
    const { classes } = useStyles();
    let [options, setOptions] = useState<Option[]>([Option.profit]);
    if (!options.length) options = [Option.profit];
    const [balance, setBalance] = useState(1000);
    const selectedOptions: { [key: string]: boolean } = {
        profit: false,
        risk: false,
        moneyManagement: false,
        winRate: false,
        efficiency: false
    };

    for (const option of options) {
        selectedOptions[option as any] = true;
    }

    const [result] = useQuery<{
        portfolios: [
            {
                stats: PortfolioStats;
            }
        ];
    }>({
        query: portfolioQuery,
        variables: { exchange: "binance_futures", ...selectedOptions }
    });
    const { data, fetching, error } = result;

    let portfolioStats: PortfolioStats | undefined;

    if (data) {
        portfolioStats = data.portfolios[0].stats;
    }

    return (
        <Container size="xl" className={classes.wrapper} id="portfolio">
            <LoadingOverlay visible={fetching} />
            <Title align="center" className={classes.title}>
                Portfolio Performance
            </Title>
            <Grid grow gutter="xl">
                <Grid.Col span={5}>
                    <Stack spacing="xs" justify="space-between">
                        <Stack>
                            <NumberInput
                                value={balance}
                                onChange={(val) => val && setBalance(val)}
                                label="Your starting balance"
                                icon={<CurrencyDollar size={18} />}
                                step={1000}
                                min={1000}
                                max={100000}
                                hideControls
                                variant="unstyled"
                                size="xl"
                            />
                            <Slider
                                step={1000}
                                min={1000}
                                max={100000}
                                label={null}
                                value={balance}
                                onChange={setBalance}
                                size="xl"
                                radius={0}
                                mt={-20}
                                marks={[
                                    { value: 1000 },
                                    { value: 10000 },
                                    { value: 20000 },
                                    { value: 30000 },
                                    { value: 40000 },
                                    { value: 50000 },
                                    { value: 60000 },
                                    { value: 70000 },
                                    { value: 80000 },
                                    { value: 90000 },
                                    { value: 100000 }
                                ]}
                            />
                        </Stack>
                        <Stack>
                            <Text size="xl" weight={500} mt="xl">
                                Select portfolio options
                            </Text>
                            <Chips
                                mt="md"
                                multiple={true}
                                value={options}
                                onChange={(val) => setOptions(val as Option[])}
                                size="xl"
                                spacing="lg"
                                align=""
                            >
                                <Chip value={Option.profit}>
                                    <Tooltip wrapLines label="Profit maximization" withArrow>
                                        Profit
                                    </Tooltip>
                                </Chip>

                                <Chip value={Option.winRate}>
                                    <Tooltip wrapLines label="Maximizing the number of profitable trades" withArrow>
                                        Win Rate
                                    </Tooltip>
                                </Chip>
                                <Chip value={Option.risk}>
                                    <Tooltip wrapLines label="Earnings with minimal risk" withArrow>
                                        Risk
                                    </Tooltip>
                                </Chip>
                                <Chip value={Option.moneyManagement}>
                                    <Tooltip
                                        wrapLines
                                        label="Increase the ratio between the size of the win and the loss's size"
                                        withArrow
                                    >
                                        Money Management
                                    </Tooltip>
                                </Chip>
                                <Chip value={Option.efficiency}>
                                    <Tooltip
                                        wrapLines
                                        label="The return of an investment compared to it's risk"
                                        withArrow
                                    >
                                        Efficiency
                                    </Tooltip>
                                </Chip>
                            </Chips>
                        </Stack>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={7}>
                    {error && <Text>{error.message}</Text>}
                    {portfolioStats && (
                        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                            <StatsCard
                                Icon={Coin}
                                title="Profit"
                                diff={Math.round(portfolioStats.percentNetProfit)}
                                value={`${addPercent(balance, portfolioStats.percentNetProfit) - balance} $`}
                                desc="Average yearly profit"
                            />
                            <StatsCard
                                Icon={ListCheck}
                                title="Trades"
                                value={Math.round(portfolioStats.tradesCount)}
                                desc="Average yearly trades"
                            />
                            <StatsCard
                                Icon={Plus}
                                title="Win Rate"
                                value={`${Math.round(portfolioStats.winRate)} %`}
                                desc="Average yearly trades win rate"
                            />
                            <StatsCard
                                Icon={Minus}
                                title="Max Drawdown"
                                value={`-${calcPercentValue(
                                    addPercent(balance, portfolioStats.percentNetProfit),
                                    portfolioStats.percentMaxDrawdown
                                )} $`}
                                diff={Math.round(-portfolioStats.percentMaxDrawdown)}
                                desc="Average yearly maximum balance drawdown"
                            />
                            <StatsCard
                                Icon={Scale}
                                title="Payoff Ratio"
                                value={portfolioStats.payoffRatio}
                                desc="Average yearly ratio between wins and losses"
                            />
                            <StatsCard
                                Icon={Scale}
                                title="Sharpe Ratio"
                                value={portfolioStats.sharpeRatio}
                                desc="Average yearly return ratio compared to risk"
                            />
                        </SimpleGrid>
                    )}
                </Grid.Col>
            </Grid>
            <Alert icon={<AlertCircle size={16} />} title="Notice" mt="lg" color="yellow" variant="outline">
                This information shows approximate trading results and we cannot guarantee them exactly in the future.
                Actual results are highly dependent on the current market situation.
            </Alert>
        </Container>
    );
}
