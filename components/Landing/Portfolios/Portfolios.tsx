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
    LoadingOverlay
} from "@mantine/core";

import { Coin, CurrencyDollar, ListCheck, Minus, Plus, Scale } from "tabler-icons-react";
import { gql, useQuery } from "urql";
import { StatsCard } from "@cryptuoso/components/Stats/StatsCard";

const useStyles = createStyles((theme) => {
    return {
        wrapper: {
            paddingTop: theme.spacing.xl * 2,
            paddingBottom: theme.spacing.xl * 2,
            minHeight: 650
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
                avgPercentNetProfit: avg_percent_net_profit_yearly
                winRate: win_rate
                percentMaxDrawdown: percent_max_drawdown
                payoffRatio: payoff_ratio
                sharpeRatio: sharpe_ratio
                recoveyFactor: recovery_factor
                avgTradesCount: avg_trades_count_years
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
    avgPercentNetProfit: number;
    winRate: number;
    percentMaxDrawdown: number;
    payoffRatio: number;
    sharpeRatio: number;
    recoveyFactor: number;
    avgTradesCount: number;
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
    console.log(data);
    console.log(fetching);
    console.log(error);
    return (
        <Container size="xl" className={classes.wrapper} id="faq">
            <Title align="center" className={classes.title}>
                Portfolio Performance
            </Title>
            <Grid grow gutter="xl">
                <Grid.Col span={4}>
                    <Stack spacing="xs">
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

                        <CheckboxGroup
                            mt="sm"
                            defaultValue={["profit"]}
                            label="Select portfolio options"
                            size="lg"
                            value={options}
                            onChange={(val) => setOptions(val as Option[])}
                            orientation="vertical"
                            spacing="xl"
                        >
                            <Checkbox value={Option.profit} label="Profit" className={classes.checkbox} mt="sm" />
                            <Checkbox value={Option.winRate} label="Win Rate" className={classes.checkbox} />
                            <Checkbox value={Option.risk} label="Risk" className={classes.checkbox} />
                            <Checkbox
                                value={Option.moneyManagement}
                                label="Money Management"
                                className={classes.checkbox}
                            />
                            <Checkbox value={Option.efficiency} label="Efficiency" className={classes.checkbox} />
                        </CheckboxGroup>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={8}>
                    <LoadingOverlay visible={fetching} />
                    {portfolioStats && (
                        <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                            <StatsCard
                                Icon={Coin}
                                title="Profit"
                                diff={portfolioStats.avgPercentNetProfit}
                                value={`${addPercent(balance, portfolioStats.avgPercentNetProfit)} $`}
                                desc="Average yearly profit"
                            />
                            <StatsCard
                                Icon={ListCheck}
                                title="Average trades"
                                value={Math.round(portfolioStats.avgTradesCount)}
                                desc="Average trades per year"
                            />
                            <StatsCard
                                Icon={Plus}
                                title="Win Rate"
                                value={`${portfolioStats.winRate} %`}
                                desc="Average trades win rate"
                            />
                            <StatsCard
                                Icon={Minus}
                                title="Max Drawdown"
                                value={`-${calcPercentValue(
                                    addPercent(balance, portfolioStats.avgPercentNetProfit),
                                    portfolioStats.percentMaxDrawdown
                                )} $`}
                                diff={-portfolioStats.percentMaxDrawdown}
                                desc="Average maximum balance drawdown"
                            />
                            <StatsCard
                                Icon={Scale}
                                title="Payoff Ratio"
                                value={portfolioStats.payoffRatio}
                                desc="Ratio between wins and losses"
                            />
                            <StatsCard
                                Icon={Scale}
                                title="Sharpe Ratio"
                                value={portfolioStats.sharpeRatio}
                                desc="Return compared to risk"
                            />
                        </SimpleGrid>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
}
